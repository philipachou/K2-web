import { initDatabase, getSetting, setSetting, getAllSettings, getSavedActions, saveAction, deleteAction, getChatHistory, addChatMessage, getPersonalSummary, setPersonalSummary, getContacts, saveContact, deleteContact, setContacts, seedDefaults, APP_MANUAL, db } from './js/db.js';
import { DICTIONARY_TEXT, DICTIONARY, DEFAULT_FREQS, BIGRAM_MATRIX, lastApiPredictions, setLastApiPredictions, clearLastApiPredictions, getNextCharProbabilities, getBlendedCharProbabilities, normalizeProbabilities, executeFetchWords, executeFetchPhrases, attachPredictionButtonTouchHandler, renderWordPredictions, renderPhrasePredictions } from './js/predictions.js';
import { KEYBOARD_LAYOUT, isShiftActive, setShiftActive, toggleShift, renderKeyboard } from './js/keyboard.js';
import { getCurrentNavPath, setCurrentNavPath, resetNavPath, getCurrentSeparator, getCurrentPrefix, escapeHtml, setupHoverPreview, evaluateLabelLines, chooseGridColumns, renderActionsNavBar, renderActionsGrid, showCategoryDeleteModal, showCategoryRecolorModal, migrateTagSeparators } from './js/actions.js';


// --- Global State ---
let activeMode = "Edit"; // Edit, Delete, @CloudTTS, @LocalTTS, Copy, @CloudAI, Recolor
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
  auto_hide_k2_keyboard: 0,
  tag_separator: "|",
  grid_penalty_a: 1.0,
  grid_penalty_b: 1.0,
  grid_penalty_c: 1.0
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

  updateSettingsVisibility();
}

// Macro state tracking
let loadedActionTag = null;



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
async function initApp() {
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
  const tagSep = await getSetting("tag_separator", "|");
  const penA = await getSetting("grid_penalty_a", "1.0");
  const penB = await getSetting("grid_penalty_b", "1.0");
  const penC = await getSetting("grid_penalty_c", "1.0");

  document.getElementById("editor-box").style.fontSize = `${fontEd}px`;
  document.getElementById("font-editor").value = fontEd;
  document.getElementById("font-keyboard").value = fontKy;
  document.getElementById("min-target-width").value = minW;
  document.getElementById("min-target-height").value = minH;
  const btnGapXEl = document.getElementById("button-gap-x");
  const btnGapYEl = document.getElementById("button-gap-y");
  if (btnGapXEl) btnGapXEl.value = buttonGapX;
  if (btnGapYEl) btnGapYEl.value = buttonGapY;
  const penAEl = document.getElementById("grid-penalty-a");
  const penBEl = document.getElementById("grid-penalty-b");
  const penCEl = document.getElementById("grid-penalty-c");
  if (penAEl) penAEl.value = penA;
  if (penBEl) penBEl.value = penB;
  if (penCEl) penCEl.value = penC;

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
  const tagSepEl = document.getElementById("tag-separator-input");
  if (tagSepEl) {
    tagSepEl.value = tagSep || "|";
  }

  // Cache globally
  settings.font_size_editor = parseInt(fontEd, 10) || 32;
  settings.font_size_keyboard = parseInt(fontKy, 10) || 24;
  settings.min_target_width = parseInt(minW, 10) || 50;
  settings.min_target_height = parseInt(minH, 10) || 40;
  settings.button_gap_x = parseInt(buttonGapX, 10) || 4;
  settings.button_gap_y = parseInt(buttonGapY, 10) || 4;
  settings.grid_penalty_a = parseFloat(penA) ?? 1.0;
  settings.grid_penalty_b = parseFloat(penB) ?? 1.0;
  settings.grid_penalty_c = parseFloat(penC) ?? 1.0;
  settings.basins_of_attraction = basins === "1" ? 1 : 0;
  settings.use_os_keyboard = useOS === "1" ? 1 : 0;
  settings.auto_hide_k2_keyboard = autoHide === "1" ? 1 : 0;
  settings.home_assistant_url = haUrl;
  settings.home_assistant_token = haToken;
  settings.biography_text = bio;
  settings.local_tts_voice = localVoice;
  settings.elevenlabs_voice = elevenlabsVoice;
  settings.hover_brightness = parseFloat(hoverB) || 1.2;
  settings.tag_separator = tagSep || "|";
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
  setupHorizontalDwellScrolling("actions-nav-bar");

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

  editorBox.addEventListener("input", () => scheduleRecalculateLayoutHeights(100));
  // Note: initial sizing is handled by scheduleRecalculateLayoutHeights(100) below

  document.getElementById("use-os-keyboard-toggle").addEventListener("change", updateSettingsVisibility);

  // Accordion Panel Collapsing Bindings (with collapse constraint)
  document.querySelectorAll(".panel-label").forEach(label => {
    label.addEventListener("click", (e) => {
      if (_isLabelDragging) {
        e.preventDefault();
        e.stopPropagation();
        _isLabelDragging = false;
        return;
      }

      const panel = label.closest(".labeled-panel");
      if (!panel) return;

      const isCollapsing = !panel.classList.contains("collapsed");

      if (isCollapsing) {
        // Determine panel key for {C, A, E} tracking
        let key = null;
        if (panel.classList.contains('chat-panel')) key = 'chat';
        else if (panel.classList.contains('actions-panel')) key = 'actions';
        else if (panel.classList.contains('editor-panel')) key = 'editor';

        // Enforce: at least one of {C, A, E} must stay open
        const chatPanel = document.querySelector('.chat-panel');
        const actionsPanel = document.querySelector('.actions-panel');
        const editorPanel = document.querySelector('.editor-panel');
        const c_active = !chatPanel.classList.contains('collapsed');
        const a_active = !actionsPanel.classList.contains('collapsed');
        const e_active = !editorPanel.classList.contains('collapsed');

        const wouldAllCollapse = (
          (key === 'chat' && !a_active && !e_active) ||
          (key === 'actions' && !c_active && !e_active) ||
          (key === 'editor' && !c_active && !a_active)
        );

        if (wouldAllCollapse) {
          // Reopen the earliest closed panel in history
          const earliest = closedPanelHistory.find(k => k !== key);
          if (earliest) {
            const reopenEl = document.querySelector(
              earliest === 'chat' ? '.chat-panel' :
                earliest === 'actions' ? '.actions-panel' : '.editor-panel'
            );
            if (reopenEl) {
              reopenEl.classList.remove('collapsed');
              const idx = closedPanelHistory.indexOf(earliest);
              if (idx !== -1) closedPanelHistory.splice(idx, 1);
            }
          }
        }

        panel.classList.add("collapsed");
        if (key) {
          const idx = closedPanelHistory.indexOf(key);
          if (idx !== -1) closedPanelHistory.splice(idx, 1);
          closedPanelHistory.push(key);
        }
      } else {
        panel.classList.remove("collapsed");
        let key = null;
        if (panel.classList.contains('chat-panel')) key = 'chat';
        else if (panel.classList.contains('actions-panel')) key = 'actions';
        else if (panel.classList.contains('editor-panel')) key = 'editor';
        if (key) {
          const idx = closedPanelHistory.indexOf(key);
          if (idx !== -1) closedPanelHistory.splice(idx, 1);
        }
      }

      scheduleRecalculateLayoutHeights(50);
    });
  });

  // Dynamic Mathematical Toolbar Row Splitting & Grid Algorithm
  const layoutObserver = new ResizeObserver(() => updateToolbarLayouts());
  const editToolbarEl = document.querySelector(".edit-toolbar");
  const actionControlsEl = document.querySelector(".actions-header-controls");
  const actionsGridEl = document.getElementById("actions-grid");
  if (editToolbarEl) layoutObserver.observe(editToolbarEl);
  if (actionControlsEl) layoutObserver.observe(actionControlsEl);
  if (actionsGridEl) layoutObserver.observe(actionsGridEl);

  // iOS-aware event bindings for layout recalculation
  // Subscribe to BOTH resize events (iOS fires inconsistently)
  window.visualViewport?.addEventListener('resize', () => {
    scheduleRecalculateLayoutHeights(50);
    updateToolbarLayouts();
  });
  window.visualViewport?.addEventListener('scroll', () => {
    scheduleRecalculateLayoutHeights(50);
  });
  window.addEventListener('resize', () => {
    scheduleRecalculateLayoutHeights(50);
    updateToolbarLayouts();
  });
  // Orientation change: 200ms delay to let iOS settle
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      scheduleRecalculateLayoutHeights(0);
      updateToolbarLayouts();
    }, 200);
  });

  // iOS & OS keyboard proxy: focusin/focusout on editor with layout recalculation
  const editorBoxEl = document.getElementById('editor-box');
  if (editorBoxEl) {
    editorBoxEl.addEventListener('focusin', () => scheduleRecalculateLayoutHeights(100));
    editorBoxEl.addEventListener('focusout', () => scheduleRecalculateLayoutHeights(100));
  }

  // Initialize drag-to-slide listener
  initDragSlideListeners();

  // Initial layout calculation — wait for paint so getBoundingClientRect() is accurate
  requestAnimationFrame(() => scheduleRecalculateLayoutHeights(150));
  setTimeout(updateToolbarLayouts, 50);
  if (document.fonts) {
    document.fonts.ready.then(() => {
      updateToolbarLayouts();
      scheduleRecalculateLayoutHeights(0);
    });
  }

  updateSettingsVisibility();
  applyKeyboardSettings();

  const editor = document.getElementById("editor-box");
  editor.focus();
  editor.setSelectionRange(0, 0);
  previousCaretPosition = 0;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

