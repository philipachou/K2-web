import os
import re
import time
import json
import threading
import httpx
import requests
import urllib.parse
import urllib.request
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Load local environment variables if testing locally
load_dotenv()

app = FastAPI(title="K2 Assistive Web Backend")

# Enable CORS for local cross-origin testing if needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_no_cache_headers(request, call_next):
    response = await call_next(request)
    path = request.url.path
    if path.endswith((".html", ".js", ".css")) or path == "/":
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    return response

# Set API Keys
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
ELEVENLABS_API_KEY = os.environ.get("ELEVENLABS_API_KEY", "")

# Initialize Gemini Client if key exists
client = None
if GEMINI_API_KEY:
    client = genai.Client(api_key=GEMINI_API_KEY)

# Thread-local storage to track tool executions securely per request
thread_local = threading.local()

# Define Pydantic Models
class ChatRequest(BaseModel):
    user_message: str
    history: list[dict]
    profile_summary: str
    contacts_summary: str = ""
    settings_summary: str = ""
    macros_summary: str = ""
    app_manual: str = ""
    home_assistant_url: str = ""
    home_assistant_token: str = ""

class ExtractMemoryRequest(BaseModel):
    history: list[dict]
    profile_summary: str = ""
    contacts_summary: str = ""

class ParseBulkFileRequest(BaseModel):
    file_content: str
    target_store: str = "profile"  # "profile" or "contacts"
    mode: str = "replace"         # "replace" or "merge"
    existing_context: str = ""

class PhrasePredictionRequest(BaseModel):
    text_prefix: str
    text_suffix: str
    history: list[dict]
    profile_summary: str

class WordPredictionRequest(BaseModel):
    history: list[dict]
    profile_summary: str
    text_prefix: str

class TTSRequest(BaseModel):
    text: str
    voice_id: str = "URdpYjdnCOSIXKpzB6KE"

# Define Gemini Tools
def speak_phrase(phrase: str) -> str:
    """Speaks a text phrase out loud using text-to-speech.
    
    Args:
        phrase: The text message to speak out loud.
    """
    if hasattr(thread_local, "client_actions"):
        thread_local.client_actions.append({"type": "speak", "text": phrase})
    return f"Spoken phrase: '{phrase}'"

def inject_text(text: str) -> str:
    """Injects a text string into the active window (e.g. typing text for the user).
    
    Args:
        text: The text string to inject/type.
    """
    if hasattr(thread_local, "client_actions"):
        thread_local.client_actions.append({"type": "copy", "text": text})
    return f"Injected text: '{text}'"

def control_home_assistant(service: str, entity_id: str) -> str:
    """Control smart home devices connected to Home Assistant.
    
    Args:
        service: The service to execute, e.g. "turn_on", "turn_off", "toggle", "lock", "unlock".
        entity_id: The target entity ID, e.g. "light.living_room", "switch.smart_plug", "lock.front_door".
    """
    url = getattr(thread_local, "ha_url", "")
    token = getattr(thread_local, "ha_token", "")
    
    if not url or not token:
        msg = f"[Mock HA] Executed service '{service}' on '{entity_id}' successfully."
        if hasattr(thread_local, "client_actions"):
            thread_local.client_actions.append({"type": "status", "detail": msg})
        return msg
        
    domain = entity_id.split(".")[0]
    api_url = f"{url}/api/services/{domain}/{service}"
    payload = {"entity_id": entity_id}
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }
    
    try:
        response = requests.post(api_url, json=payload, headers=headers, timeout=5)
        if response.status_code in [200, 201]:
            msg = f"Successfully executed {service} on {entity_id}."
            if hasattr(thread_local, "client_actions"):
                thread_local.client_actions.append({"type": "status", "detail": f"Home Assistant: {service} on {entity_id}"})
            return msg
        else:
            return f"Home Assistant service failed: {response.text}"
    except Exception as e:
        return f"Error connecting to Home Assistant: {str(e)}"

def get_wikipedia_image(query: str) -> str:
    """Finds and returns an authentic, high-resolution Wikimedia picture URL for any person, place, entity, historical figure, or concept.
    
    Args:
        query: The name of the person, place, or concept to search for (e.g. 'Claude Shannon', 'Albert Einstein', 'Grand Canyon').
    """
    clean_query = query.strip().replace(" ", "_")
    url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{urllib.parse.quote(clean_query)}"
    headers = {"User-Agent": "K2AssistiveWeb/1.0 (philchou@example.com)"}
    try:
        res = requests.get(url, headers=headers, timeout=6)
        if res.status_code == 200:
            data = res.json()
            orig = data.get("originalimage", {}).get("source")
            thumb = data.get("thumbnail", {}).get("source")
            img_url = orig or thumb
            if img_url:
                title = data.get("title", query)
                desc = data.get("description", "")
                caption = f"{title}" + (f" - {desc}" if desc else "")
                if hasattr(thread_local, "client_actions"):
                    thread_local.client_actions.append({
                        "type": "operation",
                        "op_type": "show_image",
                        "data": {"url": img_url, "caption": caption}
                    })
                return f"Successfully retrieved authentic Wikipedia picture of {title}: <operation type=\"show_image\" url=\"{img_url}\" caption=\"{caption}\"/>"
    except Exception as e:
        print("Wikipedia image fetch error:", e)
    return f"Could not find Wikipedia image for '{query}'"

