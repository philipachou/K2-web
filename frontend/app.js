// --- Global State ---
let db = null;
let activeMode = "Run"; // Run, Edit, Delete
let cursorPosition = 0;
let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];

// Clean local English letter bigram transitions for QWERTY dynamic probability sizing
const START_FREQS = {
  'e': 0.12, 't': 0.09, 'a': 0.08, 'o': 0.08, 'i': 0.07, 'n': 0.07, 's': 0.06, 'h': 0.06, 'r': 0.06,
  'd': 0.04, 'l': 0.04, 'c': 0.03, 'u': 0.03, 'm': 0.03, 'w': 0.02, 'f': 0.02, 'g': 0.02, 'y': 0.02,
  'p': 0.02, 'b': 0.01, 'v': 0.01, 'k': 0.01, 'j': 0.005, 'x': 0.005, 'q': 0.002, 'z': 0.002
};

const BIGRAMS = {
  'a': { 'n': 20, 'r': 15, 't': 15, 's': 12, 'l': 10, 'd': 8, 'g': 6, 'm': 5, 'y': 4, 'v': 3 },
  'b': { 'e': 35, 'u': 20, 'y': 15, 'o': 12, 'l': 10, 'i': 8, 'a': 5 },
  'c': { 'o': 30, 'h': 25, 'a': 15, 'e': 12, 'i': 10, 'u': 8, 'l': 5 },
  'd': { 'e': 40, 'i': 20, 'o': 15, 'a': 12, 'u': 8, 'y': 5 },
  'e': { 'r': 18, 'n': 15, 's': 12, 'd': 10, 'a': 8, 'c': 7, 't': 6, 'l': 5, 'v': 4, 'm': 3 },
  'f': { 'o': 35, 'i': 25, 'r': 15, 'e': 12, 'a': 10, 'u': 5 },
  'g': { 'e': 30, 'o': 25, 'a': 15, 'h': 12, 'i': 10, 'r': 8 },
  'h': { 'e': 50, 'a': 20, 'i': 15, 'o': 10, 'u': 5 },
  'i': { 'n': 25, 't': 18, 's': 15, 'c': 10, 'l': 8, 'd': 6, 'o': 5, 'm': 4, 'r': 3 },
  'j': { 'u': 50, 'o': 30, 'a': 20 },
  'k': { 'e': 45, 'i': 25, 'o': 15, 'a': 10, 'y': 5 },
  'l': { 'e': 25, 'o': 20, 'y': 15, 'i': 12, 'a': 10, 'u': 8, 'd': 5 },
  'm': { 'e': 35, 'a': 25, 'o': 15, 'u': 12, 'i': 8, 'y': 5 },
  'n': { 'd': 25, 'g': 20, 'e': 15, 't': 12, 'o': 10, 's': 8, 'a': 5, 'i': 3 },
  'o': { 'f': 18, 'n': 15, 'r': 12, 'w': 10, 'u': 8, 't': 7, 'm': 6, 'p': 5, 'g': 4, 's': 3 },
  'p': { 'e': 30, 'o': 20, 'a': 18, 'r': 15, 'i': 10, 'l': 7 },
  'q': { 'u': 95, 'e': 5 },
  'r': { 'e': 30, 'o': 20, 'a': 15, 'i': 12, 'y': 10, 'd': 8, 'n': 5 },
  's': { 't': 22, 'h': 18, 'e': 15, 'o': 12, 'i': 10, 'a': 8, 'u': 5, 'y': 3 },
  't': { 'h': 35, 'o': 20, 'e': 15, 'i': 10, 'a': 8, 'r': 5, 'u': 3, 'y': 2 },
  'u': { 't': 22, 'r': 18, 's': 15, 'l': 12, 'p': 10, 'n': 8, 'g': 5, 'm': 4 },
  'v': { 'e': 60, 'i': 25, 'a': 10, 'o': 5 },
  'w': { 'i': 35, 'a': 25, 'o': 20, 'e': 12, 'h': 8 },
  'x': { 't': 40, 'p': 25, 'i': 20, 'e': 15 },
  'y': { 'o': 35, 'e': 20, 's': 15, 'i': 10, 'a': 8 },
  'z': { 'e': 50, 'o': 30, 'a': 20 }
};

