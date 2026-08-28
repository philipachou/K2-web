// --- Settings & Configuration ES Module ---

export const DEFAULT_SETTINGS = {
  font_size_editor: 32,
  font_size_keyboard: 24,
  min_target_width: 50,
  min_target_height: 40,
  button_gap_x: 4,
  button_gap_y: 4,
  basins_of_attraction: 0,
  home_assistant_url: "",
  home_assistant_token: "",
  biography_text: "",
  local_tts_voice: "",
  elevenlabs_voice: "URdpYjdnCOSIXKpzB6KE",
  hover_brightness: 1.2,
  use_os_keyboard: 0,
  auto_hide_k2_keyboard: 0,
  tag_separator: "|",
  grid_penalty_a: 1.0,
  grid_penalty_b: 1.0,
  grid_penalty_c: 1.0
};

/**
 * Synchronizes DOM form elements inside #settings-modal with the in-memory settings cache.
 */
export function syncSettingsModalUI(settings, updateVisibilityFn) {
  if (!settings) return;

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

  const penAEl = document.getElementById("grid-penalty-a");
  if (penAEl) penAEl.value = settings.grid_penalty_a ?? 1.0;

  const penBEl = document.getElementById("grid-penalty-b");
  if (penBEl) penBEl.value = settings.grid_penalty_b ?? 1.0;

  const penCEl = document.getElementById("grid-penalty-c");
  if (penCEl) penCEl.value = settings.grid_penalty_c ?? 1.0;

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

  const tagSepEl = document.getElementById("tag-separator-input");
  if (tagSepEl) tagSepEl.value = settings.tag_separator || "|";

  const localVEl = document.getElementById("local-tts-voice-select");
  if (localVEl && settings.local_tts_voice) localVEl.value = settings.local_tts_voice;

  const elevenVEl = document.getElementById("elevenlabs-voice-select");
  if (elevenVEl && settings.elevenlabs_voice) elevenVEl.value = settings.elevenlabs_voice;

  if (typeof updateVisibilityFn === "function") {
    updateVisibilityFn();
  }
}

/**
 * Updates conditionally visible sections in the settings modal (e.g. keyboard autohide).
 */
export function updateSettingsVisibility() {
  const useOS = document.getElementById("use-os-keyboard-toggle")?.checked;
  const autoHideGroup = document.getElementById("auto-hide-k2-keyboard-group");
  if (autoHideGroup) {
    autoHideGroup.style.display = useOS ? "none" : "block";
  }
}

/**
 * Robust RFC 4180 compliant CSV line tokenizer.
 */
export function parseCSVGeneric(text) {
  const rows = [];
  let currentRow = [];
  let currentField = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (i + 1 < text.length && text[i + 1] === '"') {
          currentField += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        currentField += c;
      }
    } else {
      if (c === '"' && currentField.length === 0) {
        inQuotes = true;
      } else if (c === ',') {
        currentRow.push(currentField);
        currentField = "";
      } else if (c === '\r') {
        if (i + 1 < text.length && text[i + 1] === '\n') continue;
        currentRow.push(currentField);
        if (currentRow.some(f => f.length > 0)) rows.push(currentRow);
        currentRow = [];
        currentField = "";
      } else if (c === '\n') {
        currentRow.push(currentField);
        if (currentRow.some(f => f.length > 0)) rows.push(currentRow);
        currentRow = [];
        currentField = "";
      } else {
        currentField += c;
      }
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some(f => f.length > 0)) rows.push(currentRow);
  }

  return rows;
}

/**
 * Parses contacts CSV with name/value pairs.
 */
export function parseContactsCSV(fileContent) {
  const rows = parseCSVGeneric(fileContent);
  if (!rows || rows.length === 0) return null;

  const header = rows[0].map(h => h.trim());
  const headerLower = header.map(h => h.toLowerCase());

  if (header.length === 2 && headerLower[0] === "name" && headerLower[1] === "value") {
    const contacts = [];
    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      if (!r || r.length === 0) continue;
      const name = r[0] ? r[0].trim() : "";
      const value = r[1] ? r[1].trim() : "";
      if (name) {
        contacts.push({ name, value });
      }
    }
    return contacts;
  }

  return null;
}

/**
 * Parses actions CSV with hierarchically partitioned tags and optional color codes.
 */
export function parseActionsCSV(text, sep = "|") {
  const rows = parseCSVGeneric(text);
  const actions = [];

  for (const row of rows) {
    if (!row || row.length === 0) continue;
    const actionText = row[0] !== undefined ? row[0] : "";
    let rest = row.slice(1).filter(s => s !== undefined && s.length > 0);

    let color = null;
    if (rest.length > 0) {
      const last = rest[rest.length - 1].trim();
      if (last.startsWith("#") || ["blue", "green", "red", "orange", "purple", "yellow", "teal", "pink", "gray"].includes(last.toLowerCase())) {
        color = last;
        rest = rest.slice(0, -1);
      }
    }

    const tag = rest.length > 0 ? rest.join(sep) : actionText;

    if (tag && actionText !== undefined) {
      actions.push({ tag, action_text: actionText, color });
    }
  }

  return actions;
}

/**
 * Exports complete IndexedDB application state to JSON backup file.
 */
export async function exportConfiguration(db) {
  if (!db) return;
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
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const dateStr = new Date().toISOString().split("T")[0];
    a.download = `k2_web_config_${dateStr}.json`;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 200);
  };
}

/**
 * Restores complete IndexedDB application state from JSON backup file.
 */
export async function importConfiguration(db, file) {
  if (!db || !file) return;
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