# Operations and Suggestions parsing helper
def parse_xml_attributes(attrs_str: str) -> dict:
    attrs = {}
    full_str = " " + attrs_str
    matches = list(re.finditer(r'\s+([a-zA-Z_][a-zA-Z0-9_-]*)\s*=\s*', full_str))
    for i, m in enumerate(matches):
        key = m.group(1)
        val_start = m.end()
        val_end = matches[i+1].start() if (i + 1 < len(matches)) else len(full_str)
        raw_val = full_str[val_start:val_end].strip()
        if len(raw_val) >= 2 and raw_val[0] in '"\'' and raw_val[-1] == raw_val[0]:
            raw_val = raw_val[1:-1]
        elif len(raw_val) >= 1 and raw_val[0] in '"\'':
            quote = raw_val[0]
            raw_val = raw_val[1:]
            if raw_val.endswith(quote):
                raw_val = raw_val[:-1]
            elif quote in raw_val:
                raw_val = raw_val.rsplit(quote, 1)[0]
        attrs[key] = raw_val.strip()
    return attrs

def parse_operations_and_suggestions(text: str, client_actions: list) -> tuple[str, list[dict]]:
    # Bind thread_local.client_actions so helper functions append to client_actions
    thread_local.client_actions = client_actions

    # 1. Parse <operation ...>...</operation> and self-closing <operation .../>
    op_pattern = r'<operation\s+(.*?)(?:>(.*?)</operation>|/>)'
    op_matches = re.findall(op_pattern, text, re.DOTALL)
    
    for attrs_str, content_str in op_matches:
        attrs = parse_xml_attributes(attrs_str)
        op_type = attrs.get("type", "").strip()
        
        # Merge inner tag content if present
        if content_str and content_str.strip():
            attrs["content"] = content_str.strip()
            
        if op_type == "home_assistant":
            service = attrs.get("service", "")
            entity_id = attrs.get("entity_id", "")
            if service and entity_id:
                control_home_assistant(service, entity_id)
        elif op_type == "speak":
            phrase = attrs.get("phrase", "") or attrs.get("content", "")
            if phrase:
                speak_phrase(phrase)
        elif op_type == "inject":
            txt = attrs.get("text", "") or attrs.get("content", "")
            if txt:
                inject_text(txt)
        elif op_type in ["share", "email", "sms", "export_file", "show_image", "set_timer", "set_alarm", "set_reminder", "profile", "contact", "setting", "macro"]:
            client_actions.append({
                "type": "operation",
                "op_type": op_type,
                "data": attrs
            })

    # Clean operation tags except show_image from user-facing reply (keep show_image embedded for inline frontend card rendering)
    # We remove non-show_image operation tags
    def remove_non_image_ops(match):
        attrs_str = match.group(1)
        attrs = parse_xml_attributes(attrs_str)
        if attrs.get("type") == "show_image":
            return match.group(0)
        return ""

    clean_text = re.sub(r'<operation\s+(.*?)(?:>.*?</operation>|/>)', remove_non_image_ops, text, flags=re.DOTALL)

    # If get_wikipedia_image or helper appended show_image to client_actions, ensure it exists in clean_text
    for act in client_actions:
        if act.get("type") == "operation" and act.get("op_type") == "show_image":
            data = act.get("data", {})
            img_url = data.get("url", "")
            caption = data.get("caption", "") or data.get("content", "")
            if img_url and f'url="{img_url}"' not in clean_text and f'url=\'{img_url}\'' not in clean_text:
                op_tag = f'\n<operation type="show_image" url="{img_url}" caption="{caption}"/>'
                if "Do you want me to:" in clean_text:
                    parts = clean_text.rsplit("Do you want me to:", 1)
                    clean_text = parts[0].strip() + "\n" + op_tag + "\n\nDo you want me to:" + parts[1]
                elif "Would you like me to:" in clean_text:
                    parts = clean_text.rsplit("Would you like me to:", 1)
                    clean_text = parts[0].strip() + "\n" + op_tag + "\n\nWould you like me to:" + parts[1]
                else:
                    clean_text += "\n" + op_tag

    # 2. Parse <suggestions>
    suggestions = []
    action_tags = re.findall(r'<action\s+(.*?)(?:>(.*?)</action>|/>)', text, re.DOTALL)
    for attrs, action_text in action_tags:
        attr_dict = parse_xml_attributes(attrs)
        tag = attr_dict.get("tag", "").strip()
        act_text = action_text.strip() if action_text and action_text.strip() else attr_dict.get("description", "").strip()
        if tag and act_text:
            suggestions.append({
                "tag": tag[:15],
                "action_text": act_text
            })
        
    clean_text = re.sub(r'<suggestions>.*?</suggestions>', '', clean_text, flags=re.DOTALL)
    clean_text = re.sub(r'<action\s+.*?(?:>.*?</action>|/>)', '', clean_text, flags=re.DOTALL)
    # Clean up multi-blank lines and trailing whitespace
    clean_text = re.sub(r'\n{3,}', '\n\n', clean_text).strip()
    if not clean_text:
        clean_text = text.split("<suggestions>")[0].strip()

    # Fallback: Auto-extract 1, 2, 3 options directly from question text if XML block was omitted
    if not suggestions:
        match = re.search(r'(?:Do|Would) you (?:want|like) me to:\s*1\.\s*(.*?),\s*2\.\s*(.*?),\s*(?:or\s*)?3\.\s*(.*?)(?:\?|$)', clean_text, re.IGNORECASE | re.DOTALL)
        if match:
            for choice in match.groups():
                c_text = choice.strip()
                if c_text.lower().startswith("or "):
                    c_text = c_text[3:].strip()
                tag = c_text.title().replace("A New ", " ").replace("An Existing ", " ").replace("All My Current ", " ").replace("  ", " ").strip()[:15]
                suggestions.append({
                    "tag": tag or c_text[:15],
                    "action_text": c_text
                })

    if not suggestions:
        suggestions = [
            {"tag": "Say Thanks", "action_text": "Say Thank you!"},
            {"tag": "Say Hello", "action_text": "Say Hello, how are you today?"},
            {"tag": "Type Kay", "action_text": "Type Kay"}
        ]
    return clean_text, suggestions