function updateAppViewportHeight() {
  const vv = window.visualViewport;
  const vh = vv ? vv.height : window.innerHeight;
  document.documentElement.style.setProperty('--app-height', `${vh}px`);
}

// ─────────────────────────────────────────────────────────────────────────────
// Panel Layout Engine: Rationalized Vertical Height Allocation
// ─────────────────────────────────────────────────────────────────────────────

/** Track which of {C, A, E} the user collapsed, in order */
const closedPanelHistory = []; // entries: 'chat' | 'actions' | 'editor'

/** Minimum collapsed panel label bar height (px) */
const LABEL_BAR_H_DESKTOP = 40;
const LABEL_BAR_H_MOBILE = 40;

/** Debounce timer handle */
let _recalcTimer = null;

/** Debounced entry point — safe to call many times rapidly */
function scheduleRecalculateLayoutHeights(delay = 50) {
  clearTimeout(_recalcTimer);
  _recalcTimer = setTimeout(recalculateLayoutHeights, delay);
}

/** Measure the pixel height of one line of text in the chat log */
function getChatLineHeight() {
  const chatLog = document.getElementById('chat-log-scroll');
  if (!chatLog) return 32;
  const st = window.getComputedStyle(chatLog);
  const lh = parseFloat(st.lineHeight);
  const fs = parseFloat(st.fontSize) || 16;
  return (isNaN(lh) || lh <= 0) ? fs * 1.4 : lh;
}

/** Count current lines of text visible in the chat log (clamped 1–3) */
function countChatLines() {
  const chatLog = document.getElementById('chat-log-scroll');
  if (!chatLog || !chatLog.children.length) return 1;
  const lineH = getChatLineHeight();
  const contentH = chatLog.scrollHeight;
  return Math.max(1, Math.min(3, Math.round(contentH / lineH)));
}

/** Measure the pixel height of one row of action buttons in the grid */
function getActionRowHeight() {
  const grid = document.getElementById('actions-grid');
  if (!grid || !grid.children.length) return (settings.min_target_height || 40) + 4;
  const st = window.getComputedStyle(grid);
  const gap = parseFloat(st.rowGap) || 4;
  const firstBtn = grid.firstElementChild;
  return firstBtn ? (firstBtn.getBoundingClientRect().height + gap) : (settings.min_target_height || 40) + gap;
}

/** Count current rows of buttons in the action grid (clamped 1–3) */
function countActionRows() {
  const grid = document.getElementById('actions-grid');
  if (!grid || !grid.children.length) return 1;
  const rowH = getActionRowHeight();
  return Math.max(1, Math.min(3, Math.round(grid.scrollHeight / rowH)));
}

/** Measure pixel height of one line of editor text */
function getEditorLineHeight() {
  const editor = document.getElementById('editor-box');
  if (!editor) return (settings.font_size_editor || 32) * 1.3;
  const st = window.getComputedStyle(editor);
  const lh = parseFloat(st.lineHeight);
  const fs = parseFloat(st.fontSize) || (settings.font_size_editor || 32);
  return (isNaN(lh) || lh <= 0) ? fs * 1.3 : lh;
}

/** Count current lines of text in the editor box (clamped 1–3) */
function countEditorLines() {
  const editor = document.getElementById('editor-box');
  if (!editor) return 1;
  const val = editor.value;
  if (!val || val.trim() === "") return 1;

  const lineH = getEditorLineHeight();
  const paddingTop = parseFloat(window.getComputedStyle(editor).paddingTop) || 6;
  const paddingBot = parseFloat(window.getComputedStyle(editor).paddingBottom) || 6;

  // Temporarily reset height inline to measure accurate scrollHeight synchronously without layout glitch
  const prevH = editor.style.height;
  const prevMinH = editor.style.minHeight;
  editor.style.height = 'auto';
  editor.style.minHeight = '0px';
  const contentH = editor.scrollHeight - paddingTop - paddingBot;
  editor.style.height = prevH;
  editor.style.minHeight = prevMinH;

  if (contentH <= 1.35 * lineH) return 1;
  if (contentH <= 2.35 * lineH) return 2;
  return 3;
}

/** Apply explicit pixel height to a DOM element (overrides flex sizing) */
function applyPanelHeight(el, px) {
  if (!el) return;
  el.style.height = `${Math.round(px)}px`;
  el.style.minHeight = `${Math.round(px)}px`;
  el.style.maxHeight = `${Math.round(px)}px`;
  el.style.flex = '0 0 auto';
}

