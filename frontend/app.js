// --- Dictionary raw list from dictionary.txt ---
const DICTIONARY_TEXT = `the,1000
and,900
to,800
of,750
a,700
in,650
that,600
is,550
was,500
he,450
for,400
it,380
with,360
as,340
his,320
on,300
at,280
by,260
i,250
this,240
had,230
not,220
but,210
from,200
or,190
she,180
an,170
they,160
which,150
you,140
one,130
we,120
were,110
her,100
would,95
there,90
their,85
what,80
out,75
if,70
about,65
who,60
get,55
go,50
me,45
make,40
can,40
like,35
time,30
say,25
speak,20
hello,15
thank,10
water,10
help,10
food,10
hungry,5
thirsty,5
tired,5
pain,5
home,5
assistant,5
lights,5
speak,5
turn,5
toggle,5
say,5
inject,5
write,5
kay,5
phil,5
family,5
friends,5
read,5
science,5
fiction,5
smart,5
technology,5
devices,5
computer,5
email,5
notepad,5
browser,5
chrome,5
website,5
music,5
play,5
pause,5
stop,5
up,5
down,5
open,5
close,5
edit,5
save,5
send,5
new,5
chat,5
history,5
actions,5
unsaved,5
saved,5
keyboard,5
dwell,5
scrolling,5
cursor,5
snapping,5
insertion,5
head,5
tail,5
selection,5
highlight,5
predictions,5
character,5
word,5
phrase,5
gemini,5
ollama,5
llama,5
elevenlabs,5
voice,5
speech,5
text,5
gaze,5
eye,5
tracking,5
pointer,5
click,5
spacebar,5
enter,5
function,5
keys,5
access,5
settings,5
menu,5
profile,5
summary,5
resume,5
biography,5
relationships,5
interests,5
smart-home,5
lights,5
television,5
temperature,5
door,5
window,5
blind,5
fan,5
ac,5
heating,5
security,5
camera,5
lock,5
unlock,5
open,5
close,5
on,5
off,5
toggle,5
up,5
down,5
high,5
medium,5
low,5
active,5
inactive,5
connected,5
disconnected,5
status,5
error,5
warning,5
info,5
debug,5
trace,5
success,5
failure,5
running,5
stopped,5
paused,5
completed,5
pending,5
approved,5
rejected,5
draft,5
plan,5
scaffold,5
implement,5
verify,5
walkthrough,5
task,5
goal,5
schedule,5
grill-me,5
antigravity,5
deepmind,5
google,5
ai,5
agent,5
assistant,5
user,5
patient,5
als,5
gaze-typing,5
Dasher,5
Fitts,5
information,5
theory,5
entropy,5
probability,5
conditional,5
unigram,5
bigram,5
trigram,5
n-gram,5
PPM,5
compression,5
arithmetic,5
coding,5
huffman,5
shannon,5
fano,5
morse,5
code,5
qwerty,5
fitaly,5
alphabetical,5
frequency,5
layout,5
keys,5
buttons,5
labels,5
tooltips,5
hover,5
dwell,5
selection,5
actions,5
commands,5
macros,5
shortcuts,5
hotkeys,5
automation,5
pyautogui,5
keyboard,5
injection,5
pasting,5
clipboards,5
windows,5
system,5
process,5
thread,5
queue,5
loop,5
main,5
window,5
layout,5
grid,5
rows,5
columns,5
span,5
weight,5
frame,5
canvas,5
widget,5
label,5
button,5
textbox,5
entry,5
scrollbar,5
menu,5
optionmenu,5
combobox,5
checkbox,5
radiobutton,5
switch,5
slider,5
progressbar,5
tabview,5
segmentedbutton,5
textbox,5
tk,5
ttk,5
ctk,5
customtkinter,5
dark,5
light,5
system,5
theme,5
color,5
appearance,5
mode,5
scaling,5
font,5
size,5
style,5
weight,5
family,5
bold,5
italic,5
underline,5
strikeout,5
color,5
fg,5
bg,5
border,5
padding,5
margin,5
alignment,5
anchor,5
justify,5
wrap,5
scroll,5
dwell,5
scrolling,5
speeds,5
acceleration,5
clicks,5
dwells,5
hovers,5
coordinates,5
dimensions,5
ratios,5
grid,5
pack,5
place,5
geometry,5
title,5
resizable,5
fullscreen,5
minimize,5
maximize,5
icon,5
cursor,5
virtual,5
snapping,5
gaps,5
boundaries,5
characters,5
letters,5
words,5
phrases,5
sentences,5
paragraphs,5
texts,5
documents,5
files,5
folders,5
paths,5
names,5
extensions,5
json,5
xml,5
yaml,5
ini,5
db,5
sqlite,5
sql,5
queries,5
schemas,5
tables,5
columns,5
rows,5
keys,5
constraints,5
indexes,5
triggers,5
views,5
procedures,5
connections,5
statements,5
results,5
records,5
fields,5
values,5
types,5
blobs,5
nulls,5
defaults,5
seeds,5
inserts,5
updates,5
deletes,5
selects,5
joins,5
unions,5
filters,5
sorts,5
groups,5
aggregates,5
functions,5
expressions,5
clauses,5
statements,5
transactions,5
locks,5
isolation,5
concurrency,5
performance,5
optimization,5
indexing,5
querying,5
storing,5
retrieving,5
updating,5
deleting,5
restoring,5
backing,5
exporting,5
importing,5
loading,5
saving,5
writing,5
reading,5
parsing,5
rendering,5
displaying,5
formatting,5
cleaning,5
stripping,5
tags,5
xml,5
suggestions,5
actions,5
macros,5
commands,5
injecting,5
typing,5
pasting,5
sending,5
speaking,5
synthesizing,5
playing,5
elevenlabs,5
voices,5
models,5
api,5
keys,5
urls,5
requests,5
headers,5
payloads,5
responses,5
status,5
errors,5
retries,5
timeouts,5
backoffs,5
rates,5
limits,5
quotas,5
pricing,5
billing,5
tokens,5
usage,5
monitoring,5
logging,5
debugging,5
tracing,5
profiling,5
testing,5
verifying,5
validation,5
walkthrough,5
demos,5
scaffolding,5
skeletons,5
stubs
discuss,450
discussion,400
discovered,350
discovery,350
dissertation,400`;

const DICTIONARY = DICTIONARY_TEXT.split("\n").filter(l => l.trim()).map(line => {
  const parts = line.split(",");
  return { word: parts[0].toLowerCase(), weight: parseInt(parts[1], 10) || 10 };
});

// --- Core Predictor Matrices from tlm.py ---
const DEFAULT_FREQS = {
  'e': 0.1202, 't': 0.0910, 'a': 0.0812, 'o': 0.0768, 'i': 0.0731, 
  'n': 0.0695, 's': 0.0628, 'r': 0.0602, 'h': 0.0592, 'd': 0.0432, 
  'l': 0.0398, 'u': 0.0288, 'c': 0.0271, 'm': 0.0261, 'f': 0.0230, 
  'y': 0.0211, 'w': 0.0209, 'g': 0.0203, 'p': 0.0182, 'b': 0.0149, 
  'v': 0.0111, 'k': 0.0069, 'x': 0.0017, 'q': 0.0011, 'j': 0.0010, 
  'z': 0.0007, ' ': 0.1500
};

