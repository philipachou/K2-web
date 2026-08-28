// --- Editor & Text Operations ES Module ---

let previousCaretPosition = 0;
let loadedActionTag = null;

export function getPreviousCaretPosition() {
  return previousCaretPosition;
}

export function setPreviousCaretPosition(pos) {
  previousCaretPosition = typeof pos === "number" ? pos : 0;
}

export function getLoadedActionTag() {
  return loadedActionTag;
}

export function setLoadedActionTag(tag) {
  loadedActionTag = tag || null;
}

/**
 * Returns the currently active editable input/textarea element, falling back to #editor-box.
 */
export function getActiveInputTarget() {
  const active = document.activeElement;
  if (active && active !== document.body && (active.tagName === "INPUT" || active.tagName === "TEXTAREA") && !active.readOnly && !active.disabled) {
    return active;
  }
  return document.getElementById("editor-box");
}

/**
 * Dynamically adjusts editor textarea height based on content lines (clamped to 1-3 lines).
 */
export function adjustEditorBoxHeight() {
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

/**
 * Inserts text at the current cursor position of active input or #editor-box.
 * @param {string} text - Text to insert
 * @param {Function} onTextChange - Callback invoked when text changes: () => void
 */
export function insertTextAtCursor(text, onTextChange) {
  const target = getActiveInputTarget();
  if (!target) return;

  const start = target.selectionStart ?? target.value.length;
  const end = target.selectionEnd ?? target.value.length;
  const currentText = target.value || "";

  target.value = currentText.substring(0, start) + text + currentText.substring(end);
  const newPos = start + text.length;
  try {
    target.selectionStart = target.selectionEnd = newPos;
  } catch (_) { }

  if (target.id === "editor-box") {
    previousCaretPosition = target.selectionStart;
    if (typeof onTextChange === "function") {
      onTextChange();
    }
  }
}

/**
 * Deletes the character preceding the cursor.
 * @param {Function} onTextChange - Callback invoked when text changes: () => void
 */
export function deleteChar(onTextChange) {
  const target = getActiveInputTarget();
  if (!target) return;

  const currentText = target.value || "";
  let start = target.selectionStart;
  let end = target.selectionEnd;

  if (document.activeElement !== target) {
    if (previousCaretPosition > 0 && previousCaretPosition <= currentText.length) {
      start = end = previousCaretPosition;
    } else {
      start = end = currentText.length;
    }
  } else if (start === null || start === undefined) {
    start = end = currentText.length;
  }

  if (start !== end) {
    target.value = currentText.substring(0, start) + currentText.substring(end);
    try { target.selectionStart = target.selectionEnd = start; } catch (_) { }
  } else if (start > 0) {
    target.value = currentText.substring(0, start - 1) + currentText.substring(start);
    try { target.selectionStart = target.selectionEnd = start - 1; } catch (_) { }
  }

  if (target.id === "editor-box") {
    previousCaretPosition = target.selectionStart ?? target.value.length;
    if (typeof onTextChange === "function") {
      onTextChange();
    }
  }
}

/**
 * Deletes the character following the cursor (Forward Delete).
 * @param {Function} onTextChange - Callback invoked when text changes: () => void
 */
export function deleteNextChar(onTextChange) {
  const target = getActiveInputTarget();
  if (!target) return;

  const currentText = target.value || "";
  let start = target.selectionStart;
  let end = target.selectionEnd;

  if (document.activeElement !== target) {
    if (previousCaretPosition >= 0 && previousCaretPosition <= currentText.length) {
      start = end = previousCaretPosition;
    } else {
      start = end = 0;
    }
  } else if (start === null || start === undefined) {
    start = end = 0;
  }

  if (start !== end) {
    target.value = currentText.substring(0, start) + currentText.substring(end);
    try { target.selectionStart = target.selectionEnd = start; } catch (_) { }
  } else if (start < currentText.length) {
    target.value = currentText.substring(0, start) + currentText.substring(start + 1);
    try { target.selectionStart = target.selectionEnd = start; } catch (_) { }
  }

  if (target.id === "editor-box") {
    previousCaretPosition = target.selectionStart ?? 0;
    if (typeof onTextChange === "function") {
      onTextChange();
    }
  }
}

/**
 * Deletes the word preceding the cursor.
 * @param {Function} onTextChange - Callback invoked when text changes: () => void
 */
export function deleteWord(onTextChange) {
  const editor = document.getElementById("editor-box");
  if (!editor) return;

  const currentText = editor.value;
  let start = editor.selectionStart;
  if (document.activeElement !== editor) {
    if (previousCaretPosition > 0 && previousCaretPosition <= currentText.length) {
      start = previousCaretPosition;
    } else {
      start = currentText.length;
    }
  } else if (start === null || start === undefined) {
    start = currentText.length;
  }

  const textBefore = currentText.substring(0, start);
  const words = textBefore.trimEnd().split(" ");
  words.pop();
  const rest = words.join(" ") + (words.length ? " " : "");

  editor.value = rest + currentText.substring(start);
  try { editor.selectionStart = editor.selectionEnd = rest.length; } catch (_) { }
  previousCaretPosition = editor.selectionStart;

  if (typeof onTextChange === "function") {
    onTextChange();
  }
}