// 300 Common English Words dictionary for word prediction
const DICTIONARY = [
  "the", "of", "to", "and", "a", "in", "is", "it", "you", "that", "he", "was", "for", "on", "are", "as", "with", "his", "they", "i",
  "at", "be", "this", "have", "from", "or", "one", "had", "by", "word", "but", "not", "what", "all", "were", "we", "when", "your",
  "can", "said", "there", "use", "an", "each", "which", "she", "do", "how", "their", "if", "will", "up", "other", "about", "out",
  "many", "then", "them", "these", "so", "some", "her", "would", "make", "like", "him", "into", "time", "has", "look", "two", "more",
  "write", "go", "see", "number", "no", "way", "could", "people", "my", "than", "first", "water", "been", "call", "who", "oil", "its",
  "now", "find", "long", "down", "day", "did", "get", "come", "made", "may", "part", "hello", "thanks", "lights", "home", "turn",
  "on", "off", "kitchen", "living", "room", "please", "help", "water", "hungry", "tired", "glasses", "peter", "phil", "kay", "weather"
];

// Phrase prediction completions list
const PHRASES = [
  "how are you today?",
  "thank you very much.",
  "please help me with this.",
  "could you turn on the lights?",
  "what is the weather like?",
  "i am feeling tired right now.",
  "need some water please.",
  "toggle the living room lights.",
  "nice to meet you.",
  "hope you have a great day!"
];

// --- IndexedDB Configuration ---
const DB_NAME = "k2_web_db";
const DB_VERSION = 1;

function initDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onupgradeneeded = function(e) {
      db = e.target.result;
      
      // Store settings key-value
      if (!db.objectStoreNames.contains("settings")) {
        db.createObjectStore("settings", { keyPath: "key" });
      }
      
      // Store chat history
      if (!db.objectStoreNames.contains("chat_history")) {
        db.createObjectStore("chat_history", { keyPath: "id", autoIncrement: true });
      }
      
      // Store saved actions (Macros)
      if (!db.objectStoreNames.contains("saved_actions")) {
        db.createObjectStore("saved_actions", { keyPath: "tag" });
      }

      // Store personal summary categories
      if (!db.objectStoreNames.contains("personal_summary")) {
        db.createObjectStore("personal_summary", { keyPath: "category" });
      }
    };
    
    request.onsuccess = function(e) {
      db = e.target.result;
      seedDefaults().then(resolve);
    };
    
    request.onerror = function(e) {
      console.error("IndexedDB initialization error:", e);
      reject(e);
    };
  });
}

// Helper DB operations
function getSetting(key, defaultValue = "") {
  return new Promise((resolve) => {
    const txn = db.transaction("settings", "readonly");
    const store = txn.objectStore("settings");
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result ? req.result.value : defaultValue);
    req.onerror = () => resolve(defaultValue);
  });
}

function setSetting(key, value) {
  return new Promise((resolve) => {
    const txn = db.transaction("settings", "readwrite");
    const store = txn.objectStore("settings");
    store.put({ key, value });
    txn.oncomplete = () => resolve();
  });
}

function getSavedActions() {
  return new Promise((resolve) => {
    const txn = db.transaction("saved_actions", "readonly");
    const store = txn.objectStore("saved_actions");
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
  });
}

function saveAction(tag, action_text) {
  return new Promise((resolve) => {
    const txn = db.transaction("saved_actions", "readwrite");
    const store = txn.objectStore("saved_actions");
    store.put({ tag, action_text });
    txn.oncomplete = () => resolve();
  });
}

function deleteAction(tag) {
  return new Promise((resolve) => {
    const txn = db.transaction("saved_actions", "readwrite");
    const store = txn.objectStore("saved_actions");
    store.delete(tag);
    txn.oncomplete = () => resolve();
  });
}

