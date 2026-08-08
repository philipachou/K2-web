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
  'a': { 'n': 10, 'r': 9, 't': 8, 's': 7, 'l': 6, 'd': 5, 'c': 4, 'm': 4, 'g': 3, 'b': 2, ' ': 8 },
  'b': { 'e': 10, 'u': 8, 'o': 7, 'a': 6, 'i': 5, 'l': 4, 'r': 4, 'y': 3, ' ': 3 },
  'c': { 'o': 10, 'h': 9, 'e': 8, 'a': 7, 'i': 6, 'k': 5, 'l': 4, 'u': 3, 'r': 3, ' ': 2 },
  'd': { 'e': 10, 'i': 7, 'o': 6, 'a': 5, 'u': 4, 'y': 3, 'r': 2, ' ': 12 },
  'e': { 'r': 10, 'n': 9, 's': 8, 'd': 7, 'a': 6, 'c': 5, 't': 4, 'l': 4, 'v': 3, ' ': 15 },
  'f': { 'o': 10, 'e': 8, 'i': 7, 'a': 6, 'r': 5, 'l': 4, 'u': 3, ' ': 10 },
  'g': { 'e': 10, 'o': 8, 'h': 7, 'i': 6, 'a': 5, 'r': 4, 'l': 3, ' ': 10 },
  'h': { 'e': 20, 'a': 15, 'o': 12, 'i': 10, 'u': 6, 'y': 4, ' ': 5 },
  'i': { 'n': 12, 's': 10, 't': 8, 'c': 7, 'o': 6, 'l': 5, 'd': 4, 'r': 3, ' ': 8 },
  'j': { 'e': 10, 'o': 8, 'a': 6, 'u': 4, ' ': 1 },
  'k': { 'e': 10, 'i': 8, 'y': 5, 'o': 4, 's': 2, ' ': 12 },
  'l': { 'e': 10, 'y': 8, 'o': 7, 'a': 6, 'i': 5, 'd': 4, 'u': 3, 'l': 2, ' ': 10 },
  'm': { 'e': 10, 'a': 8, 'o': 7, 'i': 6, 'u': 5, 'p': 4, 'y': 2, ' ': 10 },
  'n': { 'd': 10, 'g': 9, 't': 8, 'e': 7, 'o': 6, 'a': 5, 'i': 4, ' ': 15 },
  'o': { 'f': 12, 'n': 10, 'u': 8, 'r': 7, 'w': 6, 't': 5, 'm': 4, 'p': 3, ' ': 15 },
  'p': { 'e': 10, 'o': 8, 'a': 7, 'r': 6, 'l': 5, 'i': 4, 'u': 3, 'y': 2, ' ': 5 },
  'q': { 'u': 25, ' ': 1 },
  'r': { 'e': 12, 'o': 10, 'a': 8, 'i': 7, 'n': 5, 'd': 4, 'y': 3, ' ': 15 },
  's': { 't': 12, 'h': 10, 'e': 8, 'o': 7, 'i': 6, 'a': 5, 'u': 4, 'p': 3, ' ': 18 },
  't': { 'h': 22, 'e': 15, 'o': 10, 'a': 8, 'i': 7, 'r': 6, 'u': 4, 'y': 3, ' ': 20 },
  'u': { 'r': 10, 's': 8, 't': 7, 'l': 6, 'n': 5, 'p': 4, 'b': 3, 'c': 2, ' ': 5 },
  'v': { 'e': 15, 'o': 8, 'i': 6, 'a': 4, 'y': 2, ' ': 2 },
  'w': { 'h': 12, 'a': 10, 'o': 8, 'e': 7, 'i': 6, 'r': 2, ' ': 4 },
  'x': { 't': 5, 'e': 4, 'i': 3, ' ': 8 },
  'y': { 'o': 10, 'e': 6, 's': 5, 'a': 4, ' ': 20 },
  'z': { 'e': 10, 'y': 5, 'o': 4, 'a': 2, ' ': 4 }
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

let originalBiographyText = "";

let pendingImportFile = null;
let pendingImportType = null;
let pendingImportText = null;
let currentSuggestions = [];

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
  elevenlabs_voice: "URdpYjdnCOSIXKpzB6KE",
  hover_brightness: 1.2,
  use_os_keyboard: 0,
  auto_hide_k2_keyboard: 0
};

function syncSettingsModalUI() {
  const fontEdEl = document.getElementById("font-editor");
  if (fontEdEl) fontEdEl.value = settings.font_size_editor || 32;

  const fontKyEl = document.getElementById("font-keyboard");
  if (fontKyEl) fontKyEl.value = settings.font_size_keyboard || 24;

  const minWEl = document.getElementById("min-target-width");
  if (minWEl) minWEl.value = settings.min_target_width || 50;

  const minHEl = document.getElementById("min-target-height");
  if (minHEl) minHEl.value = settings.min_target_height || 40;

  const gapXEl = document.getElementById("button-gap-x");
  if (gapXEl) gapXEl.value = settings.button_gap_x || 4;

  const gapYEl = document.getElementById("button-gap-y");
  if (gapYEl) gapYEl.value = settings.button_gap_y || 4;

  const basinsEl = document.getElementById("basins-of-attraction-toggle");
  if (basinsEl) basinsEl.checked = settings.basins_of_attraction === 1;

  const useOSEl = document.getElementById("use-os-keyboard-toggle");
  if (useOSEl) useOSEl.checked = settings.use_os_keyboard === 1;

  const autoHideEl = document.getElementById("auto-hide-k2-keyboard-toggle");
  if (autoHideEl) autoHideEl.checked = settings.auto_hide_k2_keyboard === 1;

  const haUrlEl = document.getElementById("ha-url-input");
  if (haUrlEl) haUrlEl.value = settings.home_assistant_url || "";

  const haTokEl = document.getElementById("ha-token-input");
  if (haTokEl) haTokEl.value = settings.home_assistant_token || "";

  const bioEl = document.getElementById("biography-text");
  if (bioEl && settings.biography_text) bioEl.value = settings.biography_text;

  const hoverBEl = document.getElementById("hover-brightness");
  if (hoverBEl) hoverBEl.value = settings.hover_brightness || 1.2;

  const localVEl = document.getElementById("local-tts-voice-select");
  if (localVEl && settings.local_tts_voice) localVEl.value = settings.local_tts_voice;

  const elevenVEl = document.getElementById("elevenlabs-voice-select");
  if (elevenVEl && settings.elevenlabs_voice) elevenVEl.value = settings.elevenlabs_voice;

  updateSettingsVisibility();
}

// Macro state tracking
let loadedActionTag = null;

// Next-word prediction context cache
let lastApiPredictions = [];

// --- IndexedDB Setup ---
const DB_NAME = "k2_web_db";
const DB_VERSION = 2;

const APP_MANUAL = `K2 Assistive Web System Capabilities & Manual:
1. Gaze & Assistive Input: Supports gaze typing, dwell-click selection, predictive text completion, and action macros.
2. Eye-Tracking Settings:
   - font_size_editor (px): Editor font size.
   - font_size_keyboard (px): On-screen keyboard button font size.
   - min_target_width (px) & min_target_height (px): Target button sizing.
   - hover_brightness: Target brightness multiplier on hover.
3. System Operations (XML tags emitted by Cloud AI):
   - <operation type="profile" action="add|set|update|delete" key="..." content="..." [old_content="..."]/>
   - <operation type="contact" action="add|set|update|delete" key="..." content="..." [old_content="..."]/>
   - <operation type="setting" action="set" key="..." content="..."/>
   - <operation type="macro" action="add|set|update|delete" key="..." content="..." [old_content="..."]/>
   - <operation type="sms" recipient="..." message="..."/>
   - <operation type="email" recipient="..." subject="..." body="..."/>
   - <operation type="home_assistant" service="..." entity_id="..."/>
   - <operation type="speak" phrase="..."/>
   - <operation type="set_timer" seconds="..." label="..."/>
`;

function initDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = function (e) {
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
      if (!db.objectStoreNames.contains("contacts")) {
        db.createObjectStore("contacts", { keyPath: "name" });
      }
    };

    request.onsuccess = function (e) {
      db = e.target.result;
      seedDefaults().then(resolve);
    };

    request.onerror = function (e) {
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
    txn.oncomplete = () => {
      renderSingleChatMessage({ role, content });
      resolve();
    };
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

function getContacts() {
  return new Promise((resolve) => {
    if (!db || !db.objectStoreNames.contains("contacts")) return resolve([]);
    const txn = db.transaction("contacts", "readonly");
    const store = txn.objectStore("contacts");
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => resolve([]);
  });
}

function saveContact(name, value) {
  return new Promise((resolve) => {
    const txn = db.transaction("contacts", "readwrite");
    const store = txn.objectStore("contacts");
    store.put({ name, value, timestamp: Date.now() });
    txn.oncomplete = () => resolve();
  });
}

function deleteContact(name) {
  return new Promise((resolve) => {
    const txn = db.transaction("contacts", "readwrite");
    const store = txn.objectStore("contacts");
    store.delete(name);
    txn.oncomplete = () => resolve();
  });
}

function setContacts(contactsList) {
  return new Promise((resolve) => {
    const txn = db.transaction("contacts", "readwrite");
    const store = txn.objectStore("contacts");
    store.clear();
    for (const item of contactsList) {
      if (item.name) store.put(item);
    }
    txn.oncomplete = () => resolve();
  });
}

function getAllSettings() {
  return new Promise((resolve) => {
    const txn = db.transaction("settings", "readonly");
    const store = txn.objectStore("settings");
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => resolve([]);
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
      { category: "User Info", content: "Name: Kay. Patient diagnosed with ALS." },
      { category: "Relationships", content: "Husband: Pete. Family lives nearby and visits frequently." },
      { category: "Interests", content: "Plants, nature, trolls, mixology." }
    ]);

    await saveContact("Phil", "phone=555-0199; email=phil@example.com; relationship=Husband");
    await saveContact("Dr. Smith", "phone=555-4321; email=smith@clinic.org; relationship=Dentist");

    await saveAction("[laughing]", "[laughing] ");
    await saveAction("Pete", "Pete ");
    await saveAction("Phil", "Phil ");
    await saveAction("hello", "hello ");
    await saveAction("please", "please ");
    await saveAction("thank you", "thank you ");
    await saveAction("TTS okay?", "I'm going to speak to you through this device, if that's okay ");
    await saveAction("I would like", "I would like ");
    await saveAction("toggle the lights", "toggle the lights ");
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
    if (scrollInterval) {
      clearInterval(scrollInterval);
      scrollInterval = null;
    }
  });
}

function setupHorizontalDwellScrolling(containerOrId) {
  const container = typeof containerOrId === "string"
    ? (document.getElementById(containerOrId) || document.querySelector("." + containerOrId))
    : containerOrId;
  if (!container) return;

  let scrollInterval = null;
  let speed = 0;

  container.addEventListener("mousemove", (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const w = rect.width;
    const threshold = Math.max(50, w * 0.2); // 20% left/right dwell scroll zone

    if (x < threshold) {
      const ratio = (threshold - x) / threshold;
      speed = -ratio * 18;
      if (!scrollInterval) {
        scrollInterval = setInterval(() => {
          container.scrollLeft += speed;
        }, 16);
      }
    } else if (x > w - threshold) {
      const ratio = (x - (w - threshold)) / threshold;
      speed = ratio * 18;
      if (!scrollInterval) {
        scrollInterval = setInterval(() => {
          container.scrollLeft += speed;
        }, 16);
      }
    } else {
      if (scrollInterval) {
        clearInterval(scrollInterval);
        scrollInterval = null;
      }
    }
  });

  container.addEventListener("mouseleave", () => {
    if (scrollInterval) {
      clearInterval(scrollInterval);
      scrollInterval = null;
    }
  });

  // Mouse click & drag horizontal sliding
  let isDown = false;
  let startX;
  let scrollLeft;
  let hasDragged = false;

  container.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    isDown = true;
    hasDragged = false;
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener("mouseleave", () => {
    isDown = false;
  });

  container.addEventListener("mouseup", () => {
    isDown = false;
  });

  container.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX);
    if (Math.abs(walk) > 4) {
      hasDragged = true;
    }
    container.scrollLeft = scrollLeft - walk;
  });

  container.addEventListener("click", (e) => {
    if (hasDragged) {
      e.preventDefault();
      e.stopPropagation();
      hasDragged = false;
    }
  }, true);

  // Mouse wheel horizontal scrolling
  container.addEventListener("wheel", (e) => {
    if (e.deltaY !== 0 && !e.shiftKey) {
      e.preventDefault();
      container.scrollLeft += e.deltaY;
    }
  }, { passive: false });
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
  let elevenlabsVoice = await getSetting("elevenlabs_voice", "URdpYjdnCOSIXKpzB6KE");
  if (elevenlabsVoice === "ClZAMU8VhxAvE2PP3kqR") {
    elevenlabsVoice = "URdpYjdnCOSIXKpzB6KE";
    await setSetting("elevenlabs_voice", "URdpYjdnCOSIXKpzB6KE");
  }
  const hoverB = await getSetting("hover_brightness", "1.2");
  const buttonGapX = await getSetting("button_gap_x", "4");
  const buttonGapY = await getSetting("button_gap_y", "4");
  const useOS = await getSetting("use_os_keyboard", "0");
  const autoHide = await getSetting("auto_hide_k2_keyboard", "0");

  document.getElementById("editor-box").style.fontSize = `${fontEd}px`;
  document.getElementById("font-editor").value = fontEd;
  document.getElementById("font-keyboard").value = fontKy;
  document.getElementById("min-target-width").value = minW;
  document.getElementById("min-target-height").value = minH;
  const btnGapXEl = document.getElementById("button-gap-x");
  const btnGapYEl = document.getElementById("button-gap-y");
  if (btnGapXEl) btnGapXEl.value = buttonGapX;
  if (btnGapYEl) btnGapYEl.value = buttonGapY;
  document.getElementById("basins-of-attraction-toggle").checked = (basins === "1");
  document.getElementById("use-os-keyboard-toggle").checked = (useOS === "1");
  document.getElementById("auto-hide-k2-keyboard-toggle").checked = (autoHide === "1");
  document.getElementById("ha-url-input").value = haUrl;
  document.getElementById("ha-token-input").value = haToken;
  document.getElementById("biography-text").value = bio;
  originalBiographyText = bio;
  const hoverBEl = document.getElementById("hover-brightness");
  if (hoverBEl) {
    hoverBEl.value = hoverB;
  }

  // Cache globally
  settings.font_size_editor = parseInt(fontEd, 10) || 32;
  settings.font_size_keyboard = parseInt(fontKy, 10) || 24;
  settings.min_target_width = parseInt(minW, 10) || 50;
  settings.min_target_height = parseInt(minH, 10) || 40;
  settings.button_gap_x = parseInt(buttonGapX, 10) || 4;
  settings.button_gap_y = parseInt(buttonGapY, 10) || 4;
  settings.basins_of_attraction = basins === "1" ? 1 : 0;
  settings.use_os_keyboard = useOS === "1" ? 1 : 0;
  settings.auto_hide_k2_keyboard = autoHide === "1" ? 1 : 0;
  settings.home_assistant_url = haUrl;
  settings.home_assistant_token = haToken;
  settings.biography_text = bio;
  settings.local_tts_voice = localVoice;
  settings.elevenlabs_voice = elevenlabsVoice;
  settings.hover_brightness = parseFloat(hoverB) || 1.2;
  document.documentElement.style.setProperty("--hover-brightness", settings.hover_brightness);
  document.documentElement.style.setProperty("--min-target-height", `${settings.min_target_height}px`);
  document.documentElement.style.setProperty("--min-target-width", `${settings.min_target_width}px`);
  document.documentElement.style.setProperty("--button-gap-x", `${settings.button_gap_x}px`);
  document.documentElement.style.setProperty("--button-gap-y", `${settings.button_gap_y}px`);

  // Populate local TTS Voice dropdown
  populateVoiceDropdown();
  window.speechSynthesis.onvoiceschanged = populateVoiceDropdown;

  // Populate ElevenLabs Voice dropdown
  await populateElevenLabsDropdown();

  setupUIBindings();
  setupDwellScrolling("chat-log-scroll");
  setupDwellScrolling("actions-grid");
  setupHorizontalDwellScrolling("words-prediction-row");
  setupHorizontalDwellScrolling("phrases-prediction-row");
  setupHorizontalDwellScrolling("edit-toolbar");
  setupHorizontalDwellScrolling("actions-header-controls");

  renderSavedActions();
  renderChatLog(true);
  updatePredictionsAndKeyboard();

  // OS and Auto-Hide Keyboard UI Bindings
  const editorBox = document.getElementById("editor-box");
  const keyboardWrapper = document.querySelector(".keyboard-panel-wrapper");
  const appCont = document.querySelector(".app-container");
  const cLog = document.getElementById("chat-log-scroll");

  editorBox.addEventListener("focus", () => {
    if (settings.use_os_keyboard === 0 && settings.auto_hide_k2_keyboard === 1) {
      keyboardWrapper.classList.add("open");
      if (appCont) {
        appCont.classList.add("keyboard-open");
      }
      setTimeout(() => {
        if (cLog) {
          cLog.scrollTop = cLog.scrollHeight;
        }
      }, 100);
    }
  });

  editorBox.addEventListener("blur", () => {
    if (settings.use_os_keyboard === 0 && settings.auto_hide_k2_keyboard === 1) {
      setTimeout(() => {
        if (document.activeElement !== editorBox) {
          keyboardWrapper.classList.remove("open");
          if (appCont) {
            appCont.classList.remove("keyboard-open");
          }
        }
      }, 150);
    }
  });

  editorBox.addEventListener("input", adjustEditorBoxHeight);
  setTimeout(adjustEditorBoxHeight, 50);

  document.getElementById("use-os-keyboard-toggle").addEventListener("change", updateSettingsVisibility);

  // Accordion Panel Collapsing Bindings
  document.querySelectorAll(".panel-label").forEach(label => {
    label.addEventListener("click", () => {
      const panel = label.closest(".labeled-panel");
      if (panel) {
        panel.classList.toggle("collapsed");
      }
    });
  });

  // Dynamic Mathematical Toolbar Row Splitting Algorithm
  const layoutObserver = new ResizeObserver(() => updateToolbarLayouts());
  const editToolbarEl = document.querySelector(".edit-toolbar");
  const actionControlsEl = document.querySelector(".actions-header-controls");
  if (editToolbarEl) layoutObserver.observe(editToolbarEl);
  if (actionControlsEl) layoutObserver.observe(actionControlsEl);
  window.addEventListener("resize", () => {
    updateAppViewportHeight();
    updateToolbarLayouts();
  });
  window.addEventListener("orientationchange", () => {
    setTimeout(() => {
      updateAppViewportHeight();
      updateToolbarLayouts();
    }, 100);
  });
  updateAppViewportHeight();
  setTimeout(updateToolbarLayouts, 50);

  updateSettingsVisibility();
  applyKeyboardSettings();

  const editor = document.getElementById("editor-box");
  editor.focus();
  editor.setSelectionRange(0, 0);
  previousCaretPosition = 0;
});