/** Update label orientation for chat-panel and actions-panel in wide mode */
function updateWideModeLabels(c_active, a_active, is_wide) {
  const chatPanel = document.querySelector('.chat-panel');
  const actionsPanel = document.querySelector('.actions-panel');
  if (!chatPanel || !actionsPanel) return;

  if (is_wide && !c_active && !a_active) {
    // Both collapsed in wide mode: force horizontal labels
    chatPanel.classList.add('force-horizontal-label');
    actionsPanel.classList.add('force-horizontal-label');
  } else {
    // At least one active: remove override (CSS handles vertical label via .top-row override)
    chatPanel.classList.remove('force-horizontal-label');
    actionsPanel.classList.remove('force-horizontal-label');
  }
}

/** Enable or disable vertical drag-sliding of the app container */
let _dragSlideEnabled = false;
let _dragStartY = 0;
let _containerTranslateY = 0;
let _appHeight = 0;
let _viewportHeight = 0;

function setUiSlidingState(enabled, appH, viewH) {
  const appCont = document.querySelector('.app-container');
  if (!appCont) return;

  _dragSlideEnabled = enabled;
  _appHeight = appH;
  _viewportHeight = viewH;

  if (!enabled) {
    appCont.style.transform = '';
    _containerTranslateY = 0;
  }
  // cursor style on labels
  document.querySelectorAll('.panel-label').forEach(lbl => {
    lbl.style.cursor = enabled ? 'grab' : 'pointer';
  });
}

let _isLabelDragging = false;
let _dragStartPos = { x: 0, y: 0 };

function initDragSlideListeners() {
  document.querySelectorAll('.panel-label').forEach(lbl => {
    lbl.addEventListener('pointerdown', (e) => {
      _dragStartPos = { x: e.clientX, y: e.clientY };
      _isLabelDragging = false;
      onDragStart(e);
    });
  });
  window.addEventListener('pointermove', (e) => {
    if (_dragSlideEnabled && e.buttons) {
      const dx = Math.abs(e.clientX - _dragStartPos.x);
      const dy = Math.abs(e.clientY - _dragStartPos.y);
      if (dx > 5 || dy > 5) {
        _isLabelDragging = true;
      }
      onDragMove(e);
    }
  });
  window.addEventListener('pointerup', onDragEnd);
}

function onDragStart(e) {
  if (!_dragSlideEnabled) return;
  _dragStartY = e.clientY - _containerTranslateY;
}

function onDragMove(e) {
  if (!_dragSlideEnabled || !e.buttons) return;
  // Drag sliding handled by native upper-workspace scrolling
}

function onDragEnd() {
  // nothing extra needed — position stays
}