function getChatHistory(limit = 10) {
  return new Promise((resolve) => {
    const txn = db.transaction("chat_history", "readonly");
    const store = txn.objectStore("chat_history");
    const req = store.getAll();
    req.onsuccess = () => {
      const res = req.result || [];
      resolve(res.slice(-limit));
    };
  });
}

function addChatMessage(role, content) {
  return new Promise((resolve) => {
    const txn = db.transaction("chat_history", "readwrite");
    const store = txn.objectStore("chat_history");
    store.add({ role, content, timestamp: new Date().toISOString() });
    txn.oncomplete = () => resolve();
  });
}

function getPersonalSummary() {
  return new Promise((resolve) => {
    const txn = db.transaction("personal_summary", "readonly");
    const store = txn.objectStore("personal_summary");
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
  });
}

function setPersonalSummary(categories) {
  return new Promise((resolve) => {
    const txn = db.transaction("personal_summary", "readwrite");
    const store = txn.objectStore("personal_summary");
    store.clear();
    for (const item of categories) {
      store.put(item);
    }
    txn.oncomplete = () => resolve();
  });
}

async function seedDefaults() {
  // Seed default settings
  const editSize = await getSetting("font_size_editor");
  if (!editSize) {
    await setSetting("font_size_editor", "32");
    await setSetting("font_size_keyboard", "20");
    await setSetting("biography_text", "Name: Kay. Patient diagnosed with ALS.\nHusband: Phil. Family visits frequently.\nInterests: Loves science fiction and smart home tech.");
    
    // Seed initial personal summary
    await setPersonalSummary([
      { category: "User Info", content: "Name: Kay. Patient diagnosed with ALS. Currently retains good eye control." },
      { category: "Relationships", content: "Husband: Phil. Family lives nearby and visits frequently." },
      { category: "Interests", content: "Loves reading science fiction, listening to audiobooks, and keeping up with smart-home tech." }
    ]);
    
    // Seed initial macros
    await saveAction("Turn on lights", "Turn on the living room lights");
    await saveAction("Say Hello", "Say Hello, how are you today?");
    await saveAction("Say Thank You", "Say Thank you very much!");
    await saveAction("Type Kay", "Type Kay");
  }
}

// --- Page Initialization & Setup ---
document.addEventListener("DOMContentLoaded", async () => {
  await initDatabase();
  
  // Set initial font-size styles
  const fontEd = await getSetting("font_size_editor", "32");
  document.getElementById("editor-box").style.fontSize = `${fontEd}px`;
  
  const bio = await getSetting("biography_text");
  document.getElementById("biography-text").value = bio;
  
  // Setup bindings
  setupUIBindings();
  
  // Render Keyboard and Database macros
  renderSavedActions();
  renderChatLog();
  updatePredictionsAndKeyboard();
  
  // Start with focus in editor box
  const textbox = document.getElementById("editor-box");
  textbox.focus();
  textbox.setSelectionRange(0, 0);
});