function updateAppViewportHeight() {
  const vh = window.innerHeight;
  document.documentElement.style.setProperty('--app-height', `${vh}px`);
}

function adjustEditorBoxHeight() {
  const editor = document.getElementById("editor-box");
  if (!editor) return;

  const style = window.getComputedStyle(editor);
  const fontSize = parseFloat(style.fontSize) || 24;
  const lineHeightVal = parseFloat(style.lineHeight);
  const lineHeight = (!isNaN(lineHeightVal) && lineHeightVal > 0) ? lineHeightVal : (fontSize * 1.3);

  const paddingTop = parseFloat(style.paddingTop) || 6;
  const paddingBottom = parseFloat(style.paddingBottom) || 6;
  const borderTop = parseFloat(style.borderTopWidth) || 1;
  const borderBottom = parseFloat(style.borderBottomWidth) || 1;

  const paddingTotal = paddingTop + paddingBottom + borderTop + borderBottom;
  const minH = lineHeight + paddingTotal;
  const maxH = (lineHeight * 3) + paddingTotal;

  editor.style.height = "auto";
  const scrollH = editor.scrollHeight;
  const targetH = Math.min(Math.max(scrollH, minH), maxH);

  editor.style.height = `${targetH}px`;
  editor.style.overflowY = scrollH > (maxH + 2) ? "auto" : "hidden";
}

function updateToolbarLayouts() {
  const minW = settings.min_target_width || 50;

  // 1. Edit Toolbar
  const editToolbar = document.querySelector(".edit-toolbar");
  if (editToolbar) {
    const buttons = editToolbar.querySelectorAll(".btn");
    buttons.forEach(btn => {
      btn.style.flex = "0 0 auto";
      btn.style.maxWidth = "none";
      btn.style.minWidth = `${minW}px`;
      const full = btn.querySelector(".btn-text-full");
      const short = btn.querySelector(".btn-text-short");
      if (full && short) {
        full.style.display = "inline";
        short.style.display = "none";
      }
    });
  }

  // 2. Action Header Controls
  const actionControls = document.querySelector(".actions-header-controls");
  if (actionControls) {
    const items = actionControls.querySelectorAll(".mode-btn, .btn-settings-icon, .custom-dropdown");
    items.forEach(item => {
      item.style.flex = "0 0 auto";
      item.style.maxWidth = "none";
      item.style.minWidth = `${minW}px`;
      const full = item.querySelector(".btn-text-full");
      const short = item.querySelector(".btn-text-short");
      if (full && short) {
        full.style.display = "inline";
        short.style.display = "none";
      }
    });
  }
}

function updateSettingsVisibility() {
  const useOS = document.getElementById("use-os-keyboard-toggle").checked;
  const autoHideGroup = document.getElementById("auto-hide-k2-keyboard-group");
  if (autoHideGroup) {
    autoHideGroup.style.display = useOS ? "none" : "block";
  }
}

function applyKeyboardSettings() {
  const editor = document.getElementById("editor-box");
  const keyboardWrapper = document.querySelector(".keyboard-panel-wrapper");
  const appCont = document.querySelector(".app-container");
  if (!editor || !keyboardWrapper) return;

  if (settings.use_os_keyboard === 1) {
    editor.setAttribute("inputmode", "text");
    keyboardWrapper.style.display = "none";
    keyboardWrapper.classList.remove("auto-hide", "open");
    if (appCont) {
      appCont.classList.remove("keyboard-open");
    }
  } else {
    editor.setAttribute("inputmode", "none");
    keyboardWrapper.style.display = "";
    if (settings.auto_hide_k2_keyboard === 1) {
      keyboardWrapper.classList.add("auto-hide");
    } else {
      keyboardWrapper.classList.remove("auto-hide", "open");
      if (appCont) {
        appCont.classList.remove("keyboard-open");
      }
    }
  }
}

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

let elevenLabsVoicesList = []; // Cache list of ElevenLabs voices in memory
let activePreviewAudio = null; // Track current playing preview audio