const BIGRAM_MATRIX = {
  'a': {'n': 10, 'r': 9, 't': 8, 's': 7, 'l': 6, 'd': 5, 'c': 4, 'm': 4, 'g': 3, 'b': 2, ' ': 8},
  'b': {'e': 10, 'u': 8, 'o': 7, 'a': 6, 'i': 5, 'l': 4, 'r': 4, 'y': 3, ' ': 3},
  'c': {'o': 10, 'h': 9, 'e': 8, 'a': 7, 'i': 6, 'k': 5, 'l': 4, 'u': 3, 'r': 3, ' ': 2},
  'd': {'e': 10, 'i': 7, 'o': 6, 'a': 5, 'u': 4, 'y': 3, 'r': 2, ' ': 12},
  'e': {'r': 10, 'n': 9, 's': 8, 'd': 7, 'a': 6, 'c': 5, 't': 4, 'l': 4, 'v': 3, ' ': 15},
  'f': {'o': 10, 'e': 8, 'i': 7, 'a': 6, 'r': 5, 'l': 4, 'u': 3, ' ': 10},
  'g': {'e': 10, 'o': 8, 'h': 7, 'i': 6, 'a': 5, 'r': 4, 'l': 3, ' ': 10},
  'h': {'e': 20, 'a': 15, 'o': 12, 'i': 10, 'u': 6, 'y': 4, ' ': 5},
  'i': {'n': 12, 's': 10, 't': 8, 'c': 7, 'o': 6, 'l': 5, 'd': 4, 'r': 3, ' ': 8},
  'j': {'e': 10, 'o': 8, 'a': 6, 'u': 4, ' ': 1},
  'k': {'e': 10, 'i': 8, 'y': 5, 'o': 4, 's': 2, ' ': 12},
  'l': {'e': 10, 'y': 8, 'o': 7, 'a': 6, 'i': 5, 'd': 4, 'u': 3, 'l': 2, ' ': 10},
  'm': {'e': 10, 'a': 8, 'o': 7, 'i': 6, 'u': 5, 'p': 4, 'y': 2, ' ': 10},
  'n': {'d': 10, 'g': 9, 't': 8, 'e': 7, 'o': 6, 'a': 5, 'i': 4, ' ': 15},
  'o': {'f': 12, 'n': 10, 'u': 8, 'r': 7, 'w': 6, 't': 5, 'm': 4, 'p': 3, ' ': 15},
  'p': {'e': 10, 'o': 8, 'a': 7, 'r': 6, 'l': 5, 'i': 4, 'u': 3, 'y': 2, ' ': 5},
  'q': {'u': 25, ' ': 1},
  'r': {'e': 12, 'o': 10, 'a': 8, 'i': 7, 'n': 5, 'd': 4, 'y': 3, ' ': 15},
  's': {'t': 12, 'h': 10, 'e': 8, 'o': 7, 'i': 6, 'a': 5, 'u': 4, 'p': 3, ' ': 18},
  't': {'h': 22, 'e': 15, 'o': 10, 'a': 8, 'i': 7, 'r': 6, 'u': 4, 'y': 3, ' ': 20},
  'u': {'r': 10, 's': 8, 't': 7, 'l': 6, 'n': 5, 'p': 4, 'b': 3, 'c': 2, ' ': 5},
  'v': {'e': 15, 'o': 8, 'i': 6, 'a': 4, 'y': 2, ' ': 2},
  'w': {'h': 12, 'a': 10, 'o': 8, 'e': 7, 'i': 6, 'r': 2, ' ': 4},
  'x': {'t': 5, 'e': 4, 'i': 3, ' ': 8},
  'y': {'o': 10, 'e': 6, 's': 5, 'a': 4, ' ': 20},
  'z': {'e': 10, 'y': 5, 'o': 4, 'a': 2, ' ': 4}
};

// --- Global State ---
let db = null;
let activeMode = "Edit"; // Edit, Delete, @CloudTTS, @LocalTTS, Copy, @CloudAI, Recolor
let shiftActive = false;
let previousCaretPosition = 0;
let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];
let lastPhraseRequestTime = 0;

// TTS playback tracking state
let currentPlayingAudio = null;
let activeTTSAbortController = null;
let isSpeakingCloud = false;
let isSpeakingLocal = false;

// Prediction requests abort controllers
let activeWordsAbortController = null;
let activePhrasesAbortController = null;

// Cached settings object to avoid async db reads in rendering loops
let settings = {
  font_size_editor: 32,
  font_size_keyboard: 24,
  min_target_width: 50,
  min_target_height: 40,
  basins_of_attraction: 0,
  home_assistant_url: "",
  home_assistant_token: "",
  biography_text: "",
  local_tts_voice: "",
  hover_brightness: 1.2
};

// Macro state tracking
let loadedActionTag = null;

// Next-word prediction context cache
let lastApiPredictions = [];

// --- IndexedDB Setup ---
const DB_NAME = "k2_web_db";
const DB_VERSION = 1;

function initDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onupgradeneeded = function(e) {
      db = e.target.result;
      if (!db.objectStoreNames.contains("settings")) {
        db.createObjectStore("settings", { keyPath: "key" });
      }
      if (!db.objectStoreNames.contains("chat_history")) {
        db.createObjectStore("chat_history", { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains("saved_actions")) {
        db.createObjectStore("saved_actions", { keyPath: "tag" });
      }
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

// Database Helpers
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

function saveAction(tag, action_text, color = null) {
  return new Promise((resolve) => {
    const txn = db.transaction("saved_actions", "readwrite");
    const store = txn.objectStore("saved_actions");
    store.put({ tag, action_text, color, timestamp: Date.now() });
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
  const seeded = await getSetting("font_size_editor");
  if (!seeded) {
    await setSetting("font_size_editor", "32");
    await setSetting("font_size_keyboard", "24");
    await setSetting("min_target_width", "50");
    await setSetting("min_target_height", "40");
    await setSetting("basins_of_attraction", "0");
    await setSetting("hover_brightness", "1.2");
    await setSetting("biography_text", "Name: Kay. Patient diagnosed with ALS.\nHusband: Phil. Family visits frequently.\nInterests: Loves science fiction and smart home tech.");
    
    await setPersonalSummary([
      { category: "User Info", content: "Name: Kay. Patient diagnosed with ALS. Currently retains good eye control." },
      { category: "Relationships", content: "Husband: Phil. Family lives nearby and visits frequently." },
      { category: "Interests", content: "Loves reading science fiction, listening to audiobooks, and keeping up with smart-home tech." }
    ]);
    
    await saveAction("Turn on lights", "Turn on the living room lights");
    await saveAction("Say Hello", "Say Hello, how are you today?");
    await saveAction("Say Thank You", "Say Thank you very much!");
    await saveAction("Type Kay", "Type Kay");
  }
}

// --- Dynamic Predictor Implementations in JS (0ms local execution) ---
function getNextCharProbabilities(prefix) {
  if (!prefix) {
    return normalizeProbabilities(DEFAULT_FREQS);
  }
  const lastChar = prefix[prefix.length - 1].toLowerCase();
  if (!BIGRAM_MATRIX[lastChar]) {
    return normalizeProbabilities(DEFAULT_FREQS);
  }
  
  let weights = Object.assign({}, BIGRAM_MATRIX[lastChar]);
  
  const alphabet = "abcdefghijklmnopqrstuvwxyz ";
  for (let i = 0; i < alphabet.length; i++) {
    const c = alphabet[i];
    if (weights[c] === undefined) {
      weights[c] = 0.05;
    } else {
      weights[c] += 0.05;
    }
  }
  return normalizeProbabilities(weights);
}

function getBlendedCharProbabilities(prefix) {
  const staticProbs = getNextCharProbabilities(prefix);
  
  const lastSpace = prefix.lastIndexOf(" ");
  const currentWordPrefix = lastSpace === -1 ? prefix.toLowerCase() : prefix.substring(lastSpace + 1).toLowerCase();
  
  if (!currentWordPrefix) {
    return staticProbs;
  }
  
  // Find matches in local dictionary and cached API predictions
  const dictMatches = DICTIONARY.filter(w => w.word.startsWith(currentWordPrefix));
  const apiMatches = lastApiPredictions.filter(w => w.word.startsWith(currentWordPrefix));
  
  const dictSum = dictMatches.reduce((sum, item) => sum + item.weight, 0);
  const apiSum = apiMatches.reduce((sum, item) => sum + item.weight, 0);
  
  // Combine all unique words
  const allWordSet = new Set([
    ...dictMatches.map(m => m.word),
    ...apiMatches.map(m => m.word)
  ]);
  
  let candidateProbs = {};
  const alpha = apiSum > 0 ? 0.6 : 0.0; // Blend weight: 60% API, 40% Dict
  
  allWordSet.forEach(word => {
    const dictMatch = dictMatches.find(m => m.word === word);
    const apiMatch = apiMatches.find(m => m.word === word);
    
    const pDict = dictSum > 0 && dictMatch ? (dictMatch.weight / dictSum) : 0.0;
    const pApi = apiSum > 0 && apiMatch ? (apiMatch.weight / apiSum) : 0.0;
    
    candidateProbs[word] = alpha * pApi + (1.0 - alpha) * pDict;
  });
  
  let bucketProbs = {};
  for (const word in candidateProbs) {
    const prob = candidateProbs[word];
    if (word.length > currentWordPrefix.length) {
      const nextChar = word[currentWordPrefix.length];
      if ("abcdefghijklmnopqrstuvwxyz ".includes(nextChar)) {
        bucketProbs[nextChar] = (bucketProbs[nextChar] || 0) + prob;
      }
    } else if (word.length === currentWordPrefix.length) {
      bucketProbs[" "] = (bucketProbs[" "] || 0) + prob;
    }
  }
  
  const beta = 0.7; // 70% word context, 30% bigram priors
  let blended = {};
  const alphabet = "abcdefghijklmnopqrstuvwxyz ";
  for (let i = 0; i < alphabet.length; i++) {
    const c = alphabet[i];
    const pBucket = bucketProbs[c] || 0.0;
    const pStatic = staticProbs[c] || 0.0;
    blended[c] = beta * pBucket + (1.0 - beta) * pStatic;
  }
  
  return normalizeProbabilities(blended);
}

function normalizeProbabilities(freqs) {
  let total = 0;
  for (const k in freqs) {
    total += freqs[k];
  }
  let normalized = {};
  const alphabet = "abcdefghijklmnopqrstuvwxyz ";
  if (total === 0) {
    for (let i = 0; i < alphabet.length; i++) {
      normalized[alphabet[i]] = 1.0 / 27;
    }
    return normalized;
  }
  for (const k in freqs) {
    normalized[k] = freqs[k] / total;
  }
  return normalized;
}

// --- Dwell Scroll Implementation ---
function setupDwellScrolling(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  let scrollInterval = null;
  let speed = 0;
  
  container.addEventListener("mousemove", (e) => {
    const rect = container.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const h = rect.height;
    const threshold = h * 0.15; // 15% top/bottom scroll boundary
    
    if (y < threshold) {
      const ratio = (threshold - y) / threshold;
      speed = -ratio * 15;
      if (!scrollInterval) {
        scrollInterval = setInterval(() => {
          container.scrollTop += speed;
        }, 16);
      }
    } else if (y > h - threshold) {
      const ratio = (y - (h - threshold)) / threshold;
      speed = ratio * 15;
      if (!scrollInterval) {
        scrollInterval = setInterval(() => {
          container.scrollTop += speed;
        }, 16);
      }
    } else {
      clearInterval(scrollInterval);
      scrollInterval = null;
    }
  });
  
  container.addEventListener("mouseleave", () => {
    clearInterval(scrollInterval);
    scrollInterval = null;
  });
}

// --- Page Setup & Listeners ---
document.addEventListener("DOMContentLoaded", async () => {
  await initDatabase();
  
  // Initialize Preferences UI
  const fontEd = await getSetting("font_size_editor", "32");
  const fontKy = await getSetting("font_size_keyboard", "24");
  const minW = await getSetting("min_target_width", "50");
  const minH = await getSetting("min_target_height", "40");
  const basins = await getSetting("basins_of_attraction", "0");
  const haUrl = await getSetting("home_assistant_url", "");
  const haToken = await getSetting("home_assistant_token", "");
  const bio = await getSetting("biography_text", "");
  const localVoice = await getSetting("local_tts_voice", "");
  const hoverB = await getSetting("hover_brightness", "1.2");
  
  document.getElementById("editor-box").style.fontSize = `${fontEd}px`;
  document.getElementById("font-editor").value = fontEd;
  document.getElementById("font-keyboard").value = fontKy;
  document.getElementById("min-target-width").value = minW;
  document.getElementById("min-target-height").value = minH;
  document.getElementById("basins-of-attraction-toggle").checked = (basins === "1");
  document.getElementById("ha-url-input").value = haUrl;
  document.getElementById("ha-token-input").value = haToken;
  document.getElementById("biography-text").value = bio;
  const hoverBEl = document.getElementById("hover-brightness");
  if (hoverBEl) {
    hoverBEl.value = hoverB;
  }
  
  // Cache globally
  settings.font_size_editor = parseInt(fontEd, 10) || 32;
  settings.font_size_keyboard = parseInt(fontKy, 10) || 24;
  settings.min_target_width = parseInt(minW, 10) || 50;
  settings.min_target_height = parseInt(minH, 10) || 40;
  settings.basins_of_attraction = basins === "1" ? 1 : 0;
  settings.home_assistant_url = haUrl;
  settings.home_assistant_token = haToken;
  settings.biography_text = bio;
  settings.local_tts_voice = localVoice;
  settings.hover_brightness = parseFloat(hoverB) || 1.2;
  document.documentElement.style.setProperty("--hover-brightness", settings.hover_brightness);
  
  // Populate local TTS Voice dropdown
  populateVoiceDropdown();
  window.speechSynthesis.onvoiceschanged = populateVoiceDropdown;
  
  setupUIBindings();
  setupDwellScrolling("chat-log-scroll");
  setupDwellScrolling("actions-grid");
  
  renderSavedActions();
  renderChatLog();
  updatePredictionsAndKeyboard();
  
  const editor = document.getElementById("editor-box");
  editor.focus();
  editor.setSelectionRange(0, 0);
  previousCaretPosition = 0;
});

function populateVoiceDropdown() {
  const select = document.getElementById("local-tts-voice-select");
  if (!select) return;
  select.innerHTML = "";
  
  const voices = window.speechSynthesis.getVoices();
  voices.forEach(voice => {
    const option = document.createElement("option");
    option.value = voice.name;
    option.textContent = `${voice.name} (${voice.lang})`;
    if (voice.name === settings.local_tts_voice) {
      option.selected = true;
    }
    select.appendChild(option);
  });
}

function updateRecolorButtonColors() {
  const dropdown = document.getElementById("action-color-select");
  const trigger = document.getElementById("color-dropdown-trigger");
  const recolorBtn = document.getElementById("mode-recolor");
  if (!dropdown || !recolorBtn) return;
  
  const chosenColorName = dropdown.value;
  const colorMap = {
    "Blue": "#1f538d", "Green": "#2ecc71", "Red": "#e74c3c", "Orange": "#e67e22",
    "Purple": "#9b59b6", "Yellow": "#f1c40f", "Teal": "#1abc9c", "Pink": "#e84393", "Gray": "#7f8c8d"
  };
  const hex = colorMap[chosenColorName] || "#1f538d";
  
  if (trigger) {
    trigger.textContent = chosenColorName;
    trigger.style.backgroundColor = hex;
    trigger.style.color = ["Yellow", "Teal", "Green"].includes(chosenColorName) ? "black" : "white";
  }
  
  recolorBtn.style.backgroundColor = hex;
  recolorBtn.style.color = ["Yellow", "Teal", "Green"].includes(chosenColorName) ? "black" : "white";
}

function setupUIBindings() {
  const editor = document.getElementById("editor-box");
  
  // Sync predictions and keyboard state on native editor events
  editor.addEventListener("keyup", () => {
    previousCaretPosition = editor.selectionStart;
    updatePredictionsAndKeyboard();
  });
  
  editor.addEventListener("input", () => {
    previousCaretPosition = editor.selectionStart;
    updatePredictionsAndKeyboard();
  });
  
  editor.addEventListener("click", () => {
    if (editor.value === "Type here...") {
      editor.setSelectionRange(0, 0);
    } else if (shiftActive) {
      // Shift-selection extension rule
      const start = Math.min(previousCaretPosition, editor.selectionStart);
      const end = Math.max(previousCaretPosition, editor.selectionStart);
      editor.setSelectionRange(start, end);
      shiftActive = false;
      renderKeyboard(getBlendedCharProbabilities(editor.value));
    }
    previousCaretPosition = editor.selectionStart;
    updatePredictionsAndKeyboard();
  });

  // Global window key intercept for physical keyboards
  window.addEventListener("keydown", (e) => {
    const activeEl = document.activeElement;
    if (activeEl && ["biography-text", "font-editor", "font-keyboard", "hover-brightness", "min-target-width", "min-target-height", "ha-url-input", "ha-token-input"].includes(activeEl.id)) {
      return; // Skip intercepting inside modal inputs
    }
    
    if (e.ctrlKey || e.metaKey) return;
    
    const key = e.key;
    if (activeEl !== editor) {
      if (key === "Backspace") {
        e.preventDefault();
        deleteChar();
      } else if (key === "Delete") {
        e.preventDefault();
        deleteNextChar();
      } else if (key.length === 1) {
        e.preventDefault();
        const char = shiftActive ? key.toUpperCase() : key.toLowerCase();
        insertTextAtCursor(char);
        if (shiftActive) {
          shiftActive = false;
        }
      }
    } else {
      if (key.length === 1 && shiftActive) {
        e.preventDefault();
        insertTextAtCursor(key.toUpperCase());
        shiftActive = false;
      }
    }
  });

  // Toolbar Actions
  document.getElementById("btn-clear").addEventListener("click", () => {
    editor.value = "";
    previousCaretPosition = 0;
    loadedActionTag = null; // Clear macro tracking when editor is cleared
    updatePredictionsAndKeyboard();
    editor.focus();
  });
  
  document.getElementById("btn-del-word").addEventListener("click", () => {
    deleteWord();
    editor.focus();
  });
  
  document.getElementById("btn-del-char").addEventListener("click", () => {
    deleteChar();
    editor.focus();
  });
  
  document.getElementById("btn-dictate").addEventListener("click", toggleDictation);
  document.getElementById("btn-cloud-tts").addEventListener("click", () => speakCloudTTS(editor.value));
  document.getElementById("btn-local-tts").addEventListener("click", () => speakLocalTTS(editor.value));
  
  document.getElementById("btn-copy").addEventListener("click", async () => {
    if (!editor.value) return;
    try {
      await navigator.clipboard.writeText(editor.value);
      addChatMessage("system", `Copied text to clipboard: "${editor.value}"`);
      renderChatLog();
    } catch (err) {
      console.error(err);
    }
  });
  
  document.getElementById("btn-cloud").addEventListener("click", executeSendCloud);
  
  document.getElementById("btn-save").addEventListener("click", async () => {
    if (!editor.value) return;
    
    if (loadedActionTag) {
      // Overwrite the currently loaded macro directly
      await saveAction(loadedActionTag, editor.value);
      renderSavedActions();
      addChatMessage("system", `Saved changes to macro "${loadedActionTag}"`);
      renderChatLog();
    } else {
      // Act like Save As
      const tag = prompt("Enter a short tag/label for this macro button:");
      if (!tag) return;
      await saveAction(tag, editor.value);
      loadedActionTag = tag;
      renderSavedActions();
    }
    editor.focus();
  });

  document.getElementById("btn-save-as").addEventListener("click", async () => {
    if (!editor.value) return;
    const tag = prompt("Save As... Enter a new tag/label for this macro:");
    if (!tag) return;
    await saveAction(tag, editor.value);
    loadedActionTag = tag;
    renderSavedActions();
    editor.focus();
  });

  // Action Mode triggers
  document.querySelectorAll(".action-modes .mode-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".action-modes .mode-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeMode = btn.textContent;
    });
  });

  // Recolor controls
  const colorSelect = document.getElementById("action-color-select");
  if (colorSelect) {
    colorSelect.addEventListener("change", updateRecolorButtonColors);
  }
  updateRecolorButtonColors();

  // Custom color dropdown triggers
  const colorTrigger = document.getElementById("color-dropdown-trigger");
  const colorMenu = document.getElementById("color-dropdown-menu");
  if (colorTrigger && colorMenu) {
    colorTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      colorMenu.classList.toggle("show");
    });
    
    document.addEventListener("click", () => {
      colorMenu.classList.remove("show");
    });
    
    const items = colorMenu.querySelectorAll(".custom-dropdown-item");
    items.forEach(item => {
      item.addEventListener("click", () => {
        const val = item.getAttribute("data-value");
        const select = document.getElementById("action-color-select");
        if (select) {
          select.value = val;
          select.dispatchEvent(new Event("change"));
        }
      });
    });
  }

  // Settings Modal controls
  document.getElementById("btn-settings").addEventListener("click", () => {
    document.getElementById("settings-modal").style.display = "flex";
  });
  
  document.getElementById("btn-settings-close").addEventListener("click", async () => {
    const fontEd = document.getElementById("font-editor").value;
    const fontKy = document.getElementById("font-keyboard").value;
    const minW = document.getElementById("min-target-width").value;
    const minH = document.getElementById("min-target-height").value;
    const basins = document.getElementById("basins-of-attraction-toggle").checked ? "1" : "0";
    const haUrl = document.getElementById("ha-url-input").value;
    const haToken = document.getElementById("ha-token-input").value;
    const bioText = document.getElementById("biography-text").value;
    const localVoice = document.getElementById("local-tts-voice-select").value;
    const hoverBEl = document.getElementById("hover-brightness");
    const hoverBrightness = hoverBEl ? hoverBEl.value : "1.2";
    
    await setSetting("font_size_editor", fontEd);
    await setSetting("font_size_keyboard", fontKy);
    await setSetting("min_target_width", minW);
    await setSetting("min_target_height", minH);
    await setSetting("basins_of_attraction", basins);
    await setSetting("home_assistant_url", haUrl);
    await setSetting("home_assistant_token", haToken);
    await setSetting("biography_text", bioText);
    await setSetting("local_tts_voice", localVoice);
    await setSetting("hover_brightness", hoverBrightness);
    
    // Update global settings cache
    settings.font_size_editor = parseInt(fontEd, 10) || 32;
    settings.font_size_keyboard = parseInt(fontKy, 10) || 24;
    settings.min_target_width = parseInt(minW, 10) || 50;
    settings.min_target_height = parseInt(minH, 10) || 40;
    settings.basins_of_attraction = basins === "1" ? 1 : 0;
    settings.home_assistant_url = haUrl;
    settings.home_assistant_token = haToken;
    settings.biography_text = bioText;
    settings.local_tts_voice = localVoice;
    settings.hover_brightness = parseFloat(hoverBrightness) || 1.2;
    
    document.documentElement.style.setProperty("--hover-brightness", settings.hover_brightness);
    document.getElementById("editor-box").style.fontSize = `${fontEd}px`;
    
    updatePredictionsAndKeyboard();
    document.getElementById("settings-modal").style.display = "none";
  });

  // Profile Compilation via Gemini
  document.getElementById("btn-compile").addEventListener("click", executeCompileProfile);

  // Backup & Import Bindings
  document.getElementById("btn-export-config").addEventListener("click", exportConfiguration);
  
  const fileInput = document.getElementById("import-file-input");
  document.getElementById("btn-import-config").addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length) {
      importConfiguration(e.target.files[0]);
    }
  });
}