function setupUIBindings() {
  // Text modifications
  document.getElementById("btn-clear").addEventListener("click", () => {
    document.getElementById("editor-box").value = "";
    cursorPosition = 0;
    updatePredictionsAndKeyboard();
  });
  
  document.getElementById("btn-del-word").addEventListener("click", () => {
    const box = document.getElementById("editor-box");
    const text = box.value;
    const words = text.trimEnd().split(" ");
    words.pop();
    box.value = words.join(" ") + (words.length ? " " : "");
    box.focus();
    updatePredictionsAndKeyboard();
  });
  
  document.getElementById("btn-del-char").addEventListener("click", () => {
    const box = document.getElementById("editor-box");
    box.value = box.value.slice(0, -1);
    box.focus();
    updatePredictionsAndKeyboard();
  });

  // Copy button
  document.getElementById("btn-type").addEventListener("click", async () => {
    const text = document.getElementById("editor-box").value;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      addChatMessage("system", `Copied text to clipboard: "${text}"`);
      renderChatLog();
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  });

  // Browser TTS (Say button) - Free, instant, zero latency
  document.getElementById("btn-say").addEventListener("click", () => {
    const text = document.getElementById("editor-box").value;
    if (!text) return;
    
    // Speak using Web Speech API
    const utterance = new SpeechSynthesisUtterance(text);
    // Find premium system voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith("en-") && v.name.includes("Google")) || voices.find(v => v.lang.startsWith("en-"));
    if (englishVoice) utterance.voice = englishVoice;
    
    window.speechSynthesis.speak(utterance);
    addChatMessage("system", `Spoke: "${text}"`);
    renderChatLog();
  });

  // Action Panel Modes
  document.querySelectorAll(".action-modes .mode-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".action-modes .mode-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeMode = btn.textContent;
    });
  });

  // Save new macro button
  document.getElementById("btn-save").addEventListener("click", async () => {
    const text = document.getElementById("editor-box").value;
    if (!text.trim()) return;
    const tag = prompt("Enter a short tag/label for this action button:");
    if (!tag) return;
    await saveAction(tag, text);
    renderSavedActions();
  });

  // Dictation Recording (Speech Input)
  document.getElementById("btn-dictate").addEventListener("click", toggleDictation);

  // Gemini Chat Integration
  document.getElementById("btn-cloud").addEventListener("click", executeSendCloud);

  // Settings Modal controls
  document.getElementById("btn-settings").addEventListener("click", () => {
    document.getElementById("settings-modal").style.display = "flex";
  });
  
  document.getElementById("btn-settings-close").addEventListener("click", async () => {
    const bioText = document.getElementById("biography-text").value;
    await setSetting("biography_text", bioText);
    
    const fontEd = document.getElementById("font-editor").value;
    await setSetting("font_size_editor", fontEd);
    document.getElementById("editor-box").style.fontSize = `${fontEd}px`;
    
    const fontKy = document.getElementById("font-keyboard").value;
    await setSetting("font_size_keyboard", fontKy);
    updatePredictionsAndKeyboard();
    
    document.getElementById("settings-modal").style.display = "none";
  });

  // Profile Compilation trigger
  document.getElementById("btn-compile").addEventListener("click", executeCompileProfile);
}

// --- Audio Recording Dictation ---
async function toggleDictation() {
  const dictateBtn = document.getElementById("btn-dictate");
  
  if (!isRecording) {
    // Start Recording
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        dictateBtn.textContent = "Working...";
        dictateBtn.className = "btn btn-warning";
        dictateBtn.disabled = true;
        
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const formData = new FormData();
        formData.append("file", audioBlob, "recording.wav");
        
        try {
          const res = await fetch("/api/transcribe", {
            method: "POST",
            body: formData
          });
          const data = await res.json();
          if (data.transcript) {
            insertTextAtCursor(data.transcript + " ");
          } else {
            console.error("Transcription error:", data.detail);
          }
        } catch (err) {
          console.error("Failed to transcribe:", err);
        } finally {
          dictateBtn.textContent = "Dictate";
          dictateBtn.className = "btn btn-teal";
          dictateBtn.disabled = false;
        }
      };
      
      mediaRecorder.start();
      isRecording = true;
      dictateBtn.textContent = "Listening...";
      dictateBtn.style.backgroundColor = "#ef4444"; // Vivid Red pulse state
    } catch (err) {
      alert("Microphone access denied or audio device not found: " + err.message);
    }
  } else {
    // Stop Recording
    mediaRecorder.stop();
    isRecording = false;
    dictateBtn.style.backgroundColor = "";
  }
}