async function populateElevenLabsDropdown() {
  const select = document.getElementById("elevenlabs-voice-select");
  if (!select) return;
  select.innerHTML = "";

  try {
    const res = await fetch("/api/elevenlabs-voices");
    if (res.ok) {
      elevenLabsVoicesList = await res.json();
    } else {
      console.error("Failed to load ElevenLabs voices");
    }
  } catch (err) {
    console.error("Error loading ElevenLabs voices:", err);
  }

  // Fallback default list if fetch fails or returns empty
  if (!elevenLabsVoicesList || elevenLabsVoicesList.length === 0) {
    elevenLabsVoicesList = [
      { voice_id: "URdpYjdnCOSIXKpzB6KE", name: "Kay's beautiful voice 1 (cloned)", preview_url: null },
      { voice_id: "ClZAMU8VhxAvE2PP3kqR", name: "Kay's beautiful voice (professional)", preview_url: null },
      { voice_id: "Xb7hH8MSUJpSbSDYk0k2", name: "Alice (premade)", preview_url: "https://media.elevenlabs.io/voices/Xb7hH8MSUJpSbSDYk0k2/previews/14f2e96d-35bd-4473-b3c1-b0e6e737c355.mp3" }
    ];
  }

  elevenLabsVoicesList.forEach(voice => {
    const option = document.createElement("option");
    option.value = voice.voice_id;
    option.textContent = `${voice.name} (${voice.voice_id})`;
    if (voice.voice_id === settings.elevenlabs_voice) {
      option.selected = true;
    }
    select.appendChild(option);
  });

  // Bind change event listener for audio preview
  select.addEventListener("change", async () => {
    const selectedVoiceId = select.value;
    const voice = elevenLabsVoicesList.find(v => v.voice_id === selectedVoiceId);
    if (!voice) return;

    // Stop current preview if playing
    if (activePreviewAudio) {
      activePreviewAudio.pause();
      activePreviewAudio = null;
    }

    // Always generate live TTS preview saying "Hello, this is [name]"
    try {
      const phrase = `Hello, this is ${voice.name}.`;
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: phrase,
          voice_id: selectedVoiceId
        })
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        activePreviewAudio = new Audio(url);
        activePreviewAudio.play().catch(err => console.warn("Failed to play generated preview audio:", err));
      } else {
        const errData = await res.json().catch(() => ({ detail: "Unknown error" }));
        const errMsg = errData.detail || "Server error";
        console.error("Failed to generate live preview audio:", errMsg);
        alert(`Could not play preview for ${voice.name}:\n${errMsg}`);
      }
    } catch (err) {
      console.error("Error generating live preview:", err);
    }
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
    "Purple": "#9b59b6", "Yellow": "#f1c40f", "Teal": "#1abc9c", "Pink": "#e84393", "Gray": "#475569"
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

  editor.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      executeSendCloud();
    }
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
      activeMode = btn.getAttribute("data-mode") || btn.querySelector(".btn-text-full")?.textContent.trim() || "Edit";
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
    document.body.appendChild(colorMenu);

    const positionMenu = () => {
      const rect = colorTrigger.getBoundingClientRect();
      colorMenu.style.position = "fixed";
      colorMenu.style.top = `${rect.bottom + 4}px`;
      colorMenu.style.left = `${rect.left}px`;
      colorMenu.style.width = `${Math.max(rect.width, 110)}px`;
    };

    colorTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const willShow = !colorMenu.classList.contains("show");
      if (willShow) {
        positionMenu();
        colorMenu.classList.add("show");
      } else {
        colorMenu.classList.remove("show");
      }
    });

    document.addEventListener("click", (e) => {
      if (!colorMenu.contains(e.target) && !colorTrigger.contains(e.target)) {
        colorMenu.classList.remove("show");
      }
    });

    window.addEventListener("resize", () => {
      if (colorMenu.classList.contains("show")) {
        positionMenu();
      }
    });

    const items = colorMenu.querySelectorAll(".custom-dropdown-item");
    items.forEach(item => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        const val = item.getAttribute("data-value");
        const select = document.getElementById("action-color-select");
        if (select) {
          select.value = val;
          select.dispatchEvent(new Event("change"));
        }
        colorMenu.classList.remove("show");
      });
    });
  }

  // Settings Modal controls
  document.getElementById("btn-settings").addEventListener("click", () => {
    syncSettingsModalUI();
    originalBiographyText = document.getElementById("biography-text").value;
    document.getElementById("settings-modal").style.display = "flex";
  });

  document.getElementById("btn-settings-close").addEventListener("click", async () => {
    const fontEd = document.getElementById("font-editor").value;
    const fontKy = document.getElementById("font-keyboard").value;
    const minW = document.getElementById("min-target-width").value;
    const minH = document.getElementById("min-target-height").value;
    const btnGapXVal = document.getElementById("button-gap-x")?.value || "4";
    const btnGapYVal = document.getElementById("button-gap-y")?.value || "4";
    const basins = document.getElementById("basins-of-attraction-toggle").checked ? "1" : "0";
    const useOS = document.getElementById("use-os-keyboard-toggle").checked ? "1" : "0";
    const autoHide = document.getElementById("auto-hide-k2-keyboard-toggle").checked ? "1" : "0";
    const haUrl = document.getElementById("ha-url-input").value;
    const haToken = document.getElementById("ha-token-input").value;
    const bioText = document.getElementById("biography-text").value;
    const localVoice = document.getElementById("local-tts-voice-select").value;
    const elevenlabsVoice = document.getElementById("elevenlabs-voice-select").value;
    const hoverBEl = document.getElementById("hover-brightness");
    const hoverBrightness = hoverBEl ? hoverBEl.value : "1.2";

    // Stop preview audio if playing
    if (activePreviewAudio) {
      activePreviewAudio.pause();
      activePreviewAudio = null;
    }

    await setSetting("font_size_editor", fontEd);
    await setSetting("font_size_keyboard", fontKy);
    await setSetting("min_target_width", minW);
    await setSetting("min_target_height", minH);
    await setSetting("button_gap_x", btnGapXVal);
    await setSetting("button_gap_y", btnGapYVal);
    await setSetting("basins_of_attraction", basins);
    await setSetting("use_os_keyboard", useOS);
    await setSetting("auto_hide_k2_keyboard", autoHide);
    await setSetting("home_assistant_url", haUrl);
    await setSetting("home_assistant_token", haToken);
    await setSetting("biography_text", bioText);
    await setSetting("local_tts_voice", localVoice);
    await setSetting("elevenlabs_voice", elevenlabsVoice);
    await setSetting("hover_brightness", hoverBrightness);

    // Check if biography text has changed since last save/load
    if (bioText !== originalBiographyText) {
      const timestamp = new Date().toISOString();
      await setSetting("biography_text_timestamp", timestamp);
      originalBiographyText = bioText;
    }

    // Update global settings cache
    settings.font_size_editor = parseInt(fontEd, 10) || 32;
    settings.font_size_keyboard = parseInt(fontKy, 10) || 24;
    settings.min_target_width = parseInt(minW, 10) || 50;
    settings.min_target_height = parseInt(minH, 10) || 40;
    settings.button_gap_x = parseInt(btnGapXVal, 10) || 4;
    settings.button_gap_y = parseInt(btnGapYVal, 10) || 4;
    settings.basins_of_attraction = basins === "1" ? 1 : 0;
    settings.use_os_keyboard = useOS === "1" ? 1 : 0;
    settings.auto_hide_k2_keyboard = autoHide === "1" ? 1 : 0;
    settings.home_assistant_url = haUrl;
    settings.home_assistant_token = haToken;
    settings.biography_text = bioText;
    settings.local_tts_voice = localVoice;
    settings.elevenlabs_voice = elevenlabsVoice;
    settings.hover_brightness = parseFloat(hoverBrightness) || 1.2;

    applyKeyboardSettings();

    document.documentElement.style.setProperty("--hover-brightness", settings.hover_brightness);
    document.documentElement.style.setProperty("--min-target-height", `${settings.min_target_height}px`);
    document.documentElement.style.setProperty("--min-target-width", `${settings.min_target_width}px`);
    document.documentElement.style.setProperty("--button-gap-x", `${settings.button_gap_x}px`);
    document.documentElement.style.setProperty("--button-gap-y", `${settings.button_gap_y}px`);
    document.getElementById("editor-box").style.fontSize = `${fontEd}px`;

    updatePredictionsAndKeyboard();
    updateToolbarLayouts();
    document.getElementById("settings-modal").style.display = "none";
  });


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

