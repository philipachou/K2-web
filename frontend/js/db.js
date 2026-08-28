// --- IndexedDB Operations Module ---
export const DB_NAME = "k2_web_db";
export const DB_VERSION = 2;

export let db = null;

export const APP_MANUAL = `K2 Assistive Web System Capabilities & Manual:
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

export function initDatabase() {
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
export function getSetting(key, defaultValue = "") {
  return new Promise((resolve) => {
    const txn = db.transaction("settings", "readonly");
    const store = txn.objectStore("settings");
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result ? req.result.value : defaultValue);
    req.onerror = () => resolve(defaultValue);
  });
}

export function setSetting(key, value) {
  return new Promise((resolve) => {
    const txn = db.transaction("settings", "readwrite");
    const store = txn.objectStore("settings");
    store.put({ key, value });
    txn.oncomplete = () => resolve();
  });
}

export function getSavedActions() {
  return new Promise((resolve) => {
    const txn = db.transaction("saved_actions", "readonly");
    const store = txn.objectStore("saved_actions");
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
  });
}

export function saveAction(tag, action_text, color = null) {
  return new Promise((resolve) => {
    const txn = db.transaction("saved_actions", "readwrite");
    const store = txn.objectStore("saved_actions");
    store.put({ tag, action_text, color, timestamp: Date.now() });
    txn.oncomplete = () => resolve();
  });
}

export function deleteAction(tag) {
  return new Promise((resolve) => {
    const txn = db.transaction("saved_actions", "readwrite");
    const store = txn.objectStore("saved_actions");
    store.delete(tag);
    txn.oncomplete = () => resolve();
  });
}

export function getChatHistory(limit = 10) {
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

export function addChatMessage(role, content, suggestions = null) {
  return new Promise((resolve) => {
    const txn = db.transaction("chat_history", "readwrite");
    const store = txn.objectStore("chat_history");
    const item = { role, content, suggestions, timestamp: new Date().toISOString() };
    store.add(item);
    txn.oncomplete = () => {
      if (typeof window.renderSingleChatMessage === "function") {
        window.renderSingleChatMessage(item);
      }
      resolve();
    };
  });
}

export function getPersonalSummary() {
  return new Promise((resolve) => {
    const txn = db.transaction("personal_summary", "readonly");
    const store = txn.objectStore("personal_summary");
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
  });
}

export function setPersonalSummary(categories) {
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

export function getContacts() {
  return new Promise((resolve) => {
    if (!db || !db.objectStoreNames.contains("contacts")) return resolve([]);
    const txn = db.transaction("contacts", "readonly");
    const store = txn.objectStore("contacts");
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => resolve([]);
  });
}

export function saveContact(name, value) {
  return new Promise((resolve) => {
    const txn = db.transaction("contacts", "readwrite");
    const store = txn.objectStore("contacts");
    store.put({ name, value, timestamp: Date.now() });
    txn.oncomplete = () => resolve();
  });
}

export function deleteContact(name) {
  return new Promise((resolve) => {
    const txn = db.transaction("contacts", "readwrite");
    const store = txn.objectStore("contacts");
    store.delete(name);
    txn.oncomplete = () => resolve();
  });
}

export function setContacts(contactsList) {
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

export function getAllSettings() {
  return new Promise((resolve) => {
    const txn = db.transaction("settings", "readonly");
    const store = txn.objectStore("settings");
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => resolve([]);
  });
}

export async function seedDefaults() {
  const seeded = await getSetting("font_size_editor");
  if (!seeded) {
    await setSetting("font_size_editor", "32");
    await setSetting("font_size_keyboard", "24");
    await setSetting("min_target_width", "50");
    await setSetting("min_target_height", "40");
    await setSetting("basins_of_attraction", "0");
    await setSetting("hover_brightness", "1.2");
    await setSetting("tag_separator", "|");
    await setSetting("biography_text", "Name: Kay. Patient diagnosed with ALS.\nHusband: Pete. Family lives nearby and visits frequently.\nInterests: Plants, nature, trolls, mixology.");

    await setPersonalSummary([
      { category: "User Info", content: "Name: Kay. Patient diagnosed with ALS." },
      { category: "Relationships", content: "Husband: Pete. Family lives nearby and visits frequently." },
      { category: "Interests", content: "Plants, nature, trolls, mixology." }
    ]);

    await saveContact("Pete", "phone=555-0199; email=pete@example.com; relationship=Husband");
    await saveContact("Dr. Smith", "phone=555-4321; email=smith@clinic.org; relationship=Dentist");
  }

  const seededActionsV2 = await getSetting("seeded_actions_v2");
  if (!seededActionsV2) {
    await setSetting("seeded_actions_v2", "true");

    const defaultActions = [
      { tag: "Greetings|hello", text: "hello " },
      { tag: "Greetings|please", text: "please " },
      { tag: "Greetings|thank you", text: "thank you " },
      { tag: "Names|Pete", text: "Pete " },
      { tag: "Names|Phil", text: "Phil " },
      { tag: "Names|Emma", text: "Emma " },
      { tag: "Names|Griffin", text: "Griffin " },
      { tag: "Names|Niko", text: "Niko " },
      { tag: "Names|Nopo", text: "Nopo " },
      { tag: "Misc|I would like", text: "I would like " },
      { tag: "Misc|TTS okay?", text: "I'm going to speak to you through this device, if that's okay " },
      { tag: "Smart home|lights|bedroom", text: "toggle the bedroom lights " },
      { tag: "Smart home|lights|living room", text: "toggle the living room lights " },
      { tag: "Smart home|thermostat|temperature", text: "check the temperature " },
      { tag: "please", text: "please " },
      { tag: "thank you", text: "thank you " },
      { tag: "TTS Effects|[applause]", text: "[applause] " },
      { tag: "TTS Effects|[clears throat]", text: "[clears throat] " },
      { tag: "TTS Effects|[coughs]", text: "[coughs] " },
      { tag: "TTS Effects|[drawn out]", text: "[drawn out] " },
      { tag: "TTS Effects|[excited]", text: "[excited] " },
      { tag: "TTS Effects|[explosion]", text: "[explosion] " },
      { tag: "TTS Effects|[gasps]", text: "[gasps] " },
      { tag: "TTS Effects|[gulps]", text: "[gulps] " },
      { tag: "TTS Effects|[gunshot]", text: "[gunshot] " },
      { tag: "TTS Effects|[happy]", text: "[happy] " },
      { tag: "TTS Effects|[laughs harder]", text: "[laughs harder] " },
      { tag: "TTS Effects|[laughs]", text: "[laughs] " },
      { tag: "TTS Effects|[long pause]", text: "[long pause] " },
      { tag: "TTS Effects|[mischievously]", text: "[mischievously] " },
      { tag: "TTS Effects|[pause]", text: "[pause] " },
      { tag: "TTS Effects|[rushed]", text: "[rushed] " },
      { tag: "TTS Effects|[sad]", text: "[sad] " },
      { tag: "TTS Effects|[sarcastic]", text: "[sarcastic] " },
      { tag: "TTS Effects|[short pause]", text: "[short pause] " },
      { tag: "TTS Effects|[shouts]", text: "[shouts] " },
      { tag: "TTS Effects|[sighs]", text: "[sighs] " },
      { tag: "TTS Effects|[sings]", text: "[sings] " },
      { tag: "TTS Effects|[sniffs]", text: "[sniffs] " },
      { tag: "TTS Effects|[strong French accent]", text: "[strong French accent] " },
      { tag: "TTS Effects|[tired]", text: "[tired] " },
      { tag: "TTS Effects|[upset]", text: "[upset] " },
      { tag: "TTS Effects|[whispers]", text: "[whispers] " },
      { tag: "TTS Effects|[worried]", text: "[worried] " }
    ];

    for (const act of defaultActions) {
      await saveAction(act.tag, act.text);
    }
  }
}