// --- Editor Suffix/Prefix insertion operations ---
function insertTextAtCursor(text) {
  const editor = document.getElementById("editor-box");
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const currentText = editor.value;
  
  editor.value = currentText.substring(0, start) + text + currentText.substring(end);
  editor.selectionStart = editor.selectionEnd = start + text.length;
  previousCaretPosition = editor.selectionStart;
  updatePredictionsAndKeyboard();
}

function deleteChar() {
  const editor = document.getElementById("editor-box");
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const currentText = editor.value;
  
  if (start !== end) {
    editor.value = currentText.substring(0, start) + currentText.substring(end);
    editor.selectionStart = editor.selectionEnd = start;
  } else if (start > 0) {
    editor.value = currentText.substring(0, start - 1) + currentText.substring(start);
    editor.selectionStart = editor.selectionEnd = start - 1;
  }
  previousCaretPosition = editor.selectionStart;
  updatePredictionsAndKeyboard();
}

function deleteNextChar() {
  const editor = document.getElementById("editor-box");
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const currentText = editor.value;
  
  if (start !== end) {
    editor.value = currentText.substring(0, start) + currentText.substring(end);
    editor.selectionStart = editor.selectionEnd = start;
  } else if (start < currentText.length) {
    editor.value = currentText.substring(0, start) + currentText.substring(start + 1);
    editor.selectionStart = editor.selectionEnd = start;
  }
  previousCaretPosition = editor.selectionStart;
  updatePredictionsAndKeyboard();
}