function attachPredictionButtonTouchHandler(btn, onTapAction) {
  let startX = 0;
  let startY = 0;
  let isDrag = false;
  let touchActive = false;

  btn.addEventListener("mousedown", (e) => {
    e.preventDefault(); // Prevent editor box blur on desktop
  });

  btn.addEventListener("touchstart", (e) => {
    if (e.touches && e.touches.length > 0) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDrag = false;
      touchActive = true;
    }
  }, { passive: true });

  btn.addEventListener("touchmove", (e) => {
    if (touchActive && e.touches && e.touches.length > 0) {
      const dx = Math.abs(e.touches[0].clientX - startX);
      const dy = Math.abs(e.touches[0].clientY - startY);
      if (dx > 6 || dy > 6) {
        isDrag = true; // User is swiping/dragging the row
      }
    }
  }, { passive: true });

  btn.addEventListener("touchend", (e) => {
    if (touchActive) {
      touchActive = false;
      if (!isDrag) {
        // Stationary tap! Trigger prediction insertion
        e.preventDefault();
        onTapAction();
      }
    }
  });

  btn.addEventListener("click", (e) => {
    if (!isDrag) {
      onTapAction();
    }
  });
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

    attachPredictionButtonTouchHandler(btn, () => {
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
    });

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

    attachPredictionButtonTouchHandler(btn, () => {
      const editor = document.getElementById("editor-box");

      // Replace whole text preceding caret with completion
      const completedTextBefore = textBefore + phrase + " ";
      editor.value = completedTextBefore + textAfter;
      editor.selectionStart = editor.selectionEnd = completedTextBefore.length;
      previousCaretPosition = editor.selectionStart;

      updatePredictionsAndKeyboard();
      editor.focus();
    });

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
      keyBtn.addEventListener("mousedown", (e) => e.preventDefault());
      keyBtn.addEventListener("touchstart", (e) => e.preventDefault());

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
      "Purple": "#9b59b6", "Yellow": "#f1c40f", "Teal": "#1abc9c", "Pink": "#e84393", "Gray": "#475569"
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
  if (!text.trim()) {
    await addChatMessage("system", "Please type or dictate a message before sending to @CloudAI.");
    renderChatLog();
    return;
  }

  addChatMessage("user", text);
  renderChatLog();
  editor.value = "";
  previousCaretPosition = 0;
  loadedActionTag = null; // Clear macro selection
  updatePredictionsAndKeyboard();

  // Show live "Thinking..." bubble in chat log
  const log = document.getElementById("chat-log-scroll");
  const thinkingDiv = document.createElement("div");
  thinkingDiv.className = "chat-message cloud_ai thinking";
  thinkingDiv.textContent = "Cloud AI is thinking... (Attempt 1 of 3)";
  log.appendChild(thinkingDiv);
  log.scrollTop = log.scrollHeight;

  const history = await getChatHistory();
  const summaryList = await getPersonalSummary();
  const profile_summary = summaryList.map(i => `${i.category}: ${i.content}`).join("\n");
  const contactsList = await getContacts();
  const contacts_summary = contactsList.map(c => `${c.name}: ${c.value}`).join("\n");

  const actionsList = await getSavedActions();
  let macrosLines = actionsList.map(a => `Saved Macro Button [${a.tag}]: "${a.action_text}"`);
  if (currentSuggestions && currentSuggestions.length > 0) {
    currentSuggestions.forEach(s => {
      macrosLines.push(`Temporary Suggested Action [${s.tag}]: "${s.action_text}"`);
    });
  }
  const macros_summary = macrosLines.join("\n");

  const settingsList = await getAllSettings();
  const settings_summary = settingsList.map(s => `${s.key}: ${s.value}`).join("\n");

  const app_manual = "K2 is an assistive web application designed for ALS communication. Features include: virtual QWERTY keyboard with character & word predictions, text-to-speech (@CloudTTS / @LocalTTS), custom macro buttons, Home Assistant integration, active timers/alarms/reminders, web sharing, SMS/email drafting, and personal profile/contacts memory management.";

  const haUrl = await getSetting("home_assistant_url", "");
  const haToken = await getSetting("home_assistant_token", "");

  const maxAttempts = 3;
  let lastErrorMsg = "Unknown network error";
  let responseData = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    if (attempt > 1) {
      thinkingDiv.textContent = `No response, trying again... (Attempt ${attempt} of ${maxAttempts})`;
      log.scrollTop = log.scrollHeight;
      await new Promise(r => setTimeout(r, 1500)); // 1.5s delay before retry
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout per attempt

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_message: text,
          history,
          profile_summary,
          contacts_summary,
          settings_summary,
          macros_summary,
          app_manual,
          home_assistant_url: haUrl,
          home_assistant_token: haToken
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        let errDetail = `HTTP ${res.status}`;
        try {
          const errData = await res.json();
          if (errData.detail) errDetail = errData.detail;
        } catch (_) { }
        throw new Error(errDetail);
      }

      const data = await res.json();
      if (data.reply) {
        responseData = data;
        success = true;
        break; // Successfully received HTTP 200 response payload!
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error("Empty response payload from server");
      }
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === "AbortError") {
        lastErrorMsg = "Request timed out (30s limit)";
      } else {
        lastErrorMsg = err.message || "Network error";
      }
      console.warn(`Cloud AI attempt ${attempt} failed:`, lastErrorMsg);
    }
  }

  if (thinkingDiv.parentNode) {
    thinkingDiv.remove();
  }

  if (success && responseData) {
    await addChatMessage("cloud_ai", responseData.reply);
    renderChatLog();
    renderSuggestions(responseData.suggestions);

    // Execute returned client-side actions safely outside retry loop
    if (responseData.client_actions && Array.isArray(responseData.client_actions)) {
      for (const action of responseData.client_actions) {
        try {
          await processClientAction(action);
        } catch (actErr) {
          console.error("Error executing client action:", actErr);
        }
      }
    }
  } else {
    addChatMessage("system", `⚠️ Cloud AI could not connect after ${maxAttempts} attempts: ${lastErrorMsg}. Please try sending again.`);
    renderChatLog();
  }
}

function renderSuggestions(suggestions) {
  currentSuggestions = suggestions || [];
  // Renders suggestions inline inside actions grid
  const grid = document.getElementById("actions-grid");

  // Clear any previously rendered suggestions to avoid accumulation
  const existingSuggestions = grid.querySelectorAll(".suggestion-card");
  existingSuggestions.forEach(el => el.remove());

  suggestions.forEach(sug => {
    const card = document.createElement("div");
    card.className = "action-card suggestion-card";
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

// --- Client Operational Action Handlers & Active Timers Widget ---
let activeTimers = [];

function playTimerChime() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523.25, 659.25, 784.00, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime + idx * 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.15 + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime + idx * 0.15);
      osc.stop(audioCtx.currentTime + idx * 0.15 + 0.45);
    });
  } catch (e) {
    console.warn("Web Audio chime failed:", e);
  }
}

function renderActiveTimers() {
  const container = document.getElementById("active-timers-container");
  if (!container) return;

  if (activeTimers.length === 0) {
    container.classList.remove("has-timers");
    container.innerHTML = "";
    return;
  }

  container.classList.add("has-timers");
  container.innerHTML = "";

  activeTimers.forEach(t => {
    const chip = document.createElement("div");
    chip.className = "timer-chip";

    const mins = Math.floor(t.remainingSeconds / 60);
    const secs = t.remainingSeconds % 60;
    const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    chip.innerHTML = `<span>⏱️ ${t.label}: <strong>${timeStr}</strong></span>`;

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "timer-cancel-btn";
    cancelBtn.textContent = "✖";
    cancelBtn.title = "Cancel Timer";
    cancelBtn.onclick = () => cancelTimer(t.id);

    chip.appendChild(cancelBtn);
    container.appendChild(chip);
  });
}

function cancelTimer(id) {
  const idx = activeTimers.findIndex(t => t.id === id);
  if (idx !== -1) {
    clearInterval(activeTimers[idx].intervalId);
    const label = activeTimers[idx].label;
    activeTimers.splice(idx, 1);
    renderActiveTimers();
    addChatMessage("system", `⏱️ Cancelled timer: "${label}"`);
    renderChatLog();
  }
}

function handleSetTimer(seconds, label = "Timer") {
  const sec = parseInt(seconds, 10) || 60;
  const id = Date.now() + Math.random().toString(36).substr(2, 4);

  const timerObj = {
    id,
    label,
    totalSeconds: sec,
    remainingSeconds: sec,
    intervalId: null
  };

  timerObj.intervalId = setInterval(async () => {
    timerObj.remainingSeconds--;
    if (timerObj.remainingSeconds <= 0) {
      clearInterval(timerObj.intervalId);
      activeTimers = activeTimers.filter(t => t.id !== id);
      renderActiveTimers();

      playTimerChime();
      const endMsg = `⏱️ Timer finished: "${label}"!`;
      await addChatMessage("system", endMsg);
      renderChatLog();
      speakCloudTTS(`Timer finished for ${label}`);
    } else {
      renderActiveTimers();
    }
  }, 1000);

  activeTimers.push(timerObj);
  renderActiveTimers();
  addChatMessage("system", `⏱️ Started timer for ${label} (${sec}s)`);
  renderChatLog();
}

function injectTextToEditor(text) {
  const editor = document.getElementById("editor-box");
  if (!editor) return;
  const start = editor.selectionStart || editor.value.length;
  const currentText = editor.value;
  editor.value = currentText.substring(0, start) + text + currentText.substring(start);
  editor.selectionStart = editor.selectionEnd = start + text.length;
  updatePredictionsAndKeyboard();
}

async function handleWebShare(title, text, url) {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      await addChatMessage("system", `🔗 Shared: "${title || text}"`);
      renderChatLog();
    } catch (e) {
      if (e.name !== 'AbortError') {
        console.warn("Web Share failed:", e);
      }
    }
  } else {
    const shareContent = [title, text, url].filter(Boolean).join("\n");
    try {
      await navigator.clipboard.writeText(shareContent);
      await addChatMessage("system", `🔗 Copied share text to clipboard:\n${shareContent}`);
      renderChatLog();
    } catch (err) {
      console.error(err);
    }
  }
}

function handleExportFile(filename, content) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "export.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  addChatMessage("system", `📁 Exported file: "${filename}"`);
  renderChatLog();
}

