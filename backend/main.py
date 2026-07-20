import os
import re
import time
import threading
import httpx
import requests
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
    home_assistant_url: str = ""
    home_assistant_token: str = ""

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

# Suggestions parsing helper
def parse_suggestions(text: str) -> tuple[str, list[dict]]:
    suggestions = []
    action_tags = re.findall(r'<action\s+(.*?)>(.*?)</action>', text, re.DOTALL)
    for attrs, action_text in action_tags:
        tag_match = re.search(r'tag=["\'](.*?)["\']', attrs)
        tag = tag_match.group(1) if tag_match else ""
        suggestions.append({
            "tag": tag.strip()[:15],
            "action_text": action_text.strip()
        })
        
    clean_text = re.sub(r'<suggestions>.*?</suggestions>', '', text, flags=re.DOTALL).strip()
    if not clean_text:
        clean_text = text.split("<suggestions>")[0].strip()
        
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
            "You are K2, an intelligent, assistive Cloud AI for Kay, an ALS patient. "
            "Kay has limited physical control and uses eye-tracking, so keep replies concise (under 3 sentences). "
            "You must assist her in communicating, writing, or controlling her smart home using the registered tools.\n\n"
            "At the end of your response, you MUST append a list of exactly three suggested actions that Kay might want to take next, wrapped in a <suggestions> XML block.\n"
            "Each action inside the block must be of the form:\n"
            "  <action tag=\"[button_label]\" description=\"[conversational_choice]\">[action_text_from_user_perspective]</action>\n"
            "Where:\n"
            "1. tag: a short, punchy button label (max 15 characters, e.g. \"My interests\", \"Look for glasses\") to be displayed to the user.\n"
            "2. description: a natural language phrase describing what you want to do/say from the chatbot's perspective (e.g. \"Say what I know about you\", \"Ask Peter to look for your glasses\").\n"
            "3. The content of the tag is the raw text content executed when clicked, written as a command/text from the USER's (Kay's) perspective (e.g. \"What do you know about me?\", \"Say Peter can you look for my glasses?\").\n\n"
            "Just before the <suggestions> block, you MUST end your text reply with the exact phrase:\n"
            "'Do you want me to: 1. [description 1], 2. [description 2], or 3. [description 3]?' (or 'Would you like me to: ...') substituting the actual descriptions from your suggestions.\n\n"
            "Format example:\n"
            "Hello Kay. I can help you with that. Do you want me to: 1. Say what I know about you, 2. Ask Peter to look for your glasses, or 3. Tell the time?\n"
            "<suggestions>\n"
            "  <action tag=\"My interests\" description=\"Say what I know about you\">What do you know about me?</action>\n"
            "  <action tag=\"Look for glasses\" description=\"Ask Peter to look for your glasses\">Say Peter can you look for my glasses?</action>\n"
            "  <action tag=\"Time\" description=\"Tell the time\">What time is it?</action>\n"
            "</suggestions>"
        )

        user_prompt = (
            f"Context details:\n{request.profile_summary}\n\n"
            f"User message: {request.user_message}"
        )

        # Create chat session with tools and automatic function calling
        chat_session = client.chats.create(
            model="gemini-2.5-flash",
            history=sdk_history,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                tools=[control_home_assistant, speak_phrase, inject_text]
            )
        )
        
        response = chat_session.send_message(user_prompt)
        raw_text = response.text.strip()
        
        reply, suggestions = parse_suggestions(raw_text)
        client_actions = getattr(thread_local, "client_actions", [])
        
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
        raise HTTPException(status_code=500, detail=str(e))

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
            model="gemini-3.5-flash",
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

# Mount static frontend directory (must be defined last so API routes take precedence)
if os.path.exists("frontend"):
    app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