function deleteWord() {
  const editor = document.getElementById("editor-box");
  const start = editor.selectionStart;
  const currentText = editor.value;
  
  const textBefore = currentText.substring(0, start);
  const words = textBefore.trimEnd().split(" ");
  words.pop();
  const rest = words.join(" ") + (words.length ? " " : "");
  
  editor.value = rest + currentText.substring(start);
  editor.selectionStart = editor.selectionEnd = rest.length;
  previousCaretPosition = editor.selectionStart;
  updatePredictionsAndKeyboard();
}

// --- Predictions Sizing & Sizing Pipeline ---
function updatePredictionsAndKeyboard() {
  const editor = document.getElementById("editor-box");
  const text = editor.value;
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  
  const textBefore = text.substring(0, start);
  const textAfter = text.substring(end);
  
  // Calculate current word prefix matching
  const lastSpace = textBefore.lastIndexOf(" ");
  const wordPrefix = lastSpace === -1 ? textBefore.toLowerCase() : textBefore.substring(lastSpace + 1).toLowerCase();
  
  // 1. Core Character Probability Calculation (blended)
  const charProbs = getBlendedCharProbabilities(textBefore);
  
  // 2. Word Predictions: Filter words starting with current typed prefix, blend & sort by weight descending
  let wordCompletions = [];
  if (wordPrefix) {
    const dictMatches = DICTIONARY.filter(w => w.word.startsWith(wordPrefix));
    const apiMatches = lastApiPredictions.filter(w => w.word.startsWith(wordPrefix));
    
    const dictSum = dictMatches.reduce((sum, item) => sum + item.weight, 0);
    const apiSum = apiMatches.reduce((sum, item) => sum + item.weight, 0);
    
    const allWordSet = new Set([
      ...dictMatches.map(m => m.word),
      ...apiMatches.map(m => m.word)
    ]);
    
    const alpha = apiSum > 0 ? 0.6 : 0.0;
    let blendedList = [];
    allWordSet.forEach(word => {
      const dictMatch = dictMatches.find(m => m.word === word);
      const apiMatch = apiMatches.find(m => m.word === word);
      
      const pDict = dictSum > 0 && dictMatch ? (dictMatch.weight / dictSum) : 0.0;
      const pApi = apiSum > 0 && apiMatch ? (apiMatch.weight / apiSum) : 0.0;
      
      const prob = alpha * pApi + (1.0 - alpha) * pDict;
      blendedList.push({ word, prob });
    });
    
    blendedList.sort((a, b) => b.prob - a.prob);
    wordCompletions = blendedList.map(item => item.word);
  } else {
    // Word boundary: Offer cached next-word predictions if available, else static commons
    if (lastApiPredictions.length > 0) {
      wordCompletions = lastApiPredictions.map(item => item.word);
    } else {
      wordCompletions = DICTIONARY.slice().sort((a, b) => b.weight - a.weight).map(item => item.word);
    }
  }
  renderWordPredictions(wordCompletions.slice(0, 10), wordPrefix);
  
  // 3. Phrase Predictions & Next-Word Background Predictions Fetch: Trigger at word boundaries
  const isBoundary = (textBefore.length === 0 || textBefore.endsWith(" ") || textBefore.endsWith("\n") || textBefore.endsWith("\r"));
  if (isBoundary) {
    const now = Date.now();
    // Debounce cloud calls: 400ms delay window
    if (now - lastPhraseRequestTime > 400) {
      lastPhraseRequestTime = now;
      executeFetchPhrases(textBefore, textAfter);
      // Fetch Word Predictions from Backend asynchronously in the background
      executeFetchWords(textBefore, wordPrefix);
    }
  } else {
    // Clear phrase completions inside the middle of a word
    document.getElementById("phrase-predictions").innerHTML = "";
  }
  
  // 4. Redraw Keyboard probabilities HSL coloring
  renderKeyboard(charProbs);
}

// Separate helper for async API updates to prevent fetch loops
function updatePredictionsAndKeyboardOnly() {
  const editor = document.getElementById("editor-box");
  const text = editor.value;
  const start = editor.selectionStart;
  const textBefore = text.substring(0, start);
  
  const lastSpace = textBefore.lastIndexOf(" ");
  const wordPrefix = lastSpace === -1 ? textBefore.toLowerCase() : textBefore.substring(lastSpace + 1).toLowerCase();
  
  const charProbs = getBlendedCharProbabilities(textBefore);
  
  let wordCompletions = [];
  if (wordPrefix) {
    const dictMatches = DICTIONARY.filter(w => w.word.startsWith(wordPrefix));
    const apiMatches = lastApiPredictions.filter(w => w.word.startsWith(wordPrefix));
    
    const dictSum = dictMatches.reduce((sum, item) => sum + item.weight, 0);
    const apiSum = apiMatches.reduce((sum, item) => sum + item.weight, 0);
    
    const allWordSet = new Set([
      ...dictMatches.map(m => m.word),
      ...apiMatches.map(m => m.word)
    ]);
    
    const alpha = apiSum > 0 ? 0.6 : 0.0;
    let blendedList = [];
    allWordSet.forEach(word => {
      const dictMatch = dictMatches.find(m => m.word === word);
      const apiMatch = apiMatches.find(m => m.word === word);
      
      const pDict = dictSum > 0 && dictMatch ? (dictMatch.weight / dictSum) : 0.0;
      const pApi = apiSum > 0 && apiMatch ? (apiMatch.weight / apiSum) : 0.0;
      
      const prob = alpha * pApi + (1.0 - alpha) * pDict;
      blendedList.push({ word, prob });
    });
    
    blendedList.sort((a, b) => b.prob - a.prob);
    wordCompletions = blendedList.map(item => item.word);
  } else {
    if (lastApiPredictions.length > 0) {
      wordCompletions = lastApiPredictions.map(item => item.word);
    } else {
      wordCompletions = DICTIONARY.slice().sort((a, b) => b.weight - a.weight).map(item => item.word);
    }
  }
  renderWordPredictions(wordCompletions.slice(0, 10), wordPrefix);
  renderKeyboard(charProbs);
}