// --- Gemini API Integrations ---
async function executeSendCloud() {
  const box = document.getElementById("editor-box");
  const text = box.value;
  if (!text) return;
  
  addChatMessage("user", text);
  renderChatLog();
  box.value = "";
  
  const history = await getChatHistory();
  const summaryList = await getPersonalSummary();
  const profile_summary = summaryList.map(i => `${i.category}: ${i.content}`).join("\n");
  
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_message: text, history, profile_summary })
    });
    const data = await res.json();
    if (data.reply) {
      await addChatMessage("cloud_ai", data.reply);
      renderChatLog();
      renderSuggestions(data.suggestions);
    }
  } catch (err) {
    console.error("Chat API request failed:", err);
  }
}

async function executeCompileProfile() {
  const compileBtn = document.getElementById("btn-compile");
  const text = document.getElementById("biography-text").value;
  if (!text.trim()) return;

  compileBtn.disabled = true;
  compileBtn.textContent = "Compiling profile...";

  try {
    const formData = new FormData();
    formData.append("profile_text", text);
    
    const res = await fetch("/api/compile-profile", {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    if (data && Array.isArray(data)) {
      await setPersonalSummary(data);
      alert("Profile compiled successfully into standard database categories!");
    }
  } catch (err) {
    console.error("Profile compilation failed:", err);
    alert("Profile compilation failed. Check console logs.");
  } finally {
    compileBtn.disabled = false;
    compileBtn.textContent = "Compile Profile via Gemini";
  }
}

// --- Sizing & Rendering Helpers ---
function insertTextAtCursor(text) {
  const box = document.getElementById("editor-box");
  if (box.value === "Type here...") {
    box.value = "";
  }
  const start = box.selectionStart;
  const end = box.selectionEnd;
  box.value = box.value.substring(0, start) + text + box.value.substring(end);
  box.selectionStart = box.selectionEnd = start + text.length;
  updatePredictionsAndKeyboard();
}

function updatePredictionsAndKeyboard() {
  const box = document.getElementById("editor-box");
  let text = box.value;
  if (text === "Type here...") text = "";
  
  // Calculate prefix matching for current word predictions
  const lastSpace = text.lastIndexOf(" ");
  const wordPrefix = text.substring(lastSpace + 1).toLowerCase();
  
  // 1. Character Predictions
  const nextCharFreqs = {};
  if (text.length > 0) {
    const lastChar = text[text.length - 1].toLowerCase();
    const transitions = BIGRAMS[lastChar] || START_FREQS;
    Object.assign(nextCharFreqs, transitions);
  } else {
    Object.assign(nextCharFreqs, START_FREQS);
  }
  
  renderCharPredictions(nextCharFreqs);
  
  // 2. Word Predictions
  const matchedWords = DICTIONARY.filter(w => w.startsWith(wordPrefix) && w !== wordPrefix);
  const suggestions = matchedWords.length ? matchedWords.slice(0, 3) : DICTIONARY.slice(0, 3);
  renderWordPredictions(suggestions, wordPrefix);
  
  // 3. Phrase Predictions
  const phraseMatches = PHRASES.filter(p => p.startsWith(text.toLowerCase()) && p !== text.toLowerCase());
  renderPhrasePredictions(phraseMatches.slice(0, 3));
  
  // Redraw keyboard keys
  renderKeyboard(nextCharFreqs);
}

function renderCharPredictions(nextCharFreqs) {
  const div = document.getElementById("char-predictions");
  div.innerHTML = "";
  const sorted = Object.entries(nextCharFreqs).sort((a,b) => b[1] - a[1]).slice(0, 3);
  sorted.forEach(([char, freq]) => {
    const btn = document.createElement("button");
    btn.className = "predict-btn";
    btn.textContent = char;
    btn.onclick = () => insertTextAtCursor(char);
    div.appendChild(btn);
  });
}

function renderWordPredictions(words, prefix) {
  const div = document.getElementById("word-predictions");
  div.innerHTML = "";
  words.forEach(word => {
    const btn = document.createElement("button");
    btn.className = "predict-btn";
    btn.textContent = word;
    btn.onclick = () => {
      const box = document.getElementById("editor-box");
      const text = box.value;
      const lastSpace = text.lastIndexOf(" ");
      box.value = text.substring(0, lastSpace + 1) + word + " ";
      updatePredictionsAndKeyboard();
    };
    div.appendChild(btn);
  });
}

function renderPhrasePredictions(phrases) {
  const div = document.getElementById("phrase-predictions");
  div.innerHTML = "";
  phrases.forEach(phrase => {
    const btn = document.createElement("button");
    btn.className = "predict-btn";
    btn.textContent = phrase;
    btn.onclick = () => {
      document.getElementById("editor-box").value = phrase + " ";
      updatePredictionsAndKeyboard();
    };
    div.appendChild(btn);
  });
}

async function renderKeyboard(probabilities) {
  const container = document.getElementById("keyboard");
  container.innerHTML = "";
  
  const layout = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m", " ", "."]
  ];
  
  const fontKy = await getSetting("font_size_keyboard", "20");
  
  layout.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "keyboard-row";
    
    row.forEach(key => {
      const keyBtn = document.createElement("div");
      keyBtn.className = "key";
      keyBtn.textContent = key === " " ? "SPACE" : key.toUpperCase();
      keyBtn.style.fontSize = `${fontKy}px`;
      
      // Calculate dynamic flex-grow width scaling (Fitts' Law mapping)
      const prob = probabilities[key] || 0.01;
      keyBtn.style.flex = `${0.5 + prob * 5}`;
      
      // Dynamic HSL coloring based on letter probability (Green -> Slate)
      const hue = 140; // Emerald Green
      const sat = Math.round(15 + prob * 75); // saturation scales up for higher probability
      const lit = Math.round(25 + prob * 20);  // lightness scales up
      keyBtn.style.backgroundColor = `hsl(${hue}, ${sat}%, ${lit}%)`;
      keyBtn.style.borderColor = `hsl(${hue}, ${sat}%, ${lit + 5}%)`;
      
      keyBtn.onclick = () => insertTextAtCursor(key);
      rowDiv.appendChild(keyBtn);
    });
    
    container.appendChild(rowDiv);
  });
}