@app.post("/api/chat")
def chat(request: ChatRequest):
    if not GEMINI_API_KEY or not client:
        mock_reply = "[Mock Cloud AI] Please configure the GEMINI_API_KEY in your server environment settings."
        mock_sug = [
            {"tag": "Say Hello", "action_text": "Say Hello!"},
            {"tag": "Type Kay", "action_text": "Type Kay"}
        ]
        return {"reply": mock_reply, "suggestions": mock_sug, "client_actions": []}

    # Initialize request-local variables for tool callback logs
    thread_local.client_actions = []
    thread_local.ha_url = request.home_assistant_url
    thread_local.ha_token = request.home_assistant_token

    try:
        # Build types.Content history from client messages
        sdk_history = []
        for msg in request.history:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            if not content.strip():
                continue
            
            # Map role names to google-genai standard user/model values
            sdk_role = "user" if role == "user" else "model"
            sdk_history.append(
                types.Content(
                    role=sdk_role,
                    parts=[types.Part.from_text(text=content)]
                )
            )

        system_instruction = (
            "You are K2, an intelligent, highly capable assistive AI companion for Kay. "
            "Kay reads proficiently. You possess comprehensive general knowledge across all domains (including quantum physics, science, history, technology, literature, and general conversation). "
            "You have access to Google Search for live web information (weather, AQI, news, citations) and sandboxed Python Code Execution for math, list sorting, word counting, and data processing.\n\n"
            "OPERATIONAL ACTIONS:\n"
            "When Kay explicitly or implicitly requests an operational action (including follow-ups like 'Send it again', 'Text him again', 'Do it again'), you MUST include a structured XML <operation> tag inside your response. "
            "NEVER claim to have performed, sent, or repeated an action without including the corresponding <operation .../> tag.\n"
            "Supported operation schemas:\n"
            "  1. Home Assistant: <operation type=\"home_assistant\" service=\"turn_on|turn_off|toggle|lock|unlock\" entity_id=\"...\"/>\n"
            "  2. Text-to-Speech: <operation type=\"speak\" phrase=\"Text to speak out loud\"/>\n"
            "  3. Inject Text: <operation type=\"inject\" text=\"Text to inject/type\"/>\n"
            "  4. Web Share: <operation type=\"share\" title=\"Title\" text=\"Text to share\" url=\"...\"/>\n"
            "  5. Email: <operation type=\"email\" recipient=\"...\" subject=\"...\" body=\"...\"/>\n"
            "  6. SMS / Text Message: <operation type=\"sms\" recipient=\"...\" message=\"...\"/>\n"
            "  7. Export File: <operation type=\"export_file\" filename=\"schedule.csv\" content=\"...\"/>\n"
            "  8. Display Image: <operation type=\"show_image\" url=\"...\" caption=\"...\"/>\n"
            "  9. Set Timer: <operation type=\"set_timer\" seconds=\"300\" label=\"Tea timer\"/>\n"
            " 10. Set Alarm: <operation type=\"set_alarm\" time=\"07:30\" label=\"Morning alarm\"/>\n"
            " 11. Set Reminder: <operation type=\"set_reminder\" time=\"15:00\" label=\"Call Pete\"/>\n"
            " 12. Profile Store: <operation type=\"profile\" action=\"add|set|update|delete\" key=\"Category\" content=\"Text\" old_content=\"...\"/>\n"
            " 13. Contact Store: <operation type=\"contact\" action=\"add|set|update|delete\" key=\"ContactName\" content=\"phone=...; email=...\" old_content=\"...\"/>\n"
            " 14. Setting Store: <operation type=\"setting\" action=\"set\" key=\"SettingKey\" content=\"Value\"/>\n"
            " 15. Macro Store: <operation type=\"macro\" action=\"add|set|update|delete\" key=\"TagLabel\" content=\"Text\" old_content=\"...\"/>\n\n"
            "VISUAL CHARTS, GRAPHS & IMAGES:\n"
            "When Kay requests a graph, chart, visual data trend (e.g. GDP for last 10 years, weather comparison, stock performance), or image:\n"
            "1. You MUST generate an inline visual image using the <operation type=\"show_image\" url=\"...\" caption=\"...\"/> tag.\n"
            "2. For QuickChart URLs, use b=white for a solid white canvas and high-contrast font colors, e.g.: <operation type=\"show_image\" url='https://quickchart.io/chart?b=white&w=650&h=350&c={\"type\":\"line\",\"data\":{\"labels\":[\"2015\",\"2016\",\"2017\",\"2018\",\"2019\",\"2020\",\"2021\",\"2022\",\"2023\",\"2024\",\"2025\"],\"datasets\":[{\"label\":\"U.S. GDP ($ Trillions)\",\"data\":[18.2,18.7,19.5,20.5,21.4,21.1,23.3,25.5,27.4,28.7,29.8],\"borderColor\":\"rgb(31,83,141)\",\"fill\":true}]},\"options\":{\"legend\":{\"labels\":{\"fontColor\":\"#1e293b\",\"fontSize\":14}},\"scales\":{\"xAxes\":[{\"ticks\":{\"fontColor\":\"#1e293b\"}}],\"yAxes\":[{\"ticks\":{\"fontColor\":\"#1e293b\"}}]}}}' caption='U.S. GDP (2015-2025 in Trillions USD)'/>\n"
            "3. When Kay requests a picture of a person, place, historical figure, or concept (e.g. 'show me a picture of Claude Shannon'):\n"
            "   You MUST invoke the get_wikipedia_image tool with query='Claude Shannon'! It will fetch the authentic high-resolution Wikimedia picture and display it directly.\n"
            "4. REPEAT & FOLLOW-UP REQUESTS:\n"
            "   Whenever Kay asks to see an image, picture, or chart again (e.g. 'Show me again the picture of...', 'Show it again', 'See the graph again', 'Show picture of X again'), you MUST ALWAYS invoke the get_wikipedia_image tool OR output the <operation type=\"show_image\" url=\"...\" caption=\"...\"/> tag in your response! NEVER say 'Here is the picture again' without including the <operation type=\"show_image\"> tag or calling get_wikipedia_image!\n"
            "5. NEVER say 'I cannot display a visual graph or picture'. You have full capability to display inline charts and images!\n\n"
            "UNIFIED DICTIONARY SPECIFICATION:\n"
            "All state stores (profile, contact, setting, macro) follow identical key-value dictionary rules:\n"
            "- action=\"add\": key=K, content=C -> Adds key K with value C, or appends C to key K if K exists.\n"
            "- action=\"set\": key=K, content=C -> Overwrites key K with exact value C.\n"
            "- action=\"delete\" (no old_content): key=K -> Removes key K entirely.\n"
            "- action=\"delete\" (with old_content): key=K, old_content=O -> Removes specific item/field O from key K.\n"
            "- action=\"update\": key=K, old_content=O, content=C -> Replaces specific item/field O with C in key K.\n\n"
            "SUGGESTIONS:\n"
            "At the end of EVERY response, regardless of topic or response length, you MUST append a list of exactly three relevant suggested actions "
            "that Kay might want to take next, wrapped in a <suggestions> XML block.\n"
            "Each action inside the block must be of the form:\n"
            "  <action tag=\"[button_label]\" description=\"[conversational_choice]\">[action_text_from_user_perspective]</action>\n"
            "Where:\n"
            "1. tag: a short, punchy button label (max 15 characters, e.g. \"Superposition\", \"Look for glasses\") to be displayed to the user.\n"
            "2. description: a natural language phrase describing what you want to do/say from the chatbot's perspective (e.g. \"Explain superposition\", \"Ask Pete for help\").\n"
            "3. The content of the tag is the raw text executed when clicked, written as a command/text from the USER's (Kay's) perspective (e.g. \"Tell me about quantum superposition\", \"Pete can you help me?\").\n\n"
            "Just before the <suggestions> block, you MUST end your text reply with the exact phrase:\n"
            "'Do you want me to: 1. [description 1], 2. [description 2], or 3. [description 3]?' (or 'Would you like me to: ...') substituting the actual descriptions from your suggestions.\n\n"
            "Format example:\n"
            "Quantum entanglement is a fundamental phenomenon in quantum mechanics where two or more particles become interconnected such that the quantum state of one instantly dictates the state of the other, no matter how far apart they are. Do you want me to: 1. Explain superposition, 2. Describe the Einstein-Podolsky-Rosen paradox, or 3. Summarize practical applications?\n"
            "<suggestions>\n"
            "  <action tag=\"Superposition\" description=\"Explain superposition\">Tell me about quantum superposition.</action>\n"
            "  <action tag=\"EPR Paradox\" description=\"Describe the Einstein-Podolsky-Rosen paradox\">What is the EPR paradox?</action>\n"
            "  <action tag=\"Applications\" description=\"Summarize practical applications\">What are the practical applications of quantum entanglement?</action>\n"
            "</suggestions>"
        )

        total_history_count = len(sdk_history)
        user_msgs_count = sum(1 for m in request.history if m.get("role") == "user")
        ai_msgs_count = sum(1 for m in request.history if m.get("role") in ["cloud_ai", "model"])
        history_stats = f"Total messages in context window: {total_history_count} ({user_msgs_count} user messages, {ai_msgs_count} Cloud AI replies)."

        user_prompt = (
            f"SYSTEM CONTEXT DETAILS:\n"
            f"[PROFILE SUMMARY]\n{request.profile_summary}\n\n"
            f"[CONTACTS DIRECTORY]\n{request.contacts_summary}\n\n"
            f"[APP SETTINGS]\n{request.settings_summary}\n\n"
            f"[SAVED MACROS]\n{request.macros_summary}\n\n"
            f"[CHAT HISTORY STATS]\n{history_stats}\n\n"
            f"[APP MANUAL & HELP]\n{request.app_manual}\n\n"
            f"User message: {request.user_message}\n\n"
            f"(MANDATORY FORMATTING INSTRUCTION: End your answer with 'Do you want me to: 1. ..., 2. ..., or 3. ...?' followed immediately by the mandatory <suggestions> XML block containing exactly 3 <action> tags)."
        )

        # Create chat session with native Google Search, Code Execution, and Wikipedia Image tools
        chat_session = client.chats.create(
            model="gemini-2.5-flash",
            history=sdk_history,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                tools=[get_wikipedia_image]
            )
        )
        
        # Attempt Gemini API call with server-side retry for transient network/API glitches
        max_server_attempts = 2
        last_exception = None
        raw_text = ""
        
        for server_attempt in range(max_server_attempts):
            try:
                response = chat_session.send_message(user_prompt)
                raw_text = response.text.strip()
                break
            except Exception as ex:
                last_exception = ex
                print(f"Gemini API server-side attempt {server_attempt + 1} failed: {ex}")
                time.sleep(1)
        else:
            if last_exception:
                raise last_exception
        
        client_actions = getattr(thread_local, "client_actions", [])
        reply, suggestions = parse_operations_and_suggestions(raw_text, client_actions)
        
        return {
            "reply": reply,
            "suggestions": suggestions,
            "client_actions": client_actions
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/predict-words")
def predict_words(request: WordPredictionRequest):
    if not GEMINI_API_KEY or not client:
        return {"predictions": []}
    
    if not request.text_prefix.strip():
        return {
            "predictions": [
                {"word": "I", "weight": 1000},
                {"word": "My", "weight": 950},
                {"word": "The", "weight": 900},
                {"word": "It", "weight": 850},
                {"word": "Just", "weight": 800},
                {"word": "Can", "weight": 750},
                {"word": "Need", "weight": 700},
                {"word": "Want", "weight": 650},
                {"word": "How", "weight": 600},
                {"word": "Thanks", "weight": 550},
                {"word": "So", "weight": 500},
                {"word": "Good", "weight": 450},
                {"word": "Feeling", "weight": 400},
                {"word": "About", "weight": 350},
                {"word": "What", "weight": 300}
            ]
        }

    try:
        lines = []
        for msg in request.history:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            if role == "user":
                lines.append(f"You: {content}")
            elif role == "cloud_ai":
                lines.append(f"Cloud AI: {content}")
        chat_context = "\n".join(lines)

        prompt = (
            f"Analyze the typing context: '{request.text_prefix}'. "
            f"Predict the top 15 most likely next words that would follow this context. "
            f"The predicted words MUST make sense in context of Kay (ALS patient, profile below) and the recent conversation history.\n\n"
            f"Profile summary details:\n"
            f"{request.profile_summary}\n\n"
            f"Recent Conversation:\n"
            f"{chat_context}\n\n"
            f"You MUST return ONLY a JSON object of this structure:\n"
            f'{{"predictions": [{{"word": "project", "weight": 100}}, {{"word": "way", "weight": 80}}]}}\n'
            f"Where weight is an estimated relative integer weight from 1 to 1000 representing likelihood. "
            f"Output raw clean JSON only, no markdown markers, no extra text."
        )

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.2,
                response_mime_type="application/json"
            )
        )
        
        import json
        result = json.loads(response.text.strip())
        predictions = result.get("predictions", [])
        return {"predictions": predictions}
    except Exception as e:
        print(f"Word prediction error: {e}")
        return {"predictions": []}