async function executeFetchWords(textBefore, prefix) {
  if (activeWordsAbortController) {
    activeWordsAbortController.abort();
  }
  const controller = new AbortController();
  activeWordsAbortController = controller;
  const signal = controller.signal;

  try {
    const history = await getChatHistory();
    if (activeWordsAbortController !== controller) return;

    const summaryList = await getPersonalSummary();
    if (activeWordsAbortController !== controller) return;

    const profile_summary = summaryList.map(i => `${i.category}: ${i.content}`).join("\n");
    if (activeWordsAbortController !== controller) return;
    
    const res = await fetch("/api/predict-words", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        history,
        profile_summary,
        text_prefix: textBefore
      }),
      signal: signal
    });
    
    const data = await res.json();
    if (activeWordsAbortController !== controller) return;

    if (data.predictions && Array.isArray(data.predictions)) {
      lastApiPredictions = data.predictions;
      updatePredictionsAndKeyboardOnly();
    }
  } catch (err) {
    if (err.name !== "AbortError") {
      console.error("Word predictions API failed:", err);
    }
  } finally {
    if (activeWordsAbortController === controller) {
      activeWordsAbortController = null;
    }
  }
}

function renderWordPredictions(words, prefix) {
  const container = document.getElementById("word-predictions");
  container.innerHTML = "";
  
  words.forEach(word => {
    const btn = document.createElement("button");
    btn.className = "predict-btn";
    
    // Highlight suffix text and gray out prefix
    if (prefix && word.startsWith(prefix)) {
      btn.innerHTML = `<span class="prefix">${prefix}</span>${word.substring(prefix.length)}`;
    } else {
      btn.textContent = word;
    }
    
    btn.onclick = () => {
      const editor = document.getElementById("editor-box");
      const start = editor.selectionStart;
      const currentText = editor.value;
      const textBefore = currentText.substring(0, start);
      const lastSpace = textBefore.lastIndexOf(" ");
      const newTextBefore = (lastSpace === -1 ? "" : textBefore.substring(0, lastSpace + 1)) + word + " ";
      
      editor.value = newTextBefore + currentText.substring(start);
      editor.selectionStart = editor.selectionEnd = newTextBefore.length;
      previousCaretPosition = editor.selectionStart;
      
      // Clear cached predictions on selection boundary trigger
      lastApiPredictions = [];
      
      updatePredictionsAndKeyboard();
      editor.focus();
    };
    container.appendChild(btn);
  });
}

async function executeFetchPhrases(textBefore, textAfter) {
  if (activePhrasesAbortController) {
    activePhrasesAbortController.abort();
  }
  const controller = new AbortController();
  activePhrasesAbortController = controller;
  const signal = controller.signal;

  const container = document.getElementById("phrase-predictions");
  const thinking = document.getElementById("phrase-thinking");
  
  thinking.style.display = "inline";
  
  try {
    const history = await getChatHistory();
    if (activePhrasesAbortController !== controller) return;

    const summaryList = await getPersonalSummary();
    if (activePhrasesAbortController !== controller) return;

    const profile_summary = summaryList.map(i => `${i.category}: ${i.content}`).join("\n");
    if (activePhrasesAbortController !== controller) return;
    
    const res = await fetch("/api/predict-phrases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text_prefix: textBefore,
        text_suffix: textAfter,
        history,
        profile_summary
      }),
      signal: signal
    });
    
    const data = await res.json();
    if (activePhrasesAbortController !== controller) return;

    if (data.phrases) {
      renderPhrasePredictions(data.phrases, textBefore, textAfter);
    }
  } catch (err) {
    if (err.name !== "AbortError") {
      console.error("Phrase prediction request failed:", err);
    }
  } finally {
    if (activePhrasesAbortController === controller) {
      thinking.style.display = "none";
      activePhrasesAbortController = null;
    }
  }
}

function renderPhrasePredictions(phrases, textBefore, textAfter) {
  const container = document.getElementById("phrase-predictions");
  container.innerHTML = "";
  
  phrases.forEach(phrase => {
    const btn = document.createElement("button");
    btn.className = "predict-btn";
    btn.textContent = phrase;
    
    btn.onclick = () => {
      const editor = document.getElementById("editor-box");
      
      // Replace whole text preceding caret with completion
      const completedTextBefore = textBefore + phrase + " ";
      editor.value = completedTextBefore + textAfter;
      editor.selectionStart = editor.selectionEnd = completedTextBefore.length;
      previousCaretPosition = editor.selectionStart;
      
      updatePredictionsAndKeyboard();
      editor.focus();
    };
    container.appendChild(btn);
  });
}

function renderKeyboard(probabilities) {
  const container = document.getElementById("keyboard");
  container.innerHTML = "";
  
  const layout = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m", ",", "."],
    ["Shift", "Space", "Backspace"]
  ];
  
  const fontKy = settings.font_size_keyboard;
  const maxObserved = Math.max(...Object.values(probabilities));
  
  layout.forEach((row, rowIdx) => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "keyboard-row";
    
    row.forEach(key => {
      const keyBtn = document.createElement("div");
      keyBtn.className = "key";
      keyBtn.style.fontSize = `${fontKy}px`;
      
      // Base layouts weights
      if (rowIdx === 4) {
        // Space, Shift, Backspace
        keyBtn.classList.add("special-key");
        keyBtn.textContent = key.toUpperCase();
        if (key === "Space") {
          keyBtn.style.flex = "4";
          keyBtn.textContent = "SPACE";
        } else {
          keyBtn.style.flex = "2";
        }
        if (key === "Shift" && shiftActive) {
          keyBtn.classList.add("active");
        }
      } else {
        // Standard QWERTY character keys
        keyBtn.textContent = shiftActive ? key.toUpperCase() : key.toLowerCase();
        keyBtn.style.flex = "1";
        
        // HSL Dynamic coloring
        const prob = probabilities[key.toLowerCase()] || 0;
        const ratio = maxObserved > 0 ? Math.min(1.0, prob / maxObserved) : 0;
        
        const hue = Math.round(ratio * 120); // Scale Hue Red/Gray (0) -> Green (120)
        const sat = Math.round(15 + ratio * 65); // Saturation scales up with prob
        const lit = Math.round(25 + ratio * 15);  // Lightness scales up slightly
        
        keyBtn.style.backgroundColor = `hsl(${hue}, ${sat}%, ${lit}%)`;
        keyBtn.style.borderColor = `hsl(${hue}, ${sat}%, ${lit + 5}%)`;
      }
      
      // Key Tap dispatch handlers
      keyBtn.onclick = () => {
        const editor = document.getElementById("editor-box");
        editor.focus();
        
        if (key === "Shift") {
          shiftActive = !shiftActive;
          renderKeyboard(probabilities);
        } else if (key === "Backspace") {
          deleteChar();
        } else if (key === "Space") {
          insertTextAtCursor(" ");
        } else {
          const char = shiftActive ? key.toUpperCase() : key.toLowerCase();
          insertTextAtCursor(char);
          if (shiftActive) {
            shiftActive = false;
            // Recalculate layout in normal case
            renderKeyboard(probabilities);
          }
        }
      };
      
      rowDiv.appendChild(keyBtn);
    });
    
    container.appendChild(rowDiv);
  });
}