/** ─── MAIN LAYOUT ENGINE ─────────────────────────────────────────────── */
function recalculateLayoutHeights() {
  // ── Gather DOM elements ──────────────────────────────────────────────
  const chatPanel = document.querySelector('.chat-panel');
  const actionsPanel = document.querySelector('.actions-panel');
  const editorPanel = document.querySelector('.editor-panel');
  const predictorPanel = document.querySelector('.predictions-panel');
  const keyboardPanel = document.querySelector('.keyboard-panel-wrapper');
  const topRowEl = document.querySelector('.top-row');
  const upperWorkspace = document.querySelector('.upper-workspace');
  const appCont = document.querySelector('.app-container');

  if (!chatPanel || !actionsPanel || !editorPanel || !topRowEl || !appCont) return;

  // ── Viewport & mode ──────────────────────────────────────────────────
  const vv = window.visualViewport;
  const viewport_H = vv ? vv.height : window.innerHeight;
  const is_wide = window.innerWidth >= 769;
  // Account for app-container top/bottom padding
  const appStyle = window.getComputedStyle(appCont);
  const appPadV = parseFloat(appStyle.paddingTop) + parseFloat(appStyle.paddingBottom);
  const available_H = viewport_H - appPadV; // actual content area

  // ── Panel active states ──────────────────────────────────────────────
  const c_active = !chatPanel.classList.contains('collapsed');
  const a_active = !actionsPanel.classList.contains('collapsed');
  const e_active = !editorPanel.classList.contains('collapsed');
  const p_active = predictorPanel && !predictorPanel.classList.contains('collapsed');
  const k_active = keyboardPanel && !keyboardPanel.classList.contains('collapsed');

  // ── Keyboard mode ────────────────────────────────────────────────────
  const use_os_keyboard = settings.use_os_keyboard === 1;
  const auto_hide_k2 = settings.auto_hide_k2_keyboard === 1;
  const LABEL_BAR_H = settings.min_target_height || 40;

  // ── Step 1: Fixed component heights (XF) ─────────────────────────────
  const CF = c_active ? 0 : LABEL_BAR_H;

  const modeBar = actionsPanel.querySelector('.panel-header');
  const breadcrumbBar = actionsPanel.querySelector('.actions-nav-bar');
  const previewBar = actionsPanel.querySelector('.actions-preview-bar');
  const AF_content = a_active ? (
    (modeBar ? modeBar.getBoundingClientRect().height : 0) +
    (breadcrumbBar ? breadcrumbBar.getBoundingClientRect().height : 0) +
    (previewBar ? previewBar.getBoundingClientRect().height : 0) + 2 /* border */
  ) : LABEL_BAR_H;
  const AF = AF_content;

  // Editor Toolbar & Text Box required height
  const editToolbar = editorPanel.querySelector('.edit-toolbar');
  const toolbarH = e_active ? (
    editToolbar && editToolbar.scrollHeight > 0
      ? Math.max(editToolbar.scrollHeight, settings.min_target_height || 40)
      : (settings.min_target_height || 40)
  ) : 0;
  const EF = e_active ? (toolbarH + 18) : LABEL_BAR_H;

  // ── Step 2: Editor variable height (EV_min & EV) ──────────────────────
  const editLH = getEditorLineHeight();
  const edPadT = parseFloat(window.getComputedStyle(document.getElementById('editor-box')).paddingTop) || 6;
  const edPadB = parseFloat(window.getComputedStyle(document.getElementById('editor-box')).paddingBottom) || 6;
  const edBord = 4;
  const numLines = countEditorLines();
  const EV_min = e_active ? Math.round(numLines * editLH + edPadT + edPadB + edBord) : 0;
  const H_editor_min = e_active ? (EF + EV_min + 2) : LABEL_BAR_H;

  // Predictor Panel required height
  const PF = predictorPanel ? (
    p_active ? (2 * (settings.min_target_height || 40) + 14) : LABEL_BAR_H
  ) : 0;

  // Keyboard Panel required height
  let KF;
  if (use_os_keyboard) {
    KF = 0; // OS keyboard: panel hidden entirely
  } else if (auto_hide_k2) {
    KF = k_active ? 0 : LABEL_BAR_H; // popup K2: 0 when open (overlays), label when inactive
  } else {
    // Docked K2: full height when active, label when collapsed
    KF = k_active ? (5 * (settings.min_target_height || 40) + 4 * (settings.button_gap_y || 4) + 8) : LABEL_BAR_H;
  }

  // Dividers: count them and their total height
  const dividers = Array.from(document.querySelectorAll('.panel-divider.horizontal-divider'));
  const divider_H = dividers.reduce((sum, d) => sum + (d.getBoundingClientRect().height + parseFloat(getComputedStyle(d).marginTop) + parseFloat(getComputedStyle(d).marginBottom)), 0);

  // Minimum heights for Chat Log and Actions Panel
  const chatLH = getChatLineHeight();
  const CV_min = c_active ? Math.round(Math.max(1, Math.min(3, countChatLines())) * chatLH + 24) : 0;

  const actRowH = getActionRowHeight();
  const AV_min = a_active ? Math.round(Math.max(1, Math.min(3, countActionRows())) * actRowH + 8) : 0;

  const topRowDividerH = (!is_wide) ? 12 : 0;

  let H_topmin;
  if (is_wide) {
    H_topmin = Math.max(c_active ? (CF + CV_min) : LABEL_BAR_H, a_active ? (AF + AV_min) : LABEL_BAR_H);
  } else {
    H_topmin = (c_active ? (CF + CV_min) : LABEL_BAR_H) + (a_active ? (AF + AV_min) : LABEL_BAR_H) + topRowDividerH;
  }

  // ── Step 3: Minimum app height & H_excess ────────────────────────────
  const H_app_min = H_topmin + H_editor_min + PF + KF + divider_H;
  const H_excess = available_H - H_app_min;

  // ── Step 4: Allocate heights ─────────────────────────────────────────
  let EV = EV_min;
  let H_editor = H_editor_min;

  if (H_excess > 0 && !c_active && !a_active && e_active) {
    // Rule 2: Chat Log & Actions closed, Editor open -> Give ALL excess space to Editor text box EV!
    EV = EV_min + H_excess;
    H_editor = EF + EV + 2;
  }

  // ── Step 5: Apply heights ─────────────────────────────────────────────
  if (is_wide) {
    if (!c_active && !a_active) {
      topRowEl.style.flexDirection = 'column';
      topRowEl.style.flex = '0 0 auto';
      const topRowH = 2 * LABEL_BAR_H + 4;
      applyPanelHeight(topRowEl, topRowH);
      applyPanelHeight(chatPanel, LABEL_BAR_H);
      applyPanelHeight(actionsPanel, LABEL_BAR_H);
    } else {
      topRowEl.style.flexDirection = 'row';
      topRowEl.style.flex = '0 0 auto';
      const topRowH = H_excess > 0 ? (H_topmin + H_excess) : H_topmin;
      applyPanelHeight(topRowEl, topRowH);

      if (c_active) {
        chatPanel.style.height = '100%';
        chatPanel.style.minHeight = '0px';
        chatPanel.style.maxHeight = '100%';
        chatPanel.style.minWidth = '0px';
        chatPanel.style.maxWidth = '50%';
        chatPanel.style.flex = '1 1 0px';
        const chatBody = chatPanel.querySelector('.chat-log');
        if (chatBody) {
          chatBody.style.height = `${Math.round(topRowH - CF)}px`;
          chatBody.style.flex = '1 1 0px';
          chatBody.style.overflowY = H_excess <= 0 ? 'hidden' : 'auto';
        }
      } else {
        applyPanelHeight(chatPanel, LABEL_BAR_H);
      }

      if (a_active) {
        actionsPanel.style.height = '100%';
        actionsPanel.style.minHeight = '0px';
        actionsPanel.style.maxHeight = '100%';
        actionsPanel.style.minWidth = '0px';
        actionsPanel.style.maxWidth = '50%';
        actionsPanel.style.flex = '1 1 0px';
        const actionsList = actionsPanel.querySelector('.actions-list');
        if (actionsList) {
          actionsList.style.height = `${Math.round(topRowH - AF)}px`;
          actionsList.style.flex = '1 1 0px';
          actionsList.style.overflowY = H_excess <= 0 ? 'hidden' : 'auto';
        }
      } else {
        applyPanelHeight(actionsPanel, LABEL_BAR_H);
      }
    }
  } else {
    topRowEl.style.flexDirection = 'column';
    topRowEl.style.flex = '0 0 auto';

    const n_top = (c_active ? 1 : 0) + (a_active ? 1 : 0);
    let CV = 0;
    let AV = 0;

    if (n_top > 0) {
      if (H_excess > 0) {
        const share = H_excess / n_top;
        CV = c_active ? (CV_min + share) : 0;
        AV = a_active ? (AV_min + share) : 0;
      } else if (H_excess < 0) {
        const reduction = Math.abs(H_excess) / n_top;
        CV = c_active ? Math.max(16, CV_min - reduction) : 0;
        AV = a_active ? Math.max(16, AV_min - reduction) : 0;
      } else {
        CV = c_active ? CV_min : 0;
        AV = a_active ? AV_min : 0;
      }
    }

    const topRowDividerH = 12; // 4px divider + 4px top margin + 4px bottom margin in narrow stacked mode
    const topRowH = (c_active ? (CF + CV) : LABEL_BAR_H) + (a_active ? (AF + AV) : LABEL_BAR_H) + topRowDividerH;
    applyPanelHeight(topRowEl, topRowH);

    if (c_active) {
      applyPanelHeight(chatPanel, CF + CV);
      const chatBody = chatPanel.querySelector('.chat-log');
      if (chatBody) {
        chatBody.style.height = `${Math.round(CV)}px`;
        chatBody.style.flex = '1 1 0px';
        chatBody.style.overflowY = H_excess <= 0 ? 'hidden' : 'auto';
      }
    } else {
      applyPanelHeight(chatPanel, LABEL_BAR_H);
    }

    if (a_active) {
      applyPanelHeight(actionsPanel, AF + AV);
      const actionsList = actionsPanel.querySelector('.actions-list');
      if (actionsList) {
        actionsList.style.height = `${Math.round(AV)}px`;
        actionsList.style.flex = '1 1 0px';
        actionsList.style.overflowY = H_excess <= 0 ? 'hidden' : 'auto';
      }
    } else {
      applyPanelHeight(actionsPanel, LABEL_BAR_H);
    }
  }

  if (e_active) {
    applyPanelHeight(editorPanel, H_editor);
    const editorBox = document.getElementById('editor-box');
    if (editorBox) {
      editorBox.style.height = `${EV}px`;
      editorBox.style.minHeight = `${EV}px`;
      editorBox.style.maxHeight = `${EV}px`;
      editorBox.style.flex = '0 0 auto';
      editorBox.style.overflowY = 'auto';
    }
  } else {
    applyPanelHeight(editorPanel, LABEL_BAR_H);
    const editorBox = document.getElementById('editor-box');
    if (editorBox) {
      editorBox.style.height = '';
      editorBox.style.minHeight = '';
      editorBox.style.maxHeight = '';
      editorBox.style.flex = '';
    }
  }

  if (predictorPanel) {
    if (p_active) {
      applyPanelHeight(predictorPanel, PF);
    } else {
      applyPanelHeight(predictorPanel, LABEL_BAR_H);
    }
  }

  if (keyboardPanel && !use_os_keyboard) {
    if (!k_active) {
      applyPanelHeight(keyboardPanel, LABEL_BAR_H);
    } else if (!auto_hide_k2) {
      keyboardPanel.style.height = '';
      keyboardPanel.style.minHeight = '';
      keyboardPanel.style.maxHeight = '';
      keyboardPanel.style.flex = '0 0 auto';
    }
    // popup K2 when open: panel is overlay — don't size it in layout
  }

  // ── Wide-mode label orientation ───────────────────────────────────────
  updateWideModeLabels(c_active, a_active, is_wide);

  // ── Drag-slide & upper-workspace scroll state ─────────────────────────
  if (upperWorkspace) {
    const isOverflowing = H_excess < 0 || upperWorkspace.scrollHeight > upperWorkspace.clientHeight;
    upperWorkspace.style.overflowY = isOverflowing ? 'auto' : 'hidden';

    if (!isOverflowing || use_os_keyboard) {
      upperWorkspace.scrollTop = 0;
    }

    const chatBody = chatPanel.querySelector('.chat-log');
    const actionsList = actionsPanel.querySelector('.actions-list');
    if (chatBody) chatBody.style.overscrollBehavior = isOverflowing ? 'auto' : 'contain';
    if (actionsList) actionsList.style.overscrollBehavior = isOverflowing ? 'auto' : 'contain';
  }
  if (appCont) {
    appCont.style.transform = '';
  }

  // ── Update the --app-height CSS variable & reposition app container ──
  // When the OS virtual keyboard opens, visualViewport shrinks and offsetTop
  // shifts. We pin the fixed app-container to the visual viewport so it
  // always sits exactly above the keyboard on iOS, Android, and Windows touch.
  document.documentElement.style.setProperty('--app-height', `${viewport_H}px`);
  if (appCont) {
    const vvOffsetTop = (window.visualViewport ? window.visualViewport.offsetTop : 0);
    appCont.style.top = `${Math.round(vvOffsetTop)}px`;
    appCont.style.height = `${Math.round(viewport_H)}px`;
    appCont.style.minHeight = `${Math.round(viewport_H)}px`;
    appCont.style.maxHeight = `${Math.round(viewport_H)}px`;
  }
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
  const processToolbar = (containerSelector, itemSelector) => {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    const items = container.querySelectorAll(itemSelector);
    if (!items.length) return;

    const steps = [
      { short: false, fontSize: "0.8rem" },
      { short: false, fontSize: "0.65rem" },
      { short: true, fontSize: "0.8rem" },
      { short: true, fontSize: "0.65rem" }
    ];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      items.forEach(item => {
        item.style.fontSize = step.fontSize;
        const trigger = item.querySelector(".custom-dropdown-trigger");
        if (trigger) trigger.style.fontSize = step.fontSize;

        const full = item.querySelector(".btn-text-full");
        const short = item.querySelector(".btn-text-short");
        if (full && short) {
          full.style.display = step.short ? "none" : "inline";
          short.style.display = step.short ? "inline" : "none";
        }
      });

      if (container.scrollWidth <= container.clientWidth + 1) {
        break; // Fits cleanly without overflowing
      }
    }
  };

  processToolbar(".edit-toolbar", ".btn");
  processToolbar(".actions-header-controls", ".mode-btn, .btn-settings-icon, .custom-dropdown");
  chooseGridColumns(settings);
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
  scheduleRecalculateLayoutHeights(0);
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
  if (!dropdown || !trigger) return;

  const chosenColorName = dropdown.value;
  const colorMap = {
    "Blue": "#1f538d", "Green": "#2ecc71", "Red": "#e74c3c", "Orange": "#e67e22",
    "Purple": "#9b59b6", "Yellow": "#f1c40f", "Teal": "#1abc9c", "Pink": "#e84393", "Gray": "#475569"
  };
  const hex = colorMap[chosenColorName] || "#1f538d";

  trigger.textContent = chosenColorName;
  trigger.style.backgroundColor = hex;
  trigger.style.color = ["Yellow", "Teal", "Green"].includes(chosenColorName) ? "black" : "white";
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
    } else if (isShiftActive()) {
      // Shift-selection extension rule
      const start = Math.min(previousCaretPosition, editor.selectionStart);
      const end = Math.max(previousCaretPosition, editor.selectionStart);
      editor.setSelectionRange(start, end);
      setShiftActive(false);
      renderAppKeyboard(getBlendedCharProbabilities(editor.value));
    }
    previousCaretPosition = editor.selectionStart;
    updatePredictionsAndKeyboard();
  });

  editor.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      executeSendCloud(true);
    }
  });

  // Global window key intercept for physical keyboards
  window.addEventListener("keydown", (e) => {
    const activeEl = document.activeElement;
    if (activeEl && activeEl !== editor && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) {
      return; // Skip intercepting inside any non-editor input fields (modals, dialogs, etc.)
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
        const char = isShiftActive() ? key.toUpperCase() : key.toLowerCase();
        insertTextAtCursor(char);
        if (isShiftActive()) {
          setShiftActive(false);
        }
      }
    } else {
      if (key.length === 1 && isShiftActive()) {
        e.preventDefault();
        insertTextAtCursor(key.toUpperCase());
        setShiftActive(false);
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

  document.getElementById("btn-cloud").addEventListener("click", () => executeSendCloud(false));

  function promptForTag(title, defaultPrefix) {
    return new Promise((resolve) => {
      const modal = document.getElementById("tag-prompt-modal");
      const titleEl = document.getElementById("tag-prompt-title");
      const inputEl = document.getElementById("tag-prompt-input");
      const btnSave = document.getElementById("btn-tag-prompt-save");
      const btnCancel = document.getElementById("btn-tag-prompt-cancel");

      if (!modal || !inputEl || !btnSave || !btnCancel) {
        const res = prompt(title, defaultPrefix);
        resolve(res);
        return;
      }

      titleEl.textContent = title;
      inputEl.value = defaultPrefix || "";
      modal.style.display = "flex";
      inputEl.focus();
      inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length);

      const cleanup = () => {
        modal.style.display = "none";
        btnSave.onclick = null;
        btnCancel.onclick = null;
        inputEl.onkeydown = null;
      };

      btnSave.onclick = () => {
        const val = inputEl.value.trim();
        cleanup();
        resolve(val || null);
      };

      btnCancel.onclick = () => {
        cleanup();
        resolve(null);
      };

      inputEl.onkeydown = (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const val = inputEl.value.trim();
          cleanup();
          resolve(val || null);
        } else if (e.key === "Escape") {
          e.preventDefault();
          cleanup();
          resolve(null);
        }
      };
    });
  }

  document.getElementById("btn-save").addEventListener("click", async () => {
    if (!editor.value) return;

    if (loadedActionTag) {
      // Overwrite the currently loaded macro directly
      await saveAction(loadedActionTag, editor.value);
      renderSavedActions();
      addChatMessage("system", `Saved changes to macro "${loadedActionTag}"`);
      renderChatLog();
    } else {
      // Act like Save As with pre-populated current navigation prefix
      const prefix = getCurrentPrefix();
      const tag = await promptForTag("Save Action Macro", prefix);
      if (!tag) return;
      await saveAction(tag, editor.value);
      loadedActionTag = tag;
      renderSavedActions();
    }
    editor.focus();
  });

  document.getElementById("btn-save-as").addEventListener("click", async () => {
    if (!editor.value) return;
    const prefix = getCurrentPrefix();
    const tag = await promptForTag("Save As... New Action Macro", prefix);
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
      const colorTrigger = document.getElementById("color-dropdown-trigger");
      if (colorTrigger) colorTrigger.classList.remove("active");
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
      // Set Recolor active mode whenever color button is pushed
      document.querySelectorAll(".action-modes .mode-btn").forEach(b => b.classList.remove("active"));
      colorTrigger.classList.add("active");
      activeMode = "Recolor";

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
        // Ensure Recolor active mode remains set
        document.querySelectorAll(".action-modes .mode-btn").forEach(b => b.classList.remove("active"));
        if (colorTrigger) colorTrigger.classList.add("active");
        activeMode = "Recolor";

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
    const penAVal = document.getElementById("grid-penalty-a")?.value || "1";
    const penBVal = document.getElementById("grid-penalty-b")?.value || "1";
    const penCVal = document.getElementById("grid-penalty-c")?.value || "1";
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
    const newTagSep = (document.getElementById("tag-separator-input")?.value || "|").trim() || "|";
    const oldTagSep = settings.tag_separator || "|";

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
    await setSetting("grid_penalty_a", penAVal);
    await setSetting("grid_penalty_b", penBVal);
    await setSetting("grid_penalty_c", penCVal);
    await setSetting("basins_of_attraction", basins);
    await setSetting("use_os_keyboard", useOS);
    await setSetting("auto_hide_k2_keyboard", autoHide);
    await setSetting("home_assistant_url", haUrl);
    await setSetting("home_assistant_token", haToken);
    await setSetting("biography_text", bioText);
    await setSetting("local_tts_voice", localVoice);
    await setSetting("elevenlabs_voice", elevenlabsVoice);
    await setSetting("hover_brightness", hoverBrightness);
    await setSetting("tag_separator", newTagSep);

    // If tag separator changed, migrate all action tags in DB
    if (newTagSep !== oldTagSep) {
      await migrateTagSeparators(oldTagSep, newTagSep, getSavedActions, deleteAction, saveAction);
    }

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
    settings.grid_penalty_a = parseFloat(penAVal) ?? 1.0;
    settings.grid_penalty_b = parseFloat(penBVal) ?? 1.0;
    settings.grid_penalty_c = parseFloat(penCVal) ?? 1.0;
    settings.basins_of_attraction = basins === "1" ? 1 : 0;
    settings.use_os_keyboard = useOS === "1" ? 1 : 0;
    settings.auto_hide_k2_keyboard = autoHide === "1" ? 1 : 0;
    settings.home_assistant_url = haUrl;
    settings.home_assistant_token = haToken;
    settings.biography_text = bioText;
    settings.local_tts_voice = localVoice;
    settings.elevenlabs_voice = elevenlabsVoice;
    settings.hover_brightness = parseFloat(hoverBrightness) || 1.2;
    settings.tag_separator = newTagSep;

    applyKeyboardSettings();

    document.documentElement.style.setProperty("--hover-brightness", settings.hover_brightness);
    document.documentElement.style.setProperty("--min-target-height", `${settings.min_target_height}px`);
    document.documentElement.style.setProperty("--min-target-width", `${settings.min_target_width}px`);
    document.documentElement.style.setProperty("--button-gap-x", `${settings.button_gap_x}px`);
    document.documentElement.style.setProperty("--button-gap-y", `${settings.button_gap_y}px`);
    document.getElementById("editor-box").style.fontSize = `${fontEd}px`;

    updatePredictionsAndKeyboard();
    updateToolbarLayouts();
    renderSavedActions();
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
function getActiveInputTarget() {
  const active = document.activeElement;
  if (active && active !== document.body && (active.tagName === "INPUT" || active.tagName === "TEXTAREA") && !active.readOnly && !active.disabled) {
    return active;
  }
  return document.getElementById("editor-box");
}

function insertTextAtCursor(text) {
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
    updatePredictionsAndKeyboard();
  }
}

function deleteChar() {
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
    updatePredictionsAndKeyboard();
  }
}

function deleteNextChar() {
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
    updatePredictionsAndKeyboard();
  }
}