@app.post("/api/predict-phrases")
def predict_phrases(request: PhrasePredictionRequest):
    if not GEMINI_API_KEY or not client:
        return {"phrases": ["how are you today?", "thank you very much.", "please help me with this."]}
        
    if not request.text_prefix.strip() and not request.text_suffix.strip():
        return {
            "phrases": [
                "how are you",
                "i need to",
                "can you help"
            ]
        }

    try:
        lines = []
        for msg in request.history:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            if role == "user":
                lines.append(f"You: {content}")
            elif role == "cloud_ai":
                lines.append(f"Cloud AI: {content}")
        chat_context = "\n".join(lines)

        full_prefix = request.text_prefix
        
        if request.text_suffix.strip():
            # Infilling FIM prompt
            prompt = (
                f"You are a phrase-completion typing assistant. The user is writing a sentence with a cursor in the middle.\n"
                f"Text before cursor (Prefix): '{full_prefix}'\n"
                f"Text after cursor (Suffix): '{request.text_suffix}'\n\n"
                f"Context details:\n"
                f"{request.profile_summary}\n\n"
                f"Recent Conversation:\n"
                f"{chat_context}\n\n"
                f"Predict exactly three distinct, natural phrase completions that could fill the gap between the Prefix and the Suffix. "
                f"The completions must make the combined sentence flow naturally and grammatically. "
                f"Only return a comma-separated list of the completions (lowercase, no prefix or suffix text, no quotes). "
                f"For example, if Prefix is 'please turn on' and Suffix is 'lights', you might return: 'the, the living room, all of the'."
            )
        else:
            # Continuation prompt
            prompt = (
                f"You are a phrase-completion typing assistant. The user has typed the following prefix:\n"
                f"'{full_prefix}'\n\n"
                f"Context details:\n"
                f"{request.profile_summary}\n\n"
                f"Recent Conversation:\n"
                f"{chat_context}\n\n"
                f"Predict exactly three distinct, natural multi-word continuations for the user's typed text. "
                f"The continuation MUST be relevant to the context. "
                f"Only return a comma-separated list of the completions (lowercase, no prefix text, no quote marks). "
                f"For example, if user typed 'turn on', you might return: 'the lights, the television, the fan'."
            )

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.2
            )
        )
        
        raw_text = response.text.strip().lower()
        phrases = [p.strip() for p in raw_text.split(",") if p.strip()]
        return {"phrases": phrases[:3]}
    except Exception as e:
        print("Phrase prediction warning:", e)
        return {"phrases": ["how are you", "i need to", "can you help"]}