let hoverTimeoutId = null;
let resetTimeoutId = null;

function setupHoverPreview(element, text) {
  element.onmouseenter = () => {
    if (resetTimeoutId) {
      clearTimeout(resetTimeoutId);
      resetTimeoutId = null;
    }
    if (hoverTimeoutId) {
      clearTimeout(hoverTimeoutId);
    }
    hoverTimeoutId = setTimeout(() => {
      document.getElementById("actions-preview").textContent = text;
      hoverTimeoutId = null;
    }, 250);
  };

  element.onmouseleave = () => {
    if (hoverTimeoutId) {
      clearTimeout(hoverTimeoutId);
      hoverTimeoutId = null;
    }
    if (resetTimeoutId) {
      clearTimeout(resetTimeoutId);
    }
    resetTimeoutId = setTimeout(() => {
      document.getElementById("actions-preview").textContent = "Hover over an action to preview...";
      resetTimeoutId = null;
    }, 2000);
  };
}

async function renderSavedActions() {
  const grid = document.getElementById("actions-grid");
  grid.innerHTML = "";
  
  const saved = await getSavedActions();
  
  // Sort chronologically (latest last)
  saved.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
  
  saved.forEach(action => {
    const card = document.createElement("div");
    card.className = "action-card";
    card.textContent = action.tag;
    
    // Apply macro card background colors if set in database
    if (action.color) {
      card.style.backgroundColor = action.color;
      // Contrast text colors
      const isBright = ["#2ecc71", "#f1c40f", "#1abc9c", "Yellow", "Green", "Teal"].some(c => action.color.includes(c));
      card.style.color = isBright ? "black" : "white";
    }
    
    // Hover tooltips for preview bar
    setupHoverPreview(card, `Macro Preview: "${action.action_text}"`);
    
    // Click macro behaviour based on Action Mode selector
    card.onclick = async () => {
      executeActionByMode(action.tag, action.action_text);
    };
    
    grid.appendChild(card);
  });
}

async function executeActionByMode(tag, action_text) {
  const editor = document.getElementById("editor-box");
  
  if (activeMode === "Edit") {
    // Insert text at cursor, leaving selection caret at end
    insertTextAtCursor(action_text);
    loadedActionTag = tag;
    editor.focus();
  } else if (activeMode === "@CloudTTS") {
    speakCloudTTS(action_text);
  } else if (activeMode === "@LocalTTS") {
    speakLocalTTS(action_text);
  } else if (activeMode === "Copy") {
    try {
      await navigator.clipboard.writeText(action_text);
      addChatMessage("system", `Copied macro "${tag}" text to clipboard: "${action_text}"`);
      renderChatLog();
    } catch (err) {
      console.error(err);
    }
  } else if (activeMode === "Delete") {
    if (confirm(`Delete macro action "${tag}"?`)) {
      await deleteAction(tag);
      renderSavedActions();
    }
  } else if (activeMode === "@CloudAI") {
    // Execute macro query cloud chatbot
    editor.value = action_text;
    executeSendCloud();
  } else if (activeMode === "Recolor") {
    const dropdown = document.getElementById("action-color-select");
    const chosenColorName = dropdown.value;
    const colorMap = {
      "Blue": "#1f538d", "Green": "#2ecc71", "Red": "#e74c3c", "Orange": "#e67e22",
      "Purple": "#9b59b6", "Yellow": "#f1c40f", "Teal": "#1abc9c", "Pink": "#e84393", "Gray": "#7f8c8d"
    };
    const hex = colorMap[chosenColorName] || "#1f538d";
    await saveAction(tag, action_text, hex);
    renderSavedActions();
  }
}

// --- Gemini Cloud Chat & Tool Action Routing ---
async function executeSendCloud() {
  const editor = document.getElementById("editor-box");
  const text = editor.value;
  if (!text.trim()) return;
  
  addChatMessage("user", text);
  renderChatLog();
  editor.value = "";
  previousCaretPosition = 0;
  loadedActionTag = null; // Clear macro selection
  updatePredictionsAndKeyboard();
  
  // Show temporary "Thinking..." bubble in chat log
  const log = document.getElementById("chat-log-scroll");
  const thinkingDiv = document.createElement("div");
  thinkingDiv.className = "chat-message cloud_ai thinking";
  thinkingDiv.textContent = "Cloud AI is thinking...";
  log.appendChild(thinkingDiv);
  log.scrollTop = log.scrollHeight;
  
  const history = await getChatHistory();
  const summaryList = await getPersonalSummary();
  const profile_summary = summaryList.map(i => `${i.category}: ${i.content}`).join("\n");
  
  const haUrl = await getSetting("home_assistant_url", "");
  const haToken = await getSetting("home_assistant_token", "");
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 seconds timeout
  
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_message: text,
        history,
        profile_summary,
        home_assistant_url: haUrl,
        home_assistant_token: haToken
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    // Remove "Thinking..." bubble
    thinkingDiv.remove();
    
    const data = await res.json();
    if (data.reply) {
      await addChatMessage("cloud_ai", data.reply);
      renderChatLog();
      renderSuggestions(data.suggestions);
      
      // Execute returned client-side actions (TTS, inject copy, HA status updates)
      if (data.client_actions && Array.isArray(data.client_actions)) {
        for (const action of data.client_actions) {
          if (action.type === "speak") {
            speakTTS(action.text);
          } else if (action.type === "copy") {
            try {
              await navigator.clipboard.writeText(action.text);
              addChatMessage("system", `Injected text (copied to clipboard): "${action.text}"`);
              renderChatLog();
            } catch (err) {
              console.error(err);
            }
          } else if (action.type === "status") {
            addChatMessage("system", action.detail);
            renderChatLog();
          }
        }
      }
    }
  } catch (err) {
    clearTimeout(timeoutId);
    if (thinkingDiv.parentNode) {
      thinkingDiv.remove();
    }
    console.error("Cloud chat request failed or timed out:", err);
    addChatMessage("system", "Cloud AI request timed out. Please try again.");
    renderChatLog();
  }
}

function renderSuggestions(suggestions) {
  // Renders suggestions inline inside actions grid
  const grid = document.getElementById("actions-grid");
  suggestions.forEach(sug => {
    const card = document.createElement("div");
    card.className = "action-card";
    card.style.background = "rgba(16, 185, 129, 0.15)";
    card.style.borderColor = "var(--color-success)";
    card.style.color = "#fff";
    card.textContent = sug.tag;
    
    setupHoverPreview(card, `Suggestion Preview: "${sug.action_text}"`);
    
    card.onclick = () => {
      executeActionByMode(sug.tag, sug.action_text);
    };
    grid.appendChild(card);
  });
}