// --- Image Card Builder (shared by processClientAction and formatMarkdownContent) ---
// Properly URL-encodes QuickChart JSON and HTML-attribute-escapes the URL and caption.
function buildImageCard(rawUrl, cap) {
  let imgUrl = rawUrl || "";
  if (imgUrl.includes("quickchart.io/chart")) {
    imgUrl = imgUrl.replace("bkg=white", "b=white");
    if (!imgUrl.includes("b=white")) imgUrl += "&b=white";
    // URL-encode the JSON in the c= parameter so ", {, } etc. don't break HTML attribute parsing
    const cIdx = imgUrl.indexOf("&c=");
    if (cIdx >= 0) {
      const base = imgUrl.substring(0, cIdx + 3); // keep "…&c="
      const json = imgUrl.substring(cIdx + 3);
      imgUrl = base + encodeURIComponent(json);
    }
  }
  // Escape characters that would break the src="..." HTML attribute
  const safeUrl = imgUrl.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  const safeCap = (cap || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  const captionHtml = cap
    ? `<div style="font-size:13px;color:#1e293b;font-weight:700;text-align:center;margin-top:8px;">${cap.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>`
    : "";
  return `<div class="k2-image-card" style="margin-top:10px;margin-bottom:10px;background:#ffffff;padding:14px;border-radius:12px;display:inline-block;max-width:100%;box-shadow:0 4px 12px rgba(0,0,0,.25);text-align:center;">` +
    `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" title="Open image in new tab" style="display:block;cursor:pointer;text-decoration:none;">` +
      `<img src="${safeUrl}" alt="${safeCap}" onerror="handleImageLoadError(this,'${safeCap}')" style="max-width:100%;max-height:340px;border-radius:8px;display:block;margin:0 auto;"/>` +
    `</a>` +
    `${captionHtml}` +
    `<div style="margin-top:6px;text-align:center;"><a href="${safeUrl}" target="_blank" rel="noopener noreferrer" style="font-size:11px;color:#2563eb;text-decoration:underline;word-break:break-all;" title="${safeUrl}">Open Image URL ↗</a></div>` +
  `</div>`;
}

async function processClientAction(action) {
  if (!action) return;

  if (action.type === "speak") {
    speakCloudTTS(action.text);
  } else if (action.type === "copy") {
    const txt = action.text || "";
    injectTextToEditor(txt);
    try {
      await navigator.clipboard.writeText(txt);
      addChatMessage("system", `Injected text (copied to clipboard): "${txt}"`);
      renderChatLog();
    } catch (err) {
      console.error(err);
    }
  } else if (action.type === "status") {
    addChatMessage("system", action.detail);
    renderChatLog();
  } else if (action.type === "operation") {
    const op = action.op_type;
    const data = action.data || {};

    if (op === "speak") {
      const phrase = data.phrase || data.content || data.text || "";
      if (phrase) speakCloudTTS(phrase);
    } else if (op === "inject") {
      const txt = data.text || data.content || "";
      if (txt) {
        injectTextToEditor(txt);
        navigator.clipboard.writeText(txt).catch(() => { });
        addChatMessage("system", `Injected text: "${txt}"`);
        renderChatLog();
      }
    } else if (op === "share") {
      handleWebShare(data.title || "K2 Share", data.text || data.content || "", data.url || "");
    } else if (op === "email") {
      const recipient = data.recipient || "";
      const subject = data.subject || "";
      const body = data.body || data.content || "";
      const mailtoUrl = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoUrl, "_blank");
      addChatMessage("system", `📧 Opened email draft to ${recipient || "recipient"}`);
      renderChatLog();
    } else if (op === "sms") {
      const recipient = data.recipient || data.phone || "";
      const body = data.message || data.text || data.content || "";
      const smsUrl = `sms:${encodeURIComponent(recipient)}${body ? `?body=${encodeURIComponent(body)}` : ''}`;

      // Attempt native SMS protocol navigation
      try {
        window.location.href = smsUrl;
      } catch (e) {
        console.warn("SMS protocol launch failed:", e);
      }

      await addChatMessage("system", `📱 Prepared SMS text message to ${recipient || "contact"}: "${body}"`);
      renderChatLog();
    } else if (op === "export_file") {
      handleExportFile(data.filename || "export.txt", data.content || data.text || "");
    } else if (op === "show_image") {
      // Skip if the reply text already rendered an image card via formatMarkdownContent
      const chatLog = document.getElementById("chat-log-scroll");
      const lastChatMsg = chatLog && chatLog.lastElementChild;
      const alreadyRendered = lastChatMsg && lastChatMsg.querySelector(".k2-image-card");
      if (!alreadyRendered) {
        const imgUrl = data.url || "";
        const caption = data.caption || data.content || "";
        if (imgUrl) {
          // buildImageCard handles URL-encoding and HTML-attribute escaping
          const imgHtml = buildImageCard(imgUrl, caption);
          addChatMessage("cloud_ai", imgHtml);
          renderChatLog();
        }
      }
    } else if (op === "set_timer") {
      handleSetTimer(data.seconds || 300, data.label || "Timer");
    } else if (op === "set_alarm") {
      const time = data.time || "";
      const label = data.label || "Alarm";
      addChatMessage("system", `⏰ Alarm set for ${time} (${label})`);
      renderChatLog();
    } else if (op === "set_reminder") {
      const time = data.time || "";
      const label = data.label || "Reminder";
      addChatMessage("system", `🔔 Reminder set for ${time}: "${label}"`);
      renderChatLog();
    } else if (op === "profile" || op === "contact" || op === "setting" || op === "macro") {
      const act = (data.action || "add").toLowerCase();
      const key = data.key || data.category || data.name || data.tag || "";
      const content = data.content || data.value || data.text || "";
      const oldContent = data.old_content || data.target_content || data.old_value || "";

      if (!key) return;

      if (op === "profile") {
        const currentList = await getPersonalSummary();
        let existing = currentList.find(i => i.category.toLowerCase() === key.toLowerCase());

        if (act === "add") {
          if (!existing) {
            currentList.push({ category: key, content });
          } else {
            existing.content = existing.content ? `${existing.content}. ${content}` : content;
          }
        } else if (act === "set") {
          if (existing) {
            existing.content = content;
          } else {
            currentList.push({ category: key, content });
          }
        } else if (act === "delete") {
          if (!oldContent) {
            const idx = currentList.findIndex(i => i.category.toLowerCase() === key.toLowerCase());
            if (idx !== -1) currentList.splice(idx, 1);
          } else if (existing && existing.content) {
            existing.content = existing.content.replace(oldContent, "").replace(/\s{2,}/g, " ").trim();
          }
        } else if (act === "update") {
          if (existing && existing.content && oldContent) {
            existing.content = existing.content.replace(oldContent, content);
          }
        }
        await setPersonalSummary(currentList);
        await addChatMessage("system", `👤 Updated Profile [${key}]`);
        renderChatLog();

      } else if (op === "contact") {
        const currentContacts = await getContacts();
        let existing = currentContacts.find(c => c.name.toLowerCase() === key.toLowerCase());

        if (act === "add") {
          if (!existing) {
            await saveContact(key, content);
          } else {
            existing.value = existing.value ? `${existing.value}; ${content}` : content;
            await saveContact(existing.name, existing.value);
          }
        } else if (act === "set") {
          await saveContact(key, content);
        } else if (act === "delete") {
          if (!oldContent) {
            await deleteContact(key);
          } else if (existing && existing.value) {
            existing.value = existing.value.replace(oldContent, "").replace(/;\s*;/g, ";").trim();
            await saveContact(existing.name, existing.value);
          }
        } else if (act === "update") {
          if (existing && existing.value && oldContent) {
            existing.value = existing.value.replace(oldContent, content);
            await saveContact(existing.name, existing.value);
          }
        }
        await addChatMessage("system", `📇 Updated Contact [${key}]`);
        renderChatLog();

      } else if (op === "setting") {
        let normKey = key.toLowerCase().replace(/-/g, "_");
        if (normKey.includes("auto_hide") || normKey.includes("autohide")) {
          normKey = "auto_hide_k2_keyboard";
        } else if (normKey.includes("os_keyboard") || normKey.includes("oskeyboard")) {
          normKey = "use_os_keyboard";
        } else if (normKey.includes("basin") || normKey.includes("attraction")) {
          normKey = "basins_of_attraction";
        } else if (normKey.includes("editor_font") || normKey.includes("font_editor")) {
          normKey = "font_size_editor";
        } else if (normKey.includes("keyboard_font") || normKey.includes("font_keyboard")) {
          normKey = "font_size_keyboard";
        }

        let normVal = String(content).trim();
        if (["1", "true", "on", "enable", "enabled", "yes"].includes(normVal.toLowerCase())) {
          normVal = "1";
        } else if (["0", "false", "off", "disable", "disabled", "no"].includes(normVal.toLowerCase())) {
          normVal = "0";
        }

        await setSetting(normKey, normVal);

        // Update global settings cache object
        if (["font_size_editor", "font_size_keyboard", "min_target_width", "min_target_height", "button_gap_x", "button_gap_y", "basins_of_attraction", "use_os_keyboard", "auto_hide_k2_keyboard"].includes(normKey)) {
          settings[normKey] = parseInt(normVal, 10) || 0;
        } else if (normKey === "hover_brightness") {
          settings[normKey] = parseFloat(normVal) || 1.2;
        } else {
          settings[normKey] = normVal;
        }

        // Apply setting side-effects immediately
        if (normKey === "font_size_editor") {
          const editor = document.getElementById("editor-box");
          if (editor) editor.style.fontSize = `${settings.font_size_editor}px`;
        } else if (normKey === "auto_hide_k2_keyboard" || normKey === "use_os_keyboard") {
          applyKeyboardSettings();
        } else if (normKey === "hover_brightness") {
          document.documentElement.style.setProperty("--hover-brightness", settings.hover_brightness);
        } else if (normKey === "min_target_height") {
          document.documentElement.style.setProperty("--min-target-height", `${settings.min_target_height}px`);
        } else if (normKey === "min_target_width") {
          document.documentElement.style.setProperty("--min-target-width", `${settings.min_target_width}px`);
        }

        syncSettingsModalUI();

        await addChatMessage("system", `⚙️ Changed Setting: ${normKey} = "${normVal}"`);
        renderChatLog();

      } else if (op === "macro") {
        if (act === "add" || act === "set") {
          await saveAction(key, content);
          await addChatMessage("system", `⚡ Saved Macro Button [${key}]`);
        } else if (act === "delete") {
          await deleteAction(key);
          await addChatMessage("system", `⚡ Deleted Macro Button [${key}]`);
        }
        renderSavedActions();
        renderChatLog();
      }
    }
  }
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
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: text,
        voice_id: settings.elevenlabs_voice || "URdpYjdnCOSIXKpzB6KE"
      }),
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
async function executeCompileProfileFromString(text) {
  const compileBtn = document.getElementById("btn-compile");
  if (compileBtn) {
    compileBtn.disabled = true;
    compileBtn.textContent = "Compiling...";
  }

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
    } else {
      console.error("Compilation failed or returned invalid format.");
    }
  } catch (err) {
    console.error(err);
    alert("Biography compilation failed: " + err.message);
  } finally {
    if (compileBtn) {
      compileBtn.disabled = false;
      compileBtn.textContent = "Update profile from text file";
    }
  }
}