@app.post("/api/transcribe")
def transcribe(file: UploadFile = File(...)):
    if not GEMINI_API_KEY or not client:
        return {"transcript": "Mock dictation: Gemini API Key is missing on the server."}
        
    try:
        audio_data = file.file.read()
        
        system_instruction = (
            "You are a precise, verbatim audio transcription tool. "
            "Your sole job is to transcribe the input audio file exactly verbatim. "
            "Do not include any greetings, explanations, notes, metadata, or confirmation messages "
            "(such as 'Here is the transcript' or 'This is a clean verbatim transcript'). "
            "Output ONLY the raw transcribed words and nothing else."
        )
        
        audio_part = types.Part.from_bytes(
            data=audio_data,
            mime_type=file.content_type or "audio/wav"
        )
        
        start_time = time.perf_counter()
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                audio_part,
                "Transcribe this audio verbatim."
            ],
            config=types.GenerateContentConfig(
                system_instruction=system_instruction
            )
        )
        elapsed = time.perf_counter() - start_time
        print(f"[ASR] Gemini audio transcription took {elapsed:.2f} seconds.")
        
        transcript = response.text.strip()
        
        cleanup_phrases = [
            "this is a clean verbatim transcript of the audio, as requested.",
            "this is a clean verbatim transcript of the audio as requested.",
            "this is a clean verbatim transcript of the audio.",
            "here is the verbatim transcript:",
            "here is the transcript:",
            "verbatim transcript:"
        ]
        lower_transcript = transcript.lower()
        for phrase in cleanup_phrases:
            if lower_transcript.endswith(phrase):
                transcript = transcript[:-len(phrase)].strip()
            if lower_transcript.startswith(phrase):
                transcript = transcript[len(phrase):].strip()
                
        return {"transcript": transcript}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/elevenlabs-voices")