// --- Voice Synthesis Player ---
// --- Voice Synthesis Player ---
async function speakCloudTTS(text) {
  if (!text.trim()) return;
  
  const cloudBtn = document.getElementById("btn-cloud-tts");
  const localBtn = document.getElementById("btn-local-tts");
  
  // If clicked while already speaking, cancel it!
  if (isSpeakingCloud) {
    cancelCloudTTS();
    return;
  }
  
  // Start speaking cloud TTS
  isSpeakingCloud = true;
  if (cloudBtn) cloudBtn.textContent = "Speaking...";
  if (localBtn) localBtn.disabled = true;
  
  addChatMessage("system", `Speaking (CloudTTS): "${text}"`);
  renderChatLog();
  
  activeTTSAbortController = new AbortController();
  
  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal: activeTTSAbortController.signal
    });
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      currentPlayingAudio = new Audio(url);
      
      currentPlayingAudio.onended = () => {
        resetCloudTTSButtons();
      };
      
      currentPlayingAudio.onerror = () => {
        resetCloudTTSButtons();
      };
      
      await currentPlayingAudio.play();
    } else {
      addChatMessage("system", "Cloud TTS failed. Falling back to local TTS.");
      renderChatLog();
      resetCloudTTSButtons();
      speakLocalTTS(text);
    }
  } catch (err) {
    if (err.name !== "AbortError") {
      console.warn("Cloud TTS failed, using local fallback:", err);
      speakLocalTTS(text);
    }
    resetCloudTTSButtons();
  }
}

function cancelCloudTTS() {
  if (activeTTSAbortController) {
    activeTTSAbortController.abort();
    activeTTSAbortController = null;
  }
  if (currentPlayingAudio) {
    currentPlayingAudio.pause();
    currentPlayingAudio = null;
  }
  resetCloudTTSButtons();
  addChatMessage("system", "CloudTTS speaking cancelled.");
  renderChatLog();
}

function resetCloudTTSButtons() {
  isSpeakingCloud = false;
  const cloudBtn = document.getElementById("btn-cloud-tts");
  const localBtn = document.getElementById("btn-local-tts");
  if (cloudBtn) cloudBtn.textContent = "@CloudTTS";
  if (localBtn) localBtn.disabled = false;
}

function speakLocalTTS(text) {
  if (!text.trim()) return;
  
  const cloudBtn = document.getElementById("btn-cloud-tts");
  const localBtn = document.getElementById("btn-local-tts");
  
  // If clicked while already speaking, cancel it!
  if (isSpeakingLocal) {
    cancelLocalTTS();
    return;
  }
  
  // Start speaking local TTS
  isSpeakingLocal = true;
  if (localBtn) localBtn.textContent = "Speaking...";
  if (cloudBtn) cloudBtn.disabled = true;
  
  addChatMessage("system", `Speaking (LocalTTS): "${text}"`);
  renderChatLog();
  
  try {
    window.speechSynthesis.cancel(); // Cancel any current speech
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    
    // Find the voice selected in settings
    let selectedVoice = null;
    if (settings.local_tts_voice) {
      selectedVoice = voices.find(v => v.name === settings.local_tts_voice);
    }
    
    // Fallback if no selected voice or not found
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.startsWith("en-") && v.name.includes("Google")) || voices.find(v => v.lang.startsWith("en-"));
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.onend = () => {
      resetLocalTTSButtons();
    };
    
    utterance.onerror = () => {
      resetLocalTTSButtons();
    };
    
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error("Local speech failed:", err);
    resetLocalTTSButtons();
  }
}

function cancelLocalTTS() {
  window.speechSynthesis.cancel();
  resetLocalTTSButtons();
  addChatMessage("system", "LocalTTS speaking cancelled.");
  renderChatLog();
}

function resetLocalTTSButtons() {
  isSpeakingLocal = false;
  const cloudBtn = document.getElementById("btn-cloud-tts");
  const localBtn = document.getElementById("btn-local-tts");
  if (localBtn) localBtn.textContent = "@LocalTTS";
  if (cloudBtn) cloudBtn.disabled = false;
}

// --- Dictation Dictation recording logic ---
async function toggleDictation() {
  const dictateBtn = document.getElementById("btn-dictate");
  const editor = document.getElementById("editor-box");
  
  if (!isRecording) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.push(e.data);
      };
      
      mediaRecorder.onstop = async () => {
        dictateBtn.textContent = "Working...";
        dictateBtn.className = "btn btn-orange";
        dictateBtn.disabled = true;
        
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const formData = new FormData();
        formData.append("file", audioBlob, "recording.wav");
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout
        
        try {
          const res = await fetch("/api/transcribe", {
            method: "POST",
            body: formData,
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          const data = await res.json();
          if (data.transcript && !data.transcript.startsWith("Mock")) {
            insertTextAtCursor(data.transcript + " ");
          } else if (data.transcript) {
            addChatMessage("system", data.transcript);
            renderChatLog();
          }
        } catch (err) {
          clearTimeout(timeoutId);
          console.error("Transcription request failed or timed out:", err);
          addChatMessage("system", "Transcription request timed out. Please try again.");
          renderChatLog();
        } finally {
          dictateBtn.textContent = "Dictate";
          dictateBtn.className = "btn btn-purple";
          dictateBtn.disabled = false;
        }
      };
      
      mediaRecorder.start();
      isRecording = true;
      dictateBtn.textContent = "Listening...";
      dictateBtn.style.backgroundColor = "#ef4444";
    } catch (err) {
      alert("Mic device issue: " + err.message);
    }
  } else {
    mediaRecorder.stop();
    isRecording = false;
    dictateBtn.style.backgroundColor = "";
  }
}

// --- Profile Biography Compiler ---
async function executeCompileProfile() {
  const compileBtn = document.getElementById("btn-compile");
  const text = document.getElementById("biography-text").value;
  if (!text.trim()) return;

  compileBtn.disabled = true;
  compileBtn.textContent = "Compiling...";

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
      alert("Personal profile biography compiled successfully into SQLite schema categories!");
    }
  } catch (err) {
    console.error(err);
    alert("Compilation failed.");
  } finally {
    compileBtn.disabled = false;
    compileBtn.textContent = "Compile Profile via Gemini";
  }
}

// --- Backup Export / Import Configuration Operations ---
async function exportConfiguration() {
  const txn = db.transaction(["settings", "saved_actions", "personal_summary"], "readonly");
  const settingsReq = txn.objectStore("settings").getAll();
  const actionsReq = txn.objectStore("saved_actions").getAll();
  const summaryReq = txn.objectStore("personal_summary").getAll();
  
  txn.oncomplete = () => {
    const data = {
      settings: settingsReq.result,
      saved_actions: actionsReq.result,
      personal_summary: summaryReq.result
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `k2_web_config_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
}

async function importConfiguration(file) {
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const data = JSON.parse(e.target.result);
      const txn = db.transaction(["settings", "saved_actions", "personal_summary"], "readwrite");
      
      if (data.settings) {
        const store = txn.objectStore("settings");
        store.clear();
        data.settings.forEach(item => store.put(item));
      }
      if (data.saved_actions) {
        const store = txn.objectStore("saved_actions");
        store.clear();
        data.saved_actions.forEach(item => store.put(item));
      }
      if (data.personal_summary) {
        const store = txn.objectStore("personal_summary");
        store.clear();
        data.personal_summary.forEach(item => store.put(item));
      }
      
      txn.oncomplete = () => {
        alert("Configuration backup imported successfully! Reloading page...");
        window.location.reload();
      };
    } catch (err) {
      alert("Invalid backup configuration format: " + err.message);
    }
  };
  reader.readAsText(file);
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
  log.scrollTop = log.scrollHeight;
}