function deleteWord() {
  const editor = document.getElementById("editor-box");
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
  renderWordPredictions(wordCompletions.slice(0, 10), wordPrefix, (word) => {
    const editor = document.getElementById("editor-box");
    const start = editor.selectionStart;
    const currentText = editor.value;
    const textBefore = currentText.substring(0, start);
    const lastSpace = textBefore.lastIndexOf(" ");
    const newTextBefore = (lastSpace === -1 ? "" : textBefore.substring(0, lastSpace + 1)) + word + " ";

    editor.value = newTextBefore + currentText.substring(start);
    editor.selectionStart = editor.selectionEnd = newTextBefore.length;
    previousCaretPosition = editor.selectionStart;

    clearLastApiPredictions();
    updatePredictionsAndKeyboard();
    editor.focus();
  });

  // 3. Phrase Predictions & Next-Word Background Predictions Fetch: Trigger at word boundaries
  const isBoundary = (textBefore.length === 0 || textBefore.endsWith(" ") || textBefore.endsWith("\n") || textBefore.endsWith("\r"));
  if (isBoundary) {
    const now = Date.now();
    // Debounce cloud calls: 400ms delay window
    if (now - lastPhraseRequestTime > 400) {
      lastPhraseRequestTime = now;
      executeFetchPhrases(textBefore, textAfter, (phrases) => {
        renderPhrasePredictions(phrases, textBefore, textAfter, (phrase) => {
          const editor = document.getElementById("editor-box");
          const completedTextBefore = textBefore + phrase + " ";
          editor.value = completedTextBefore + textAfter;
          editor.selectionStart = editor.selectionEnd = completedTextBefore.length;
          previousCaretPosition = editor.selectionStart;

          updatePredictionsAndKeyboard();
          editor.focus();
        });
      });
      // Fetch Word Predictions from Backend asynchronously in the background
      executeFetchWords(textBefore, wordPrefix, () => {
        updatePredictionsAndKeyboardOnly();
      });
    }
  } else {
    // Clear phrase completions inside the middle of a word
    const phraseContainer = document.getElementById("phrase-predictions");
    if (phraseContainer) phraseContainer.innerHTML = "";
  }

  // 4. Redraw Keyboard probabilities HSL coloring
  renderAppKeyboard(charProbs);
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
  renderWordPredictions(wordCompletions.slice(0, 10), wordPrefix, (word) => {
    const editor = document.getElementById("editor-box");
    const start = editor.selectionStart;
    const currentText = editor.value;
    const textBefore = currentText.substring(0, start);
    const lastSpace = textBefore.lastIndexOf(" ");
    const newTextBefore = (lastSpace === -1 ? "" : textBefore.substring(0, lastSpace + 1)) + word + " ";

    editor.value = newTextBefore + currentText.substring(start);
    editor.selectionStart = editor.selectionEnd = newTextBefore.length;
    previousCaretPosition = editor.selectionStart;

    clearLastApiPredictions();
    updatePredictionsAndKeyboard();
    editor.focus();
  });
  renderAppKeyboard(charProbs);
}