async def get_elevenlabs_voices():
    # Predefined default voices list in preferred order
    default_voices = [
        {"voice_id": "URdpYjdnCOSIXKpzB6KE", "name": "Kay's beautiful voice 1 (cloned)", "preview_url": None},
        {"voice_id": "ClZAMU8VhxAvE2PP3kqR", "name": "Kay's beautiful voice (professional)", "preview_url": None},
        {"voice_id": "Xb7hH8MSUJpSbSDYk0k2", "name": "Alice (premade)", "preview_url": "https://media.elevenlabs.io/voices/Xb7hH8MSUJpSbSDYk0k2/previews/14f2e96d-35bd-4473-b3c1-b0e6e737c355.mp3"}
    ]
    
    if not ELEVENLABS_API_KEY:
        return default_voices
        
    try:
        headers = {
            "xi-api-key": ELEVENLABS_API_KEY
        }
        async with httpx.AsyncClient() as client:
            response = await client.get("https://api.elevenlabs.io/v1/voices", headers=headers, timeout=5.0)
            if response.status_code == 200:
                data = response.json()
                fetched_voices = data.get("voices", [])
                
                result = []
                fetched_map = {v["voice_id"]: v for v in fetched_voices}
                
                # First add default voices with their latest names and previews from API if available
                for dv in default_voices:
                    v_id = dv["voice_id"]
                    if v_id in fetched_map:
                        result.append({
                            "voice_id": v_id,
                            "name": fetched_map[v_id].get("name", dv["name"]),
                            "preview_url": fetched_map[v_id].get("preview_url")
                        })
                    else:
                        result.append(dv)
                
                # Add other voices from user's account
                added_ids = {dv["voice_id"] for dv in default_voices}
                for v in fetched_voices:
                    v_id = v["voice_id"]
                    if v_id not in added_ids:
                        result.append({
                            "voice_id": v_id,
                            "name": v.get("name"),
                            "preview_url": v.get("preview_url")
                        })
                return result
            else:
                return default_voices
    except Exception as e:
        print(f"Error fetching ElevenLabs voices: {e}")
        return default_voices

