import os
import re
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import google.generativeai as genai
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

# Set Gemini API Key
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

class ChatRequest(BaseModel):
    user_message: str
    history: list[dict]
    profile_summary: str

def parse_suggestions(text: str) -> tuple[str, list[dict]]:
    """Helper to parse suggestions out of Gemini response content."""
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
        
    # Standard default suggestions if parsing yielded nothing
    if not suggestions:
        suggestions = [
            {"tag": "Say Thanks", "action_text": "Say Thank you!"},
            {"tag": "Say Hello", "action_text": "Say Hello, how are you today?"},
            {"tag": "Type Kay", "action_text": "Type Kay"}
        ]
    return clean_text, suggestions

@app.post("/api/chat")
async def chat(request: ChatRequest):
    if not GEMINI_API_KEY:
        # Return fallback mock responses if no API key is set
        mock_reply = "[Mock Cloud AI] Please configure the GEMINI_API_KEY in your server environment settings."
        mock_sug = [
            {"tag": "Say Hello", "action_text": "Say Hello!"},
            {"tag": "Type Kay", "action_text": "Type Kay"}
        ]
        return {"reply": mock_reply, "suggestions": mock_sug}

    try:
        genai.configure(api_key=GEMINI_API_KEY)
        
        # Build chat context lines from client-provided history
        lines = []
        for msg in request.history:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            if role == "user":
                lines.append(f"You: {content}")
            elif role == "cloud_ai":
                lines.append(f"Cloud AI: {content}")
            elif role == "system":
                lines.append(f"System: {content}")
        chat_context = "\n".join(lines)

        system_instruction = (
            "You are K2, an intelligent, assistive Cloud AI for Kay, an ALS patient. "
            "Kay has limited physical control and uses eye-tracking, so keep replies concise (under 3 sentences). "
            "You must assist her in communicating, writing, or controlling her smart home.\n\n"
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

        prompt_parts = []
        if request.profile_summary:
            prompt_parts.append(request.profile_summary)
        if chat_context:
            prompt_parts.append("Recent chat history for context:\n" + chat_context)
        prompt_parts.append(f"User message: {request.user_message}")

        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            system_instruction=system_instruction
        )
        response = model.generate_content(prompt_parts)
        raw_text = response.text.strip()
        
        reply, suggestions = parse_suggestions(raw_text)
        return {"reply": reply, "suggestions": suggestions}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/transcribe")
async def transcribe(file: UploadFile = File(...)):
    if not GEMINI_API_KEY:
        return {"transcript": "Mock dictation: Gemini API Key is missing on the server."}
        
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        audio_data = await file.read()
        
        system_instruction = (
            "You are a precise, verbatim audio transcription tool. "
            "Your sole job is to transcribe the input audio file exactly verbatim. "
            "Do not include any greetings, explanations, notes, metadata, or confirmation messages "
            "(such as 'Here is the transcript' or 'This is a clean verbatim transcript'). "
            "Output ONLY the raw transcribed words and nothing else."
        )
        
        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            system_instruction=system_instruction
        )
        response = model.generate_content([
            {
                "mime_type": file.content_type or "audio/wav",
                "data": audio_data
            },
            "Transcribe this audio verbatim."
        ])
        
        transcript = response.text.strip()
        
        # Post-process cleanup of common conversational prompt leakages
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

@app.post("/api/compile-profile")
async def compile_profile(profile_text: str = Form(...)):
    if not GEMINI_API_KEY:
        # Mock compiled response
        return [
            {"category": "User Info", "content": profile_text[:200]}
        ]
        
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        
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
        
        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            system_instruction=system_instruction
        )
        # Request JSON output structure
        response = model.generate_content(
            f"Compile this biography profile:\n{profile_text}",
            generation_config={"response_mime_type": "application/json"}
        )
        
        import json
        parsed_json = json.loads(response.text.strip())
        return parsed_json
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Mount static frontend directory (must be defined last so API routes take precedence)
if os.path.exists("frontend"):
    app.mount("/", StaticFiles(directory="frontend", html=True), name="frontend")