function renderAppKeyboard(probabilities) {
  renderKeyboard(probabilities, settings.font_size_keyboard, (key) => {
    const target = getActiveInputTarget();
    if (target) {
      target.focus();
    }

    if (key === "Shift") {
      toggleShift();
      renderAppKeyboard(probabilities);
    } else if (key === "Backspace") {
      deleteChar();
    } else if (key === "Space") {
      insertTextAtCursor(" ");
    } else {
      const char = isShiftActive() ? key.toUpperCase() : key.toLowerCase();
      insertTextAtCursor(char);
      if (isShiftActive()) {
        setShiftActive(false);
        renderAppKeyboard(probabilities);
      }
    }
  });
}

async function renderSavedActions() {
  const saved = await getSavedActions();
  renderActionsGrid(saved, {
    tagSeparator: settings.tag_separator || "|",
    activeMode: activeMode,
    settings: settings,
    onCategoryClick: (catName) => handleCategoryClick(catName),
    onActionClick: (tag, actionText) => executeActionByMode(tag, actionText),
    onNavigate: () => renderSavedActions()
  });
}

function handleCategoryClick(catName) {
  const sep = getCurrentSeparator(settings.tag_separator);
  const fullCatPrefix = getCurrentPrefix(settings.tag_separator) + catName + sep;

  if (activeMode === "Delete") {
    showCategoryDeleteModal(catName, fullCatPrefix, async () => {
      const allActions = await getSavedActions();
      let count = 0;
      for (const a of allActions) {
        if (a.tag && (a.tag.startsWith(fullCatPrefix) || a.tag === fullCatPrefix.slice(0, -1))) {
          await deleteAction(a.tag);
          count++;
        }
      }
      addChatMessage("system", `🗑️ Deleted category "${catName}" and ${count} action${count === 1 ? "" : "s"}.`);
      renderChatLog();
      renderSavedActions();
    });
  } else if (activeMode === "Recolor") {
    const dropdown = document.getElementById("action-color-select");
    const chosenColorName = dropdown ? dropdown.value : "Blue";
    const colorMap = {
      "Blue": "#1f538d", "Green": "#2ecc71", "Red": "#e74c3c", "Orange": "#e67e22",
      "Purple": "#9b59b6", "Yellow": "#f1c40f", "Teal": "#1abc9c", "Pink": "#e84393", "Gray": "#475569"
    };
    const hex = colorMap[chosenColorName] || "#1f538d";

    showCategoryRecolorModal(catName, fullCatPrefix, chosenColorName, async () => {
      const allActions = await getSavedActions();
      let count = 0;
      for (const a of allActions) {
        if (a.tag && (a.tag.startsWith(fullCatPrefix) || a.tag === fullCatPrefix.slice(0, -1))) {
          await saveAction(a.tag, a.action_text, hex);
          count++;
        }
      }
      addChatMessage("system", `🎨 Recolored ${count} action${count === 1 ? "" : "s"} in category "${catName}" to ${chosenColorName}.`);
      renderChatLog();
      renderSavedActions();
    });
  } else {
    const currentPath = getCurrentNavPath();
    currentPath.push(catName);
    renderSavedActions();
  }
}