@app.post("/api/tts")
async def tts(request: TTSRequest):
    if not ELEVENLABS_API_KEY:
        raise HTTPException(status_code=400, detail="ElevenLabs API Key not configured")
        
    try:
        voice_id = request.voice_id or "URdpYjdnCOSIXKpzB6KE"
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
        headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": ELEVENLABS_API_KEY
        }
        data = {
            "text": request.text,
            "model_id": "eleven_v3",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.5
            }
        }
        start_time = time.perf_counter()
        async with httpx.AsyncClient() as httpx_client:
            response = await httpx_client.post(url, json=data, headers=headers, timeout=10.0)
            elapsed = time.perf_counter() - start_time
            print(f"[TTS] ElevenLabs audio generation took {elapsed:.2f} seconds.")
            if response.status_code == 200:
                from fastapi.responses import Response
                return Response(content=response.content, media_type="audio/mpeg")
            else:
                raise HTTPException(status_code=response.status_code, detail=response.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/compile-profile")
def compile_profile(profile_text: str = Form(...)):
    if not GEMINI_API_KEY or not client:
        return [
            {"category": "User Info", "content": profile_text[:200]}
        ]
        
    try:
        system_instruction = (
            "You are a structured profile compiler. Read the user's natural language biography and organize it into a structured JSON array of categories.\n\n"
            "Here is the list of preferred standard categories you should try to map the information into:\n"
            "[\"User Info\", \"Relationships\", \"Interests\", \"Schedule\", \"Smart Home Setup\", \"Medical Preferences\"]\n\n"
            "Instructions:\n"
            "1. Parse the provided biography text.\n"
            "2. Group the text facts into standard categories from the list above. If information does not fit any standard category, you may create a new category name (use Title Case).\n"
            "3. Do not modify or alter the names of standard categories.\n"
            "4. Keep the 'content' string for each category concise, factual, and written in natural language bullet points or simple sentences.\n\n"
            "You MUST respond strictly with a JSON array formatted as:\n"
            "[\n"
            "  {\n"
            "    \"category\": \"Category Name\",\n"
            "    \"content\": \"Bullet points or concise facts describing the contents.\"\n"
            "  }\n"
            "]"
        )
        
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"Compile this biography profile:\n{profile_text}",
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json"
            )
        )
        
        import json
        parsed_json = json.loads(response.text.strip())
        return parsed_json
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/extract-memory")
def extract_memory(request: ExtractMemoryRequest):
    if not GEMINI_API_KEY or not client:
        return {"client_actions": [], "message": "Gemini API key not configured"}
        
    try:
        # Build history string from recent transcript
        recent_turns = request.history[-6:]
        transcript = ""
        for turn in recent_turns:
            role = "User" if turn.get("role") == "user" else "Assistant"
            transcript += f"{role}: {turn.get('content', '')}\n"

        prompt = (
            "You are an auxiliary memory extraction worker for K2. "
            "Analyze the conversation transcript below. If new facts, relationships, medical needs, or contact details were introduced that are NOT already in the profile or contacts summary, emit the appropriate XML operation tag(s):\n\n"
            "UNIFIED DICTIONARY OPERATIONAL SPECIFICATIONS:\n"
            "1. Profile Add: <operation type=\"profile\" action=\"add\" key=\"Category\" content=\"Text\"/>\n"
            "2. Profile Update: <operation type=\"profile\" action=\"update\" key=\"Category\" old_content=\"OldText\" content=\"NewText\"/>\n"
            "3. Profile Delete: <operation type=\"profile\" action=\"delete\" key=\"Category\" old_content=\"TextToRemove\"/>\n"
            "4. Contact Add: <operation type=\"contact\" action=\"add\" key=\"ContactName\" content=\"phone=...; email=...; relationship=...\"/>\n"
            "5. Contact Update: <operation type=\"contact\" action=\"update\" key=\"ContactName\" old_content=\"phone=old\" content=\"phone=new\"/>\n"
            "6. Contact Delete: <operation type=\"contact\" action=\"delete\" key=\"ContactName\" old_content=\"field=val\"/>\n\n"
            f"CURRENT PROFILE SUMMARY:\n{request.profile_summary}\n\n"
            f"CURRENT CONTACTS DIRECTORY:\n{request.contacts_summary}\n\n"
            f"RECENT CONVERSATION TRANSCRIPT:\n{transcript}\n\n"
            "If no new persistent facts or contacts were introduced, output EXACTLY 'NO_NEW_FACTS'."
        )

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        raw_reply = response.text.strip() if response.text else ""
        client_actions = []
        if raw_reply and "NO_NEW_FACTS" not in raw_reply:
            parse_operations_and_suggestions(raw_reply, client_actions)

        return {"client_actions": client_actions, "raw": raw_reply}
    except Exception as e:
        print("Memory extraction error:", e)
        return {"client_actions": [], "error": str(e)}