async function renderSavedActions() {
  const grid = document.getElementById("actions-grid");
  grid.innerHTML = "";
  const list = await getSavedActions();
  list.forEach(action => {
    const card = document.createElement("div");
    card.className = "action-card";
    card.textContent = action.tag;
    
    card.onclick = async () => {
      if (activeMode === "Run") {
        insertTextAtCursor(action.action_text);
      } else if (activeMode === "Edit") {
        document.getElementById("editor-box").value = action.action_text;
        updatePredictionsAndKeyboard();
      } else if (activeMode === "Delete") {
        if (confirm(`Are you sure you want to delete macro button "${action.tag}"?`)) {
          await deleteAction(action.tag);
          renderSavedActions();
        }
      }
    };
    grid.appendChild(card);
  });
}

function renderSuggestions(suggestions) {
  // Appends suggestions returned by cloud Gemini to the macro grid
  const grid = document.getElementById("actions-grid");
  suggestions.forEach(sug => {
    const card = document.createElement("div");
    card.className = "action-card";
    card.style.background = "rgba(16, 185, 129, 0.1)";
    card.style.borderColor = "var(--color-success)";
    card.textContent = sug.tag;
    
    card.onclick = () => {
      insertTextAtCursor(sug.action_text);
    };
    grid.appendChild(card);
  });
}

async function renderChatLog() {
  const log = document.getElementById("chat-log-scroll");
  log.innerHTML = "";
  const list = await getChatHistory();
  list.forEach(msg => {
    const div = document.createElement("div");
    div.className = `chat-message ${msg.role}`;
    
    let prefix = "System: ";
    if (msg.role === "user") prefix = "You: ";
    else if (msg.role === "cloud_ai") prefix = "Cloud AI: ";
    
    div.textContent = `${prefix}${msg.content}`;
    log.appendChild(div);
  });
  
  // Scroll to bottom
  log.scrollTop = log.scrollHeight;
}