function applySuggestionToEditor(actionText) {
  const editor = document.getElementById("editor-box");
  if (!editor) return;
  editor.value = actionText;
  editor.selectionStart = editor.selectionEnd = actionText.length;
  previousCaretPosition = editor.selectionStart;
  loadedActionTag = null;
  updatePredictionsAndKeyboard();
  editor.focus();
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
    const chosenColorName = dropdown ? dropdown.value : "Blue";
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
async function executeSendCloud(clearEditor = true) {
  const editor = document.getElementById("editor-box");
  const text = editor.value;
  if (!text.trim()) {
    await addChatMessage("system", "Please type or dictate a message before sending to @CloudAI.");
    renderChatLog();
    return;
  }

  addChatMessage("user", text);
  renderChatLog();

  if (clearEditor) {
    editor.value = "";
    previousCaretPosition = 0;
    loadedActionTag = null; // Clear macro selection
    updatePredictionsAndKeyboard();
  }

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
  let success = false;
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
    // Update currentSuggestions so macros_summary stays in sync for next cloud request
    currentSuggestions = responseData.suggestions || [];
    await addChatMessage("cloud_ai", responseData.reply, responseData.suggestions);
    renderChatLog();

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
      const recipient = (data.recipient || data.phone || "").trim();
      const body = data.message || data.text || data.content || "";

      // Format phone number for RFC 5724 sms: protocol (preserve leading + without turning it into %2B)
      const cleanPhone = recipient.replace(/[^\d+]/g, "") || recipient;
      const smsUrl = `sms:${cleanPhone}${body ? `?body=${encodeURIComponent(body)}` : ''}`;

      // Automatically copy SMS body to clipboard as fallback for OS apps like Phone Link
      if (body) {
        try {
          await navigator.clipboard.writeText(body);
        } catch (err) {
          console.warn("Clipboard write failed:", err);
        }
      }

      // Attempt native SMS protocol navigation
      try {
        window.location.href = smsUrl;
      } catch (e) {
        console.warn("SMS protocol launch failed:", e);
      }

      const clipNotice = body ? " (text copied to clipboard for pasting)" : "";
      await addChatMessage("system", `📱 Prepared SMS text message to ${recipient || "contact"}: "${body}"${clipNotice}`);
      renderChatLog();
    } else if (op === "home_assistant") {
      const argsParts = Object.keys(data)
        .filter(k => k !== "type" && k !== "op_type")
        .map(k => `${k}='${data[k]}'`);
      const argsSummary = argsParts.join(", ");
      addChatMessage("system", `🏠 [Home Assistant Operation] Stub called with arguments: ${argsSummary}`);
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

async function exportContactsCSV() {
  const contactsList = await getContacts();
  if (!contactsList || contactsList.length === 0) {
    alert("No contacts directory entries available to export.");
    return;
  }

  const csvLines = ["Name,Value"];

  // Sort contacts alphabetically by name
  contactsList.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  contactsList.forEach(c => {
    const name = c.name || "";
    const value = c.value || "";
    const rawFields = [name, value];
    const escapedFields = rawFields.map(f => {
      const str = String(f);
      if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    });
    csvLines.push(escapedFields.join(","));
  });

  const csvContent = csvLines.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const dateStr = new Date().toISOString().split("T")[0];
  a.download = `k2_contacts_export_${dateStr}.csv`;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 200);

  addChatMessage("system", `📇 Exported ${contactsList.length} contact${contactsList.length === 1 ? "" : "s"} to CSV.`);
  renderChatLog();
}

function parseCSVGeneric(text) {
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

function parseContactsCSV(fileContent) {
  const rows = parseCSVGeneric(fileContent);
  if (!rows || rows.length === 0) return null;

  const header = rows[0].map(h => h.trim());
  const headerLower = header.map(h => h.toLowerCase());

  // Check if this is a 2-column K2 Contacts Export CSV ("Name" and "Value")
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

  // For multi-column CSVs (like Google Contacts CSV exports or vCard files), return null to use backend parser
  return null;
}

function parseActionsCSV(text) {
  const rows = parseCSVGeneric(text);
  const actions = [];
  const sep = getCurrentSeparator();

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

async function exportActionsCSV() {
  const actions = await getSavedActions();
  if (!actions || actions.length === 0) {
    alert("No action macros available to export.");
    return;
  }

  const sep = getCurrentSeparator();
  const csvLines = [];

  actions.sort((a, b) => (a.tag || "").localeCompare(b.tag || ""));

  actions.forEach(act => {
    const text = act.action_text || "";
    const tag = act.tag || "";
    const color = act.color || "";
    const subtags = tag.length > 0 ? tag.split(sep) : ["Uncategorized"];

    const rawFields = [text, ...subtags];
    if (color) {
      rawFields.push(color);
    }

    const escapedFields = rawFields.map(f => {
      const str = String(f);
      if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    });

    csvLines.push(escapedFields.join(","));
  });

  const csvContent = csvLines.join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const dateStr = new Date().toISOString().split("T")[0];
  a.download = `k2_actions_export_${dateStr}.csv`;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 200);

  addChatMessage("system", `⚡ Exported ${actions.length} action macro${actions.length === 1 ? "" : "s"} to CSV.`);
  renderChatLog();
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

function createChatMessageElement(msg) {
  const div = document.createElement("div");
  div.className = `chat-message ${msg.role}`;
  div.innerHTML = msgToHtml(msg);

  if (msg.role === "cloud_ai" && msg.suggestions && Array.isArray(msg.suggestions) && msg.suggestions.length > 0) {
    const sugCont = document.createElement("div");
    sugCont.className = "chat-suggestions-container";
    msg.suggestions.forEach(sug => {
      const btn = document.createElement("button");
      btn.className = "chat-suggestion-pill";
      btn.textContent = sug.tag || sug.action_text;
      btn.title = `Load suggestion into editor: "${sug.action_text}"`;
      btn.onclick = () => {
        applySuggestionToEditor(sug.action_text);
      };
      sugCont.appendChild(btn);
    });
    div.appendChild(sugCont);
  }
  return div;
}

function renderSingleChatMessage(msg) {
  const log = document.getElementById("chat-log-scroll");
  if (!log) return;

  const div = createChatMessageElement(msg);

  const thinkingDiv = log.querySelector(".thinking");
  if (thinkingDiv) {
    log.insertBefore(div, thinkingDiv);
  } else {
    log.appendChild(div);
  }

  log.scrollTo({ top: log.scrollHeight, behavior: "smooth" });
}
window.renderSingleChatMessage = renderSingleChatMessage;

async function renderChatLog(force = false) {
  const log = document.getElementById("chat-log-scroll");
  if (!log) return;

  if (force || log.children.length === 0) {
    log.innerHTML = "";
    const list = await getChatHistory();
    list.forEach(msg => {
      const div = createChatMessageElement(msg);
      log.appendChild(div);
    });
    log.scrollTop = log.scrollHeight;
  }
}
window.renderChatLog = renderChatLog;

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

  const btnExportContacts = document.getElementById("btn-export-contacts-csv");
  if (btnExportContacts) {
    btnExportContacts.onclick = exportContactsCSV;
  }

  const btnExportActions = document.getElementById("btn-export-actions-csv");
  if (btnExportActions) {
    btnExportActions.onclick = exportActionsCSV;
  }

  const btnImportActions = document.getElementById("btn-import-actions-csv");
  const actionsCsvInput = document.getElementById("actions-csv-file-input");
  if (btnImportActions && actionsCsvInput) {
    btnImportActions.onclick = () => {
      actionsCsvInput.value = "";
      actionsCsvInput.click();
    };
    actionsCsvInput.onchange = (e) => {
      if (e.target.files && e.target.files[0]) {
        pendingImportType = "actions";
        pendingImportFile = e.target.files[0];
        pendingImportText = null;
        showImportModeModal("Import Action Macros (CSV)");
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

  if (targetStore === "contacts") {
    try {
      let items = parseContactsCSV(fileContent);
      if (!items || items.length === 0) {
        const list = mode === "merge" ? await getContacts() : [];
        const existingContext = list.map(c => `${c.name}: ${c.value}`).join("\n");
        const res = await fetch("/api/parse-bulk-file", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            file_content: fileContent,
            target_store: "contacts",
            mode: mode,
            existing_context: existingContext
          })
        });
        const data = await res.json();
        items = (data && Array.isArray(data.items)) ? data.items : (Array.isArray(data) ? data : []);
      }

      if (items && items.length > 0) {
        if (mode === "replace") {
          await setContacts(items);
        } else {
          for (const item of items) {
            if (item.name) await saveContact(item.name, item.value || "");
          }
        }
        await addChatMessage("system", `📇 Imported ${items.length} contact${items.length === 1 ? "" : "s"} (${mode} mode)`);
        renderChatLog();
        alert(`📇 Successfully imported ${items.length} contacts (${mode} mode)!`);
      } else {
        alert("No contact entries found in file.");
      }
    } catch (err) {
      alert("Contacts import failed: " + err.message);
    }
    return;
  }

  if (targetStore === "actions") {
    try {
      const items = parseActionsCSV(fileContent);
      let count = 0;

      if (mode === "replace") {
        const existing = await getSavedActions();
        for (const a of existing) {
          await deleteAction(a.tag);
        }
      }

      for (const item of items) {
        if (item.tag && item.action_text !== undefined) {
          await saveAction(item.tag, item.action_text, item.color);
          count++;
        }
      }

      await addChatMessage("system", `⚡ Imported ${count} action macro${count === 1 ? "" : "s"} (${mode} mode).`);
      renderChatLog();
      renderSavedActions();
      alert(`⚡ Successfully imported ${count} action macros (${mode} mode)!`);
    } catch (err) {
      alert("Action macro import failed: " + err.message);
    }
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