class ProfileCategoryItem(BaseModel):
    category: str
    content: str

class ContactItem(BaseModel):
    name: str
    value: str

def parse_csv_contacts(file_text: str) -> list[dict]:
    import csv
    import io
    items = []
    try:
        f = io.StringIO(file_text)
        reader = csv.DictReader(f)
        for row in reader:
            if not row:
                continue
            first = (row.get("First Name") or row.get("Given Name") or "").strip()
            middle = (row.get("Middle Name") or "").strip()
            last = (row.get("Last Name") or row.get("Family Name") or "").strip()
            org = (row.get("Organization Name") or row.get("Company") or "").strip()
            file_as = (row.get("File As") or row.get("Name") or "").strip()

            name_parts = [p for p in [first, middle, last] if p]
            name = " ".join(name_parts) if name_parts else (org or file_as)
            if not name:
                continue

            fields = []
            for i in range(1, 6):
                email = (row.get(f"E-mail {i} - Value") or row.get(f"Email {i}") or (row.get("Email") if i == 1 else "") or "").strip()
                if email and f"email={email}" not in fields:
                    fields.append(f"email={email}")

            for i in range(1, 6):
                phone = (row.get(f"Phone {i} - Value") or row.get(f"Phone {i}") or (row.get("Phone") if i == 1 else "") or "").strip()
                if phone and f"phone={phone}" not in fields:
                    fields.append(f"phone={phone}")

            rel_val = (row.get("Relation 1 - Value") or row.get("Relationship") or "").strip()
            rel_label = (row.get("Relation 1 - Label") or "").strip()
            if rel_val:
                fields.append(f"relationship={rel_label or 'Relation'}: {rel_val}")

            notes = (row.get("Notes") or "").replace("\n", " ").strip()
            if notes:
                fields.append(f"notes={notes[:200]}")

            val_str = "; ".join(fields)
            if val_str:
                items.append({"name": name, "value": val_str})
    except Exception as e:
        print("CSV parse helper notice:", e)
    return items

@app.post("/api/parse-bulk-file")
def parse_bulk_file(request: ParseBulkFileRequest):
    if not GEMINI_API_KEY or not client:
        raise HTTPException(status_code=400, detail="Gemini API key not configured")
        
    try:
        import json
        if request.target_store == "contacts":
            # Fast-path instant CSV parser for structured contact exports
            if "First Name" in request.file_content or "E-mail" in request.file_content or "Phone 1" in request.file_content:
                csv_items = parse_csv_contacts(request.file_content)
                if csv_items:
                    return {"items": csv_items}

            sys_inst = (
                "You are a structured contact file parser. Parse the provided text, CSV, or vCard file into a JSON list of contacts.\n"
                "Defer directly to the headers, keys, or vCard labels in the file (Name, Phone, Mobile, Email, Relationship, Notes)."
            )
            if request.mode == "merge" and request.existing_context.strip():
                sys_inst += (
                    f"\n\nEXISTING STORED CONTACTS:\n{request.existing_context}\n"
                    "If a contact in the file matches an existing contact, merge and update their fields intelligently without creating duplicate contact records."
                )
            target_schema = list[ContactItem]
        else:
            sys_inst = (
                "You are a structured profile compiler. Parse the provided text file into a JSON list of profile categories.\n"
                "Preferred categories: [\"User Info\", \"Relationships\", \"Interests\", \"Schedule\", \"Smart Home Setup\", \"Medical Preferences\"]."
            )
            if request.mode == "merge" and request.existing_context.strip():
                sys_inst += (
                    f"\n\nEXISTING STORED PROFILE:\n{request.existing_context}\n"
                    "Merge new facts into existing categories or update existing facts without repeating identical lines."
                )
            target_schema = list[ProfileCategoryItem]

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"Parse the following file text:\n\n{request.file_content}",
            config=types.GenerateContentConfig(
                system_instruction=sys_inst,
                response_mime_type="application/json",
                response_schema=target_schema
            )
        )

        parsed_items = json.loads(response.text.strip())
        return {"items": parsed_items}
    except Exception as e:
        print("Bulk file parsing error:", e)
        raise HTTPException(status_code=500, detail=str(e))

# Mount static frontend directory (must be defined last so API routes take precedence)
if os.path.exists("frontend"):
    app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