// --- Backup Export / Import Configuration Operations ---
async function exportConfiguration() {
  const storeNames = ["settings", "saved_actions", "personal_summary", "chat_history"];
  if (db.objectStoreNames.contains("contacts")) storeNames.push("contacts");

  const txn = db.transaction(storeNames, "readonly");
  const settingsReq = txn.objectStore("settings").getAll();
  const actionsReq = txn.objectStore("saved_actions").getAll();
  const summaryReq = txn.objectStore("personal_summary").getAll();
  const chatReq = txn.objectStore("chat_history").getAll();
  const contactsReq = db.objectStoreNames.contains("contacts") ? txn.objectStore("contacts").getAll() : null;

  txn.oncomplete = () => {
    const data = {
      settings: settingsReq.result,
      saved_actions: actionsReq.result,
      personal_summary: summaryReq.result,
      contacts: contactsReq ? contactsReq.result : [],
      chat_history: chatReq.result
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
      const storeNames = ["settings", "saved_actions", "personal_summary", "chat_history"];
      if (db.objectStoreNames.contains("contacts")) storeNames.push("contacts");

      const txn = db.transaction(storeNames, "readwrite");

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
      if (data.contacts && db.objectStoreNames.contains("contacts")) {
        const store = txn.objectStore("contacts");
        store.clear();
        data.contacts.forEach(item => store.put(item));
      }
      if (data.chat_history) {
        const store = txn.objectStore("chat_history");
        store.clear();
        data.chat_history.forEach(item => store.put(item));
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

async function handleImageLoadError(imgEl, altText) {
  if (!imgEl || imgEl.dataset.fallbackTried) return;
  imgEl.dataset.fallbackTried = "true";
  const query = (altText || "").replace(/^picture of\s+/i, "").replace(/^image of\s+/i, "").trim();
  if (!query) return;
  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query.replace(/\s+/g, "_"))}`);
    if (res.ok) {
      const data = await res.json();
      const wikiUrl = (data.originalimage && data.originalimage.source) || (data.thumbnail && data.thumbnail.source);
      if (wikiUrl) {
        imgEl.src = wikiUrl;
        const link = imgEl.closest("a");
        if (link) link.href = wikiUrl;
        return;
      }
    }
  } catch (e) { /* silent */ }
  const card = imgEl.closest(".k2-image-card") || imgEl.parentElement;
  if (card) card.innerHTML = `<div style="padding:12px; font-size:13px; color:#64748b; font-weight:600;">Picture unavailable for "${query}"</div>`;
}

function formatMarkdownContent(text) {
  if (!text) return "";

  // --- Step 0: Extract image tags into numbered placeholders BEFORE any escaping ---
  // This prevents HTML-escaping from corrupting the generated <img> / <div> HTML.
  const imgCards = [];

  let html = text;

  // <operation type="show_image" url="..." caption="..."/>  — double-quoted url (no " inside url)
  html = html.replace(/<operation\s+type=["']show_image["']\s+url="([^"]+)"(?:\s+caption="([^"]*)")?\s*\/?>/gi,
    (m, url, cap) => { const i = imgCards.length; imgCards.push(buildImageCard(url, cap || "")); return `\x00IMG${i}\x00`; });

  // <operation type="show_image" url='...' caption='...'/>  — single-quoted url (allows " inside)
  html = html.replace(/<operation\s+type=["']show_image["']\s+url='([^']+)'(?:\s+caption='([^']*)')?\s*\/?>/gi,
    (m, url, cap) => { const i = imgCards.length; imgCards.push(buildImageCard(url, cap || "")); return `\x00IMG${i}\x00`; });

  // Markdown images: ![alt](url)
  html = html.replace(/!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g,
    (m, alt, url) => { const i = imgCards.length; imgCards.push(buildImageCard(url, alt || "")); return `\x00IMG${i}\x00`; });

  // Legacy: extract raw <div style="margin-top:...><img src="...">...</div> blocks
  // stored by old processClientAction handler — prevent them from being HTML-escaped.
  html = html.replace(/<div[^>]*style="[^"]*margin-top:[^>]*>(?:(?!<\/div>).)*<img[^>]*>(?:(?!<\/div>).)*<\/div>(?:<\/div>)?/gs,
    (match) => { const i = imgCards.length; imgCards.push(match); return `\x00IMG${i}\x00`; });

  // --- Step 1: HTML-escape remaining text (safe against XSS) ---
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // --- Step 2: Restore image card placeholders ---
  imgCards.forEach((card, i) => { html = html.replace(`\x00IMG${i}\x00`, card); });

  // --- Step 3: Inline Markdown formatting ---
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  // Markdown links [text](url) — must come before bare URL conversion
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener" style="color:#60a5fa;text-decoration:underline;">$1</a>');

  // Bare URLs
  html = html.replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g,
    '$1<a href="$2" target="_blank" rel="noopener" style="color:#60a5fa;text-decoration:underline;">$2</a>');

  // Newlines → <br/>
  html = html.replace(/\n/g, "<br/>");

  return html;
}

function msgToHtml(msg) {
  const content = msg.content || "";
  let prefix = "System: ";
  if (msg.role === "user") prefix = "You: ";
  else if (msg.role === "cloud_ai") prefix = "Cloud AI: ";
  // Raw HTML messages (stored image cards etc.) — pass through directly
  if (content.startsWith("<div") || content.startsWith("<img") || content.startsWith("<span")) {
    return `<span style="font-weight:600;">${prefix}</span> ${content}`;
  }
  return `<span style="font-weight:600;">${prefix}</span> ` + formatMarkdownContent(content);
}

function renderSingleChatMessage(msg) {
  const log = document.getElementById("chat-log-scroll");
  if (!log) return;

  const div = document.createElement("div");
  div.className = `chat-message ${msg.role}`;
  div.innerHTML = msgToHtml(msg);

  const thinkingDiv = log.querySelector(".thinking");
  if (thinkingDiv) {
    log.insertBefore(div, thinkingDiv);
  } else {
    log.appendChild(div);
  }

  log.scrollTo({ top: log.scrollHeight, behavior: "smooth" });
}

async function renderChatLog(force = false) {
  const log = document.getElementById("chat-log-scroll");
  if (!log) return;

  if (force || log.children.length === 0) {
    log.innerHTML = "";
    const list = await getChatHistory();
    list.forEach(msg => {
      const div = document.createElement("div");
      div.className = `chat-message ${msg.role}`;
      div.innerHTML = msgToHtml(msg);
      log.appendChild(div);
    });
    log.scrollTop = log.scrollHeight;
  }
}

// --- Passive Memory Extraction & Turn Counter ---
let chatTurnCounter = 0;

async function triggerPassiveMemoryExtraction() {
  try {
    const history = await getChatHistory(10);
    const summaryList = await getPersonalSummary();
    const profile_summary = summaryList.map(i => `${i.category}: ${i.content}`).join("\n");
    const contactsList = await getContacts();
    const contacts_summary = contactsList.map(c => `${c.name}: ${c.value}`).join("\n");

    const res = await fetch("/api/extract-memory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history, profile_summary, contacts_summary })
    });

    const data = await res.json();
    if (data.client_actions && Array.isArray(data.client_actions) && data.client_actions.length > 0) {
      for (const act of data.client_actions) {
        await processClientAction(act);
      }
    }
  } catch (err) {
    console.warn("Passive extraction background call error:", err);
  }
}

// Attach event listeners for passive memory triggers
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    triggerPassiveMemoryExtraction();
  }
});

window.addEventListener("beforeunload", () => {
  triggerPassiveMemoryExtraction();
});

// --- Bulk Import & Settings Modal Event Handlers ---

function setupBulkImportHandlers() {
  const btnSyncMemory = document.getElementById("btn-sync-memory");
  if (btnSyncMemory) {
    btnSyncMemory.onclick = async () => {
      btnSyncMemory.disabled = true;
      btnSyncMemory.textContent = "Syncing Memory...";
      await triggerPassiveMemoryExtraction();
      btnSyncMemory.textContent = "🧠 Sync Memory Now";
      btnSyncMemory.disabled = false;
      addChatMessage("system", "🧠 Memory extraction sync complete!");
      renderChatLog();
    };
  }

  const btnCompile = document.getElementById("btn-compile");
  if (btnCompile) {
    btnCompile.onclick = () => {
      const bioEl = document.getElementById("biography-text");
      const text = bioEl ? bioEl.value.trim() : "";
      if (!text) {
        alert("Please enter or paste some text into the Personal Profile text box before compiling.");
        return;
      }
      pendingImportType = "profile";
      pendingImportText = text;
      pendingImportFile = null;
      showImportModeModal("Compile Profile from Text");
    };
  }

  const btnImportProfile = document.getElementById("btn-import-profile-file");
  const profileFileInput = document.getElementById("profile-file-input");
  if (btnImportProfile && profileFileInput) {
    btnImportProfile.onclick = () => {
      profileFileInput.value = "";
      profileFileInput.click();
    };

    profileFileInput.onchange = async (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        try {
          const content = await file.text();
          const bioEl = document.getElementById("biography-text");
          if (bioEl) bioEl.value = content;
          pendingImportType = "profile";
          pendingImportText = content;
          pendingImportFile = null;
          showImportModeModal("Compile Profile from Text");
        } catch (err) {
          alert("Failed to read selected profile file: " + err.message);
        }
      }
    };
  }

  const btnImportContacts = document.getElementById("btn-import-contacts-file");
  const contactsFileInput = document.getElementById("contacts-file-input");
  if (btnImportContacts && contactsFileInput) {
    btnImportContacts.onclick = () => {
      contactsFileInput.value = "";
      contactsFileInput.click();
    };

    contactsFileInput.onchange = (e) => {
      if (e.target.files && e.target.files[0]) {
        pendingImportType = "contacts";
        pendingImportFile = e.target.files[0];
        pendingImportText = null;
        showImportModeModal("Import Contacts File");
      }
    };
  }

  const btnModeReplace = document.getElementById("btn-mode-replace");
  const btnModeMerge = document.getElementById("btn-mode-merge");
  const btnModeCancel = document.getElementById("btn-mode-cancel");

  if (btnModeReplace) {
    btnModeReplace.onclick = () => executeBulkFileImport("replace");
  }
  if (btnModeMerge) {
    btnModeMerge.onclick = () => executeBulkFileImport("merge");
  }
  if (btnModeCancel) {
    btnModeCancel.onclick = closeImportModeModal;
  }
}

function showImportModeModal(title) {
  const modal = document.getElementById("import-mode-modal");
  const titleEl = document.getElementById("import-mode-title");
  if (titleEl) titleEl.textContent = title || "Import Data";
  if (modal) modal.style.display = "flex";
}

function closeImportModeModal() {
  const modal = document.getElementById("import-mode-modal");
  if (modal) modal.style.display = "none";
  pendingImportFile = null;
  pendingImportType = null;
  pendingImportText = null;
}

async function executeBulkFileImport(mode) {
  if ((!pendingImportFile && !pendingImportText) || !pendingImportType) return;
  const modal = document.getElementById("import-mode-modal");
  if (modal) modal.style.display = "none";

  const targetStore = pendingImportType;
  let fileContent = "";
  if (pendingImportText !== null) {
    fileContent = pendingImportText;
  } else if (pendingImportFile) {
    fileContent = await pendingImportFile.text();
  }

  pendingImportFile = null;
  pendingImportType = null;
  pendingImportText = null;

  if (!fileContent.trim()) {
    alert("No content available for import.");
    return;
  }

  const compileBtn = document.getElementById("btn-compile");
  if (compileBtn && targetStore === "profile") {
    compileBtn.disabled = true;
    compileBtn.textContent = "Compiling Profile...";
  }

  try {
    let existingContext = "";
    if (mode === "merge") {
      if (targetStore === "contacts") {
        const list = await getContacts();
        existingContext = list.map(c => `${c.name}: ${c.value}`).join("\n");
      } else {
        const list = await getPersonalSummary();
        existingContext = list.map(i => `${i.category}: ${i.content}`).join("\n");
      }
    }

    const res = await fetch("/api/parse-bulk-file", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        file_content: fileContent,
        target_store: targetStore,
        mode: mode,
        existing_context: existingContext
      })
    });

    const data = await res.json();
    const items = (data && Array.isArray(data.items)) ? data.items : (Array.isArray(data) ? data : null);

    if (items && Array.isArray(items)) {
      if (targetStore === "contacts") {
        if (mode === "replace") {
          await setContacts(items);
        } else {
          for (const item of items) {
            if (item.name) await saveContact(item.name, item.value || "");
          }
        }
        await addChatMessage("system", `📇 Imported ${items.length} contacts (${mode} mode)`);
        renderChatLog();
        alert(`📇 Successfully imported ${items.length} contacts (${mode} mode)!`);
      } else {
        // Persist profile biography text into settings
        await setSetting("biography_text", fileContent);
        settings.biography_text = fileContent;

        if (mode === "replace") {
          await setPersonalSummary(items);
        } else {
          const current = await getPersonalSummary();
          for (const item of items) {
            let existing = current.find(i => i.category.toLowerCase() === item.category.toLowerCase());
            if (!existing) {
              current.push(item);
            } else {
              existing.content = item.content;
            }
          }
          await setPersonalSummary(current);
        }
        await addChatMessage("system", `👤 Compiled ${items.length} profile categories from text (${mode} mode)`);
        renderChatLog();
        alert(`👤 Successfully compiled ${items.length} profile categories (${mode} mode)!`);
      }
    } else {
      const detail = data.detail || data.error || "Invalid payload format";
      alert("Bulk file import failed: " + detail);
    }
  } catch (err) {
    console.error(err);
    alert("Bulk file import failed: " + err.message);
  } finally {
    if (compileBtn) {
      compileBtn.disabled = false;
      compileBtn.textContent = "Compile Profile from Text";
    }
  }
}

// Initialize handlers on page load
window.addEventListener("DOMContentLoaded", () => {
  setupBulkImportHandlers();
});
