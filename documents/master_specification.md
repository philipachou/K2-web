# K2-web Master Specification
**Version:** 2026-08-24 (merged from implemented, intended, and recommended)
**Source files audited:** `frontend/index.html`, `frontend/app.js`, `frontend/style.css`, `backend/main.py`

---

## 0. How to Use This Document

This is the single authoritative reference for K2-web. It describes what the system currently does, why it was designed that way, and what changes are proposed for the future. It is written for both **humans** (Phil reviewing and annotating) and **AI coding agents** (implementing changes).

### Notation Guide

| Marker | Meaning |
|---|---|
| Plain text | The current implemented behavior. Ground truth. |
| `> **[SIDEBAR]**` | Commentary or caution note within the spec body. |
| `> **[INTENT — Title]**` | Design rationale: why this was built this way. |
| `> **[DIVERGENCE — Title]**` | Where current code differs from stated design intent. |
| `> **[OPEN QUESTION — Title]**` | Unresolved design decision that needs a future answer. |
| `> **[RECOMMENDATION — Rn.n (Priority n): Title]**` | A proposed change. **Not yet implemented or approved.** |
| `**[Phil]**` | A comment added by Phil in the document for discussion. |

### For AI Coding Agents

Before making any code change:
1. **Read the relevant section(s)** of this document to understand what currently exists.
2. **Do not rely on memory** — always verify behavior from the spec before modifying.
3. **RECOMMENDATION blocks are proposals only.** Do not implement them unless explicitly instructed.
4. After implementing an approved change:
   - Update the plain-text section to reflect the new state.
   - Remove the corresponding RECOMMENDATION block (or mark it `[DONE — vX.Y]`).
   - Update any INTENT/DIVERGENCE/OPEN QUESTION blocks that are affected.
   - Update the version date at the top of this document.
5. **The layout engine (Section 10) is the most fragile area.** Any change to panel structure, CSS flex, padding, margin, or min/max-height rules must be accompanied by a corresponding update to the layout engine measurement code. Test all panel collapse/expand combinations after any such change.

### For Phil

- Edit this document directly using the `**[Phil]**` marker to leave comments for the agent.
- To approve a RECOMMENDATION for implementation, write `**[Phil]** Approved — please implement.` on the RECOMMENDATION block, then ask the agent.
- To reject a RECOMMENDATION, delete its block from this document.
- To propose a new change, add a `> **[RECOMMENDATION — Rn.n: Title]**` block in the relevant section, or ask the agent to draft one.
- When a RECOMMENDATION is implemented and verified, the three individual source files (`master_specification_implemented.md`, `master_specification_intended.md`, `master_specification_recommended.md`) may be deleted. Until then they remain as backups.

---

## Table of Contents
1. [System Overview](#1-system-overview)
2. [Technology Stack](#2-technology-stack)
3. [Application Shell and Viewport](#3-application-shell-and-viewport)
4. [Panel System](#4-panel-system)
5. [Panel 1: Chat Log](#5-panel-1-chat-log)
6. [Panel 2: Actions](#6-panel-2-actions)
7. [Panel 3: Editor](#7-panel-3-editor)
8. [Panel 4: Predictor](#8-panel-4-predictor)
9. [Panel 5: Keyboard](#9-panel-5-keyboard)
10. [Layout Engine](#10-layout-engine)
11. [Action Mode System](#11-action-mode-system)
12. [Text-to-Speech (TTS)](#12-text-to-speech-tts)
13. [Cloud AI (Chat)](#13-cloud-ai-chat)
14. [Prediction System](#14-prediction-system)
15. [Data Stores](#15-data-stores)
16. [Settings](#16-settings)
17. [Backend API Endpoints](#17-backend-api-endpoints)
18. [XML Operation System](#18-xml-operation-system)
19. [Accessibility and Input Handling](#19-accessibility-and-input-handling)
20. [Visual Design System](#20-visual-design-system)

---

## 1. System Overview

K2 is a web-based assistive communication system for users with motor impairments (primary target: ALS). It enables communication through:
- An on-screen virtual QWERTY keyboard with probability-weighted key coloring
- Text-to-speech output (cloud and local)
- Customizable macro action buttons (hierarchical categories)
- Cloud AI chat (Google Gemini) for generating text, controlling smart home devices, and managing personal data
- Word and phrase prediction integrated with a cloud AI backend

K2 is designed to function as the **primary interface** for a user who may rely on eye-gaze tracking or a mouse as their primary pointing device. All interactive elements must satisfy minimum touch/gaze target size requirements.

> **[INTENT — Designed for ALS]** K2 is primarily designed for Kay, an ALS patient who has largely lost the ability to speak and has significantly reduced motor control. The design must: work with eye gaze tracking (Tobii-style devices, which function as a mouse but have limited precision); work with a physical mouse as secondary input; be usable on a Windows tablet in landscape orientation (primary), and also on iPad and potentially phone; never require fine motor precision (all targets must be large enough to activate by dwell-gaze); and not require typing speed (the keyboard is augmented heavily with predictions).

> **[INTENT — Reliability First]** The app is Kay's primary communication device. Reliability and stability take absolute priority over new features.

> **[INTENT — K2 Name]** The name "K2" is a reference to Kay's name, not to the mountain. The app name displayed to the AI assistant is "K2," and the AI's persona name is also "K2."

> **[DIVERGENCE — App Title]** The app title in `index.html` says "K2 Assistive Web System." The user guide uses "K2 Communication System." No functional divergence.

---

## 2. Technology Stack

### 2.1 Frontend
- **HTML5** — Single page (`frontend/index.html`)
- **CSS** — `frontend/style.css` (Vanilla CSS, no framework)
- **JavaScript** — `frontend/app.js` (Vanilla JS, no framework; ~5,000 lines)
- **Font** — `Outfit` (Google Fonts, weights 300/400/600/800)
- **Local persistence** — Browser `IndexedDB` (database name: `k2_web_db`, version 2)
- **No build step** — Files are served statically by the backend

### 2.2 Backend
- **Python** — `backend/main.py`
- **Framework** — FastAPI
- **AI provider** — Google Gemini (`google-genai` SDK), model `gemini-2.5-flash`
- **TTS provider** — ElevenLabs (`/v1/text-to-speech/{voice_id}`, model `eleven_v3`)
- **HTTP client** — `httpx` (async), `requests` (sync)
- **Environment variables** — `GEMINI_API_KEY`, `ELEVENLABS_API_KEY` (loaded via `python-dotenv`)
- **Static file serving** — `fastapi.staticfiles.StaticFiles` mounted at `/` (must be last route)
- **Versioning** — Cache-busting via URL query string (e.g., `?v=20260816_v115`) on `style.css` and `app.js` references

### 2.3 Data Storage Architecture
All user data is stored **client-side** in IndexedDB. There is **no server-side persistence**.

| Store Name | Key | Contents |
|---|---|---|
| `settings` | `key` (string) | Key-value pairs for all settings |
| `chat_history` | `id` (auto-increment) | Chat message objects with role, content, suggestions, timestamp |
| `saved_actions` | `tag` (string) | Macro buttons: `{tag, action_text, color, timestamp}` |
| `personal_summary` | `category` (string) | User profile: `{category, content}` |
| `contacts` | `name` (string) | Contacts: `{name, value, timestamp}` |

> **[INTENT — Vanilla JS by Design]** The choice of Vanilla JS + Vanilla CSS (no framework) was deliberate: frameworks add abstraction layers that are difficult for AI coding agents to reason about precisely. With vanilla code, every behavior is traceable to a specific line.

> **[INTENT — No Build Step]** No build step is intentional: the app must be deployable by serving a folder, without npm/webpack. This keeps deployment simple.

> **[INTENT — IndexedDB for Privacy]** IndexedDB was chosen because Kay's data is personal and private (no server-side data desired), and data must survive page refreshes and browser restarts. The backend is stateless and can be restarted without data loss.

> **[INTENT — Cache Busting is Manual]** The cache-busting version string in `style.css?v=...` and `app.js?v=...` is updated manually by the developer on each significant change to force browsers to reload. This is fragile — an automated approach would be better.

> **[OPEN QUESTION — Cloud Backup]** Should there be any server-side backup mechanism? Currently, data can be lost if the browser clears storage. The JSON export provides a manual backup, but there is no automatic cloud backup.

> **[RECOMMENDATION — R1.1 (Priority 1): Modularize `app.js`]**
> **Status: Proposed — not yet implemented or approved.**
>
> **Problem:** `app.js` is ~5,000 lines in a single file. Agents making changes frequently break unrelated behavior because they cannot see the full context of what they are editing.
>
> **Recommendation:** Split into focused ES modules using `type="module"` on the script tag:
> - `db.js` — IndexedDB operations
> - `layout.js` — Layout engine
> - `keyboard.js` — Keyboard rendering and key actions
> - `predictions.js` — Word and phrase prediction logic
> - `tts.js` — TTS functions
> - `chat.js` — Chat send/receive and rendering
> - `actions.js` — Actions grid and mode system
> - `settings.js` — Settings modal sync and save
> - `data-ops.js` — Import/export operations
> - `app.js` — Main entry point and init only
>
> Each function remains identical — only file organization changes. Implement one module at a time and test after each extraction.
>
> **Spec change when implemented:** Add section 2.4 "Module Structure" to this document listing the module breakdown and each module's public API.

> **[RECOMMENDATION — R1.2 (Priority 1): Add Playwright Smoke Tests]**
> **Status: Proposed — not yet implemented or approved.**
>
> **Problem:** No automated tests exist. Regressions are discovered only after deployment.
>
> **Recommendation:** Add a `tests/` directory with Playwright end-to-end smoke tests:
> - `01-startup.spec.js` — app loads, all 5 panels visible
> - `02-editor-basic.spec.js` — type, del char, del word, del all
> - `03-keyboard-input.spec.js` — click keyboard keys, text appears in editor
> - `04-predictions.spec.js` — word predictions appear, clicking inserts
> - `05-actions-grid.spec.js` — grid renders, click inserts in editor
> - `06-panel-collapse.spec.js` — collapse/expand each panel
> - `07-settings.spec.js` — open settings, change font size, close
> - `08-tts-local.spec.js` — click @LocalTTS, check speaking state
>
> Run against a locally served instance with mocked backend AI endpoints.
>
> **Spec change when implemented:** Add section 2.5 "Test Suite" describing the tests and how to run them.

> **[RECOMMENDATION — R1.3 (Priority 1): Visual Baseline Screenshots]**
> **Status: Proposed — not yet implemented or approved.**
>
> **Problem:** UI regressions in visual layout are undetectable without screenshots. An agent cannot see the UI.
>
> **Recommendation:** Use Playwright to capture reference screenshots for key states (default all-open, wide/narrow mode, settings modal, various panel collapse combinations) stored in `tests/screenshots/baseline/`. Diff against baseline on each change.
>
> **Spec change when implemented:** Add section 2.6 "Visual Baseline" describing the baseline states and diff process.

> **[RECOMMENDATION — R4.2 (Priority 4): Multi-Device Sync (Cloud Backup)]**
> **Status: Proposed — not yet implemented or approved.**
>
> **Problem:** Kay may want to use K2 on multiple devices with the same data. Currently, data is siloed per browser.
>
> **Recommendation:**
> - Add `POST /api/sync` to accept the full IndexedDB export JSON and store it on the server
> - Add `GET /api/sync` to retrieve the latest backup
> - Add a "Sync to Cloud" button to the Settings Data Operations section
> - On startup, offer to pull from cloud if local data is newer/older (by timestamp comparison)
> - **IMPORTANT:** The server must remain stateless for AI/TTS; only the sync endpoint writes to disk
>
> **Spec change when implemented:** Add section 2.7 "Optional Cloud Sync" to this document (under section 2, Technology Stack). Also add `POST /api/sync` and `GET /api/sync` to section 17 (Backend API Endpoints).

---

## 3. Application Shell and Viewport

### 3.1 Root Container
The application occupies the full visual viewport at all times using a `position: fixed` container (`.app-container`) that tracks the visual viewport, not the layout viewport. The JS function `updateAppViewportHeight()` sets `--app-height` to `window.visualViewport.height`. The layout engine `recalculateLayoutHeights()` sets `appCont.style.top` to `window.visualViewport.offsetTop` and `appCont.style.height` to the viewport height, keeping the container above the OS keyboard.

### 3.2 App Container Structure
```
.app-container
  .upper-workspace               (flex col, flex: 1, scrollable if overflow)
    .top-row                     (Chat + Actions, side-by-side wide / stacked narrow)
      .chat-panel                (Chat Log)
      .panel-divider.vertical-divider
      .actions-panel             (Actions)
    .panel-divider.horizontal-divider
    .editor-panel                (Editor)
    .panel-divider.horizontal-divider
    .predictions-panel           (Predictor)
  .panel-divider.horizontal-divider
  .keyboard-panel-wrapper        (K2 Keyboard)
```

The keyboard panel wrapper sits **outside** `.upper-workspace` so it is never scrolled away.

### 3.3 Safe Area and Padding
The app-container uses `max(12px, calc(env(safe-area-inset-top, 0px) + 8px))` for top/bottom padding to respect iOS notches and home bars.

### 3.4 Overflow Prevention
`overflow: hidden !important` and `overscroll-behavior: none` on `html`, `body`, and `.app-container`. The `.upper-workspace` can become `overflow-y: auto` when the layout overflows.

### 3.5 Wide vs. Narrow Mode
- **Wide mode**: `window.innerWidth >= 769px` — Chat and Actions panels side-by-side
- **Narrow mode**: `window.innerWidth <= 768px` — Chat and Actions panels stacked vertically

This breakpoint is enforced in both JS and CSS.

> **[INTENT — iOS Safari Keyboard]** The `visualViewport` tracking approach was developed specifically for iOS Safari, where the page is not resized when the OS virtual keyboard appears — instead, the visual viewport shrinks. By positioning the app-container relative to `visualViewport.offsetTop + height`, the app stays above the keyboard.

> **[INTENT — Keyboard Outside Upper-Workspace]** The keyboard panel wrapper being outside `.upper-workspace` is architecturally significant: the keyboard must never scroll out of view. The upper-workspace can scroll; the keyboard must always be anchored at the bottom of the visual viewport.

> **[DIVERGENCE — Keyboard Pinning Via JS Not CSS]** The design originally described the keyboard as "pinned to the bottom." The current implementation achieves this structurally (wrapper outside `.upper-workspace`) but the actual height is managed by the JS layout engine, not CSS `position: sticky` or similar. This is correct and intentional.

> **[INTENT — 769px Breakpoint]** The 769px breakpoint was chosen pragmatically: it accommodates typical tablet portrait widths (768px) and ensures a sensible switch between side-by-side and stacked layouts.

> **[OPEN QUESTION — User-Configurable Breakpoint]** Should the wide/narrow breakpoint be user-configurable? Currently hardcoded in both JS and CSS. On very large screens the current 50/50 split of Chat/Actions may be suboptimal.

---

## 4. Panel System

### 4.1 Common Panel Structure
Every panel uses the `.labeled-panel` structure:
- `.panel-label` — vertical text strip on the left (30px wide desktop, 24px mobile). Text rotated 180°. Click target to collapse/expand.
- `.panel-body` — remaining width, holding content.

### 4.2 Panel Collapse / Expand
Clicking a `.panel-label` toggles a `collapsed` CSS class on the parent `.labeled-panel`.

**Collapse constraint:** At least one of {Chat Log, Actions, Editor} must always be open. If the user attempts to close the last open one, the **earliest-closed** panel (tracked in `closedPanelHistory[]`) is automatically re-opened.

When collapsed: panel shrinks to a horizontal label bar at `min_target_height` px height (40px default).

**Wide-mode collapsed behavior:** A top-row panel shrinks to a 34px wide vertical strip; the other expands to full width.

**Special case:** When both Chat and Actions are collapsed in wide mode, both show as horizontal label bars. The `.force-horizontal-label` class is applied to both.

### 4.3 Panel Dividers
Between each panel: `.panel-divider.horizontal-divider` (or `.vertical-divider` between Chat and Actions).
- Height: `var(--button-gap-y, 4px)` with equal top/bottom margin (total ~12px)
- Appearance: green-to-blue gradient glow line
- In narrow mode, vertical dividers become horizontal

### 4.4 Glassmorphism Visual
All panels: `background: rgba(15, 23, 42, 0.65)`, `backdrop-filter: blur(16px)`, thin translucent border, deep shadow, `border-radius: 12px`.

> **[INTENT — Panel Collapse for Eye Gaze]** Panel collapse exists specifically for eye-gaze users. When a panel is not needed, collapsing it gives more space to active panels. The label click target functions as the collapse/expand button.

> **[INTENT — At-Least-One Constraint]** The constraint that at least one of {Chat, Actions, Editor} must always be open prevents the user from accidentally locking themselves out of all panels.

> **[DIVERGENCE — Wide-Mode 34px Strip]** The design documents describe a collapsed panel as "a tab on the left side." The wide-mode behavior where a collapsed panel becomes a 34px vertical strip (with the other panel expanding to fill) was added by the developer to improve screen real estate and is considered correct.

> **[INTENT — Glassmorphism]** The glassmorphism style (translucent panels over deep background) was chosen for aesthetic reasons and to give a subconscious sense that panels are floating "above" the page, making the interface feel lighter.

> **[OPEN QUESTION — Persist Collapse State]** Should panel collapse state be persisted across sessions? Currently, panels return to default open state on each page load. See also R2.2.

> **[RECOMMENDATION — R2.2 (Priority 2): Persist Panel Collapse State]**
> **Status: Proposed — not yet implemented or approved.**
>
> **Problem:** Panel collapse/expand state resets on each page load. If Kay collapses the chat log to work on macros, she must re-collapse it each session.
>
> **Recommendation:** Store panel open/closed state in settings:
> - `panel_chat_open`: "1" | "0"
> - `panel_actions_open`: "1" | "0"
> - `panel_editor_open`: "1" | "0" (always "1" — editor always starts open)
> - `panel_predictor_open`: "1" | "0"
> - `panel_keyboard_open`: "1" | "0"
>
> Apply on startup after settings load, before first render. Respect the at-least-one constraint during restore.
>
> **Spec change when implemented:** Add these 5 settings keys to section 15 (Data Stores, Settings Store Keys table). Note startup sequence in section 3.

---

## 5. Panel 1: Chat Log

### 5.1 Structure
- `#active-timers-container` — running timer chips above the scroll area
- `#chat-log-scroll` — the scrollable message list

### 5.2 Message Types
| Class | Appearance | Used for |
|---|---|---|
| `.chat-message.user` | Blue tinted, left-aligned | User's sent messages |
| `.chat-message.cloud_ai` | Green tinted, left-aligned | AI responses |
| `.chat-message.system` | Neutral/muted, full-width | System notifications |

AI messages while generating show `.chat-message.cloud_ai.thinking` — italic, pulsing opacity animation (`pulse-thinking`).

### 5.3 AI Message Rendering
AI messages are rendered as HTML using a markdown-to-HTML converter (`formatMarkdownContent()`). Supports bold/italic, inline code, code blocks, inline images (via `<operation type="show_image" .../>` rendered as `.k2-image-card`), and suggestion pills.

### 5.4 Suggestion Pills
Up to 3 clickable `.chat-suggestion-pill` buttons shown below each AI message. Clicking calls `applySuggestionToEditor(actionText)`, which:
1. **Replaces** the entire `editor-box.value` with `actionText` (does NOT append to existing content).
2. Resets `loadedActionTag = null` (to prevent an accidental Save from overwriting a previously loaded macro).
3. Sets caret to end of inserted text (`selectionStart = selectionEnd = actionText.length`).
4. Updates predictions and keyboard coloring.
5. Focuses `editor-box`.

### 5.5 Active Timers Display
Timer chips display `⏱️ [label]: MM:SS` with a ✖ cancel button. Container hidden when no timers; gains `.has-timers` class when active.

### 5.6 Scrolling
Dwell-scroll: hover within 15% of top/bottom edge triggers scroll at proportional speed (max ±15px/frame). Chat log auto-scrolls to bottom after each new message.

### 5.7 History
Stored in IndexedDB. Full history rendered on load. Last 10 messages sent to AI in each request. No "clear chat" button exists currently.

> **[INTENT — Primary Feedback Channel]** The chat log is the primary feedback channel — it shows what the AI said, what the system is doing, and what has been spoken or sent. Every significant action produces a system message.

> **[INTENT — Always Record What Happened]** Even if the user presses @CloudTTS and it speaks, a system message confirms `Speaking (CloudTTS): "..."`. The user always has a record.

> **[INTENT — Suggestion Pills Reduce Keystrokes]** After an AI response, the user should often be able to click a pill rather than re-type a follow-up. Suggestions are the primary mechanism for reducing typing burden.

> **[DIVERGENCE — Suggestion Pill Accessibility Tension]** Design intent is that suggestion pills should be easy to reach for eye-gaze users (large targets). However, pills are inside the chat log scroll area, meaning the user may need to scroll to see them after a long AI response. This tension has not been fully resolved.

> **[INTENT — Thinking Bubble]** The "Thinking..." animated bubble provides visual feedback during AI processing time (3–10+ seconds). Without it, the interface appears frozen.

> **[INTENT — Auto Memory Extraction]** Background calls to `/api/extract-memory` after each AI response passively maintain the profile and contacts without the user needing to explicitly manage them.

> **[OPEN QUESTION — Clear Chat History]** There is no UI to clear the chat history. The current workaround is to export config (which includes history), then import with only the non-history stores. A "Clear Chat History" button in settings would be useful. See R2.1.

> **[RECOMMENDATION — R2.1 (Priority 2): Clear Chat History Button]**
> **Status: Proposed — not yet implemented or approved.**
>
> **Problem:** Chat history grows indefinitely. There is no way to clear it from the UI.
>
> **Recommendation:** Add a "Clear Chat History" button to the Settings modal Data Operations section (a fifth row in the grid). Button must show a confirmation dialog before deleting. Implement as `clearStore("chat_history")` in the IndexedDB layer.
>
> **Spec change when implemented:** Add `btn-clear-chat-history` to section 16.2 (Settings Controls). Add `clearStore()` operation description to section 15 (Data Stores).

> **[RECOMMENDATION — R3.2 (Priority 3): Suggestion Pill Visibility]**
> **Status: Proposed — not yet implemented or approved.**
>
> **Problem:** Suggestion pills appear below the AI response in the chat log, but may not be visible without scrolling after a long response.
>
> **Recommendation:** Ensure the chat log auto-scrolls far enough after each AI response to show the suggestion pills in view. Verify that the current scroll-to-bottom implementation includes the pills in the visible area. If not, scroll to `lastMessage.nextSibling` (the pills container) rather than to `scrollHeight`.
>
> **Spec change when implemented:** Update section 5.6 to note that auto-scroll targets the suggestion pills container, not just scroll bottom.

> **[RECOMMENDATION — R3.3 (Priority 3): Remove "Do you want me to:" from Display]**
> **Status: Proposed — not yet implemented or approved.**
>
> **Problem:** The AI always ends responses with "Do you want me to: 1. ..., 2. ..., or 3. ...?" which is redundant since the same options are shown as clickable pills.
>
> **Recommendation:** Strip the trailing "Do you want me to:..." / "Would you like me to:..." sentence from the *displayed* reply text in `formatMarkdownContent()` or `renderChatLog()`, using a regex. Do **not** strip it from stored chat history, as the AI uses this sentence to maintain suggestion context in subsequent turns.
>
> **Spec change when implemented:** Update section 5.3 to note this display-only stripping. Update section 13.4 to note the sentence is stripped from display but preserved in storage.

---

## 6. Panel 2: Actions

### 6.1 Structure
```
Actions Panel
  panel-label "Actions"
  panel-body
    panel-header
      actions-header-controls (horizontally scrollable toolbar)
        action-modes (mode buttons)
        custom-dropdown (Recolor color picker)
        btn-settings (Settings)
    actions-nav-bar (breadcrumb bar)
    actions-grid (button grid)
    actions-preview-bar (hover preview)
```

### 6.2 Mode Toolbar Buttons
| Button ID | Color | Full label | Short label |
|---|---|---|---|
| `mode-delete` | Gray `#475569` | Delete | 🗑️ Del |
| `mode-edit` | Purple `#9b59b6` | Edit | ✏️ Edit |
| `mode-cloud-tts` | Green `#2ecc71` | @CloudTTS | ☁️ TTS |
| `mode-local-tts` | Green | @LocalTTS | 🔊 TTS |
| `mode-copy` | Green | Copy | 📋 Copy |
| `mode-cloud` | Blue `#1f538d` | @CloudAI | ✨ AI |
| `color-dropdown-trigger` | Dynamic | [color name] | — |
| `btn-settings` | Gray | ⚙️ Settings | ⚙️ Set |

Active mode button: white border + white glow. Label-shrinking 4-step algorithm: full/0.8rem → full/0.65rem → short/0.8rem → short/0.65rem, picks first that fits.

### 6.3 Breadcrumb Navigation Bar
1. 🏠 Home button — always shown, resets `currentNavPath` to root
2. Tag separator character between breadcrumbs (default `|`)
3. Breadcrumb buttons, one per level of `currentNavPath` — clicking truncates path to that level

Active breadcrumb: brighter amber. All breadcrumb buttons: amber/folder color with upper-right chamfer (CSS mask clip).

### 6.4 Action/Category Grid
At the current nav level:
- **Categories first** (amber/folder style, chamfered corner), sorted A-Z
- **Actions second** (semi-transparent dark, optional custom color), sorted A-Z

**Grid column algorithm** (`chooseGridColumns()`): Selects column count 1–12 minimizing:
```
penalty = A × (fraction below fold) + B × (fraction needing 2-line wrap) + C × (fraction needing 3+ lines)
```
Among equal penalties, largest column count chosen. Canvas 2D context measures text widths.

### 6.5 Hover Preview Bar
Shows action content on hover (250ms delay). Resets to "Hover over an action to preview..." after mouse leaves (2s debounce).

### 6.6 Macro Storage
Each record: `{tag, action_text, color, timestamp}`. Tag uses separator-delimited hierarchy (default `|`). Leaf label = last segment after the final separator.

> **[INTENT — Fast Access Panel]** The Actions panel is the fastest-access panel. Macros are pre-defined texts the user can fire with a single tap. They represent the phrases Kay uses most frequently.

> **[INTENT — Hierarchical Folders]** The folder system allows macros to be organized without requiring the user to scroll through a very long flat list. Breadcrumb navigation mirrors familiar folder navigation.

> **[INTENT — Mode Toolbar for Direct Management]** Rather than a separate management screen, the user can be in "Edit mode" (click to insert text), then switch to "Delete mode" (click to delete), etc. This makes macro management as direct as possible.

> **[INTENT — Tag Separator Choice]** The default `|` separator was chosen because it is visually clear, not commonly used in text content, and easy to type. The user may change it in Settings.

> **[DIVERGENCE — Edit Mode Insert at Cursor is Correct]** The design documents specify that clicking an action in Edit mode "inserts at cursor position." The current code calls `insertTextAtCursor(action_text)`, which is correct.

> **[DIVERGENCE — Hover Preview Verbosity]** The design described the hover preview as showing the "full text of the macro." The current implementation shows `'Macro Preview: "[text]" (Tag: [tag])'` which includes the tag. This is useful for management but may be excessively verbose for everyday use.

> **[INTENT — Grid Column Algorithm]** The penalty-weight approach (A, B, C) allows the user to tune the grid to their preference: more compact or more spacious.

> **[INTENT — Categories First Ordering]** Categories are shown before leaf actions so navigation buttons (folders) are always at the top, before the leaf actions.

> **[OPEN QUESTION — Basins of Attraction]** The "basins of attraction" hover-gravity feature (settings toggle `basins_of_attraction`) is not yet implemented. When implemented, it will need to interact with hover coloring of keyboard keys. See also R4.1 (Keyboard section).

---

## 7. Panel 3: Editor

### 7.1 Toolbar Buttons
| ID | Color | Full label | Short | Action |
|---|---|---|---|---|
| `btn-clear` | Gray | Del All | 🗑️ All | Sets `editor-box.value = ""`, resets `loadedActionTag = null`, resets `previousCaretPosition = 0`, refreshes predictions/keyboard coloring, restores focus to `editor-box`. Does NOT stop active TTS, cancel timers, or clear chat history. |
| `btn-del-word` | Gray | Del Word | ⌫ Word | If selection active: deletes selected range. If no selection: deletes from `selectionStart` backward to preceding word boundary (including trailing spaces). |
| `btn-del-char` | Gray | Del Char | ⌫ Char | If selection active: deletes selected range. If no selection: deletes the single character immediately preceding `selectionStart`. |
| `btn-dictate` | Purple | Dictate | 🎙️ Mic | Toggle audio recording |
| `btn-cloud-tts` | Green | @CloudTTS | ☁️ TTS | Cloud TTS of editor content |
| `btn-local-tts` | Green | @LocalTTS | 🔊 TTS | Local TTS of editor content |
| `btn-copy` | Green | Copy | 📋 Copy | Copy editor to clipboard |
| `btn-cloud` | Blue | @CloudAI | ✨ AI | Send editor to Cloud AI |
| `btn-save` | Orange | Save | 💾 Save | Save as macro (overwrites if `loadedActionTag` set) |
| `btn-save-as` | Orange | Save As... | 💾 As... | Save as macro (always prompts for tag) |

Same 4-step label-shrinking algorithm as Actions toolbar.

### 7.2 Editor Text Box
`<textarea id="editor-box" inputmode="none">`

- `inputmode="none"` prevents OS keyboard (except when "Use OS Keyboard" setting enabled)
- Variable height: 1–3 lines, computed by layout engine via `countEditorLines()`
- Caret color: green (`#10b981`). Selection: green with 30% opacity.

### 7.3 Save Behavior
- **Save**: If `loadedActionTag` set → overwrites that macro without prompting. Otherwise → prompts for tag (behaves like Save As).
- **Save As**: Always prompts via `#tag-prompt-modal`, pre-filled with current nav prefix.
- After save: `loadedActionTag` updated to the new tag.

> **[INTENT — Textarea Not ContentEditable]** The editor is a `<textarea>` (not a `contenteditable` div) because textarea has well-defined caret position APIs (`selectionStart`, `selectionEnd`).

> **[INTENT — inputmode="none" is Critical]** Without `inputmode="none"`, focusing the textarea on a tablet triggers the OS virtual keyboard, which would obscure the K2 keyboard. This was one of the earliest design decisions.

> **[INTENT — Editor Height 3 Lines]** The editor height is limited to 3 lines by the layout engine. The editor is for composing relatively short messages, not long documents. The 3-line limit also gives the layout engine a stable fixed height to work with.

> **[DIVERGENCE — Placeholder Disappears on Focus]** The `<textarea>` has `placeholder="Type here..."` which disappears once focus is gained. This means a blank, focused editor looks identical to a blank, unfocused editor from the user's perspective. Acceptable.

> **[INTENT — Toolbar Button Order]** Button order was designed by frequency of use: Del All/Word/Char (editing), Dictate/@CloudTTS/@LocalTTS/Copy (output), @CloudAI (primary AI action), Save/Save As (macro management, at the end).

> **[INTENT — loadedActionTag State]** `loadedActionTag` tracks which macro (if any) was loaded into the editor. When set, Save overwrites without prompting — enabling fast macro editing: click macro → edit in editor → Save, done.

> **[OPEN QUESTION — Show Loaded Macro Name]** There is no visual indicator in the UI that `loadedActionTag` is set and which macro would be overwritten on Save. See R2.4.

> **[RECOMMENDATION — R2.4 (Priority 2): Show Loaded Macro Name in Editor]**
> **Status: Proposed — not yet implemented or approved.**
>
> **Problem:** When a macro is loaded into the editor (Edit mode click), there is no visual indicator that pressing Save will overwrite a specific macro.
>
> **Recommendation:** Show a small label below or above the editor textarea: `"Editing macro: [tag]"` when `loadedActionTag` is non-null. Style it in amber/muted to distinguish from body text. Clear the label when: editor is cleared (`btn-clear`), Save As is used, or the editor value is changed to empty string.
>
> **Spec change when implemented:** Add `.loaded-macro-label` element to section 7.1 (structure). Add visibility rules to section 7.3 (Save Behavior).

---

## 8. Panel 4: Predictor

### 8.1 Layout
Two rows:
- **WORDS row** (`#word-predictions`) — word completion buttons (slate-blue `#2c3e50`)
- **PHRASES row** (`#phrase-predictions`) — phrase completion buttons (teal `#16a085`) + "Thinking..." label

### 8.2 Fixed Height
When open: `2 × min_target_height + 14px` (= 94px at defaults).

### 8.3 Word Prediction Buttons
Show prefix in dimmer color + suffix in full color. Clicking: replaces current word prefix at cursor with full word + trailing space. Clears `lastApiPredictions` cache.

### 8.4 Phrase Prediction Buttons
Clicking inserts `phrase + " "` at the current cursor position (`selectionStart`), preserving any text after the cursor. Caret (`selectionStart = selectionEnd`) is placed immediately after the inserted phrase+space. Does not replace existing editor text unless a range is selected. This applies in FIM mode as well — text after the cursor is not disturbed.

### 8.5 Horizontal Scrolling
Both rows support dwell-scroll (20% edge zones, ±18px/frame max) and click-drag slide (>6px drag threshold cancels tap).

> **[INTENT — Three-Layer Prediction]** The prediction system has three layers: (1) bigram statistics (instant, local) for keyboard coloring; (2) dictionary (instant, local) for word completion; (3) cloud AI (async, ~1–3s) for contextual word and phrase completion. Local layers provide instant feedback; cloud provides intelligent context-aware predictions.

> **[INTENT — Small Dictionary]** The dictionary is intentionally small (~200 words). A large dictionary would slow client-side filtering and is unnecessary: the cloud predictions provide contextual depth.

> **[INTENT — 400ms Debounce]** The 400ms debounce on cloud prediction fetches balances responsiveness against API call waste.

> **[DIVERGENCE — Profile Not Heavily Used for Word Prediction]** The predict-words API receives `profile_summary` but the AI prompt does not heavily emphasize using the profile for word prediction. A more profile-focused prompt could improve relevance.

> **[OPEN QUESTION — Mid-Word Phrase Clearing]** The phrases row clears when the user is in the middle of typing a word (not at a word boundary). This keeps the UI clean but may prevent useful phrase suggestions mid-word. Current behavior is intentional but could be reconsidered.

---

## 9. Panel 5: Keyboard

### 9.1 Layout (5 rows rendered by JS)
| Row | Keys |
|---|---|
| 0 | 1 2 3 4 5 6 7 8 9 0 |
| 1 | q w e r t y u i o p |
| 2 | a s d f g h j k l |
| 3 | z x c v b n m , . |
| 4 | Shift (flex:2)  Space (flex:4)  Backspace (flex:2) |

### 9.2 HSL Key Coloring
```
ratio = prob / maxObserved
hue   = ratio × 120    (0=red, 120=green)
sat   = 15 + ratio×65
lit   = 25 + ratio×15
```

### 9.3 Shift State
Toggled by clicking Shift. While active: uppercase display, next char is uppercase then resets to false (one-shot modifier).

### 9.4 Tap Handling
Dual touchstart + click handlers. `mousedown` calls `e.preventDefault()` to prevent editor blur.

Character insertion semantics for all K2 keyboard key presses:
- **Text selected** (`selectionStart !== selectionEnd`): The key action replaces the selected range. Character/Space keys replace selection with the new character; Backspace deletes the selected range.
- **No selection** (`selectionStart === selectionEnd`): Character and Space keys insert at `selectionStart`. Backspace deletes the single character immediately preceding `selectionStart`.
- After each key action: caret (`selectionStart = selectionEnd`) is set to the position immediately after the inserted/modified range, `previousCaretPosition` is updated, and focus is restored to `editor-box`.

### 9.5 Fixed Height (when open, docked mode)
`5 × min_target_height + 4 × button_gap_y + 8px` (= 224px at defaults).

### 9.6 Keyboard Modes
- **K2 Keyboard** (default): `inputmode="none"`, panel always visible
- **OS Keyboard**: `inputmode="text"`, panel hidden (`display: none`)
- **Auto-Hide K2**: `inputmode="none"`, panel visible but height=0 unless `.open` class present (added on editor focus, removed on blur)

> **[INTENT — HSL Coloring for Speed]** The HSL coloring provides a powerful visual cue: the user's eye is naturally drawn to green keys (high probability), which accelerates selection.

> **[INTENT — QWERTY Layout Familiarity]** QWERTY was chosen over alternatives (DVORAK etc.) because Kay is already familiar with it. Changing the layout would require relearning.

> **[INTENT — Shift as One-Shot Modifier]** Shift capitalizes the next typed character, then turns off automatically. Eye-gaze users benefit because it reduces the number of Shift toggles needed.

> **[INTENT — Fixed Height Formula]** `5 × min_target_height + 4 × button_gap_y + 8px` ensures each key row is exactly `min_target_height` tall with `button_gap_y` gaps, making every key always a valid gaze target.

> **[DIVERGENCE — Basins of Attraction Not Implemented]** The design documents describe a hover-gravity effect for the keyboard. The toggle exists in Settings (`basins_of_attraction`) but the feature has not been implemented. See R4.1.

> **[INTENT — Auto-Hide Mode]** Auto-hide was designed for users who sometimes want to use a physical keyboard but still want K2 keyboard available in the editor. The keyboard slides in when the editor is focused.

> **[OPEN QUESTION — Keyboard Animation]** Should auto-hide keyboard mode animate in/out (CSS transition) or appear/disappear instantly? Currently instant. See R2.3.

> **[RECOMMENDATION — R2.3 (Priority 2): Keyboard Slide-In Animation (Auto-Hide Mode)]**
> **Status: Proposed — not yet implemented or approved.**
>
> **Problem:** In auto-hide mode, the keyboard appears/disappears instantly (abrupt).
>
> **Recommendation:** Add CSS transition on the keyboard wrapper height:
> ```css
> .keyboard-panel-wrapper {
>   transition: height 0.2s ease-out;
>   overflow: hidden;
> }
> ```
> When `.open` class is toggled, the keyboard height transitions smoothly.
>
> **Spec change when implemented:** Update section 9.6 (Keyboard Modes, Auto-Hide entry) to mention the 0.2s height transition.

> **[RECOMMENDATION — R4.1 (Priority 4): Basins of Attraction (Eye-Gaze Gravity)]**
> **Status: Proposed — not yet implemented or approved.**
>
> **Planned feature:** When hovering near a key, a gravity effect makes the key feel larger and easier to target.
>
> **Architectural guidance:**
> - Implement as a `mousemove` listener on `#keyboard` that computes distance from each key center
> - When within a "basin radius" (e.g., 2× the key width), apply CSS `transform: scale(1.15)` to the key
> - Must be disabled when `basins_of_attraction` setting is 0
> - Must not interfere with the `touchstart` handler (touch ignores the gravity)
> - `renderKeyboard()` will need to track key center positions after DOM insertion
>
> **Spec change when implemented:** Add section 9.7 "Basins of Attraction" describing the gravity algorithm, basin radius formula, and interaction with touch events.

---

## 10. Layout Engine

### 10.1 Trigger Points
`scheduleRecalculateLayoutHeights(delay)` (debounced 50ms) called on: viewport resize/scroll, orientationchange (+200ms delay), editor focus/blur/input, panel collapse/expand, settings changes affecting keyboard mode.

### 10.2 Height Algorithm Summary

**Fixed heights (XF):**
- Collapsed panel → `LABEL_BAR_H = min_target_height`
- Actions open → `modeBar + breadcrumbBar + previewBar + 2px`
- Editor open → `toolbarHeight + 18px`
- Predictor open → `2 × min_target_height + 14px`
- Keyboard: 0 (OS mode), LABEL_BAR_H (auto-hide inactive), `5 × min_target_height + 4 × button_gap_y + 8px` (docked K2 open)

**Minimum variable heights:**
- `CV_min` = `clamp(1,3, chatLineCount) × lineHeight + 24px`
- `AV_min` = `clamp(1,3, actionRowCount) × rowHeight + 8px`
- `EV_min` = `editorLineCount × lineHeight + padding + border`

**Excess** = `available_H − sum(all minimums + dividers)`

**Distribution:**
- Excess > 0, only editor open: all to editor text box
- Wide mode: excess to top-row (Chat+Actions split 50/50 within)
- Narrow mode: excess split equally among open variable panels
- Excess < 0: panels at minimums; upper-workspace may scroll

All heights applied via `applyPanelHeight(el, px)` which sets `style.height/minHeight/maxHeight` and `flex = "0 0 auto"`.

> **[SIDEBAR — Fragile Area]** The layout engine is the most complex and historically regression-prone part of the UI. Any change that affects panel structure, CSS flex properties, padding, margin, min-height, or max-height CSS rules will break the layout engine's measurements. If such changes are needed, the layout engine's measurement code must be updated simultaneously. Test all panel collapse/expand combinations after any such change.

> **[INTENT — Most Complex Problem]** The layout engine was developed iteratively as the single hardest problem in K2's UI. The core challenge: the app must fill the full viewport with no overflow AND no outer scrolling, across all panel open/closed combinations, keyboard modes, screen sizes, and OS keyboard states.

> **[INTENT — Minimum Plus Excess Approach]** The algorithm prioritizes showing "just enough" content: chat log shows min 1–3 lines, actions shows min 1–3 rows, editor shows 1–3 lines. Extra space is allocated to expand them further. This ensures all panels are at least usably open.

> **[INTENT — applyPanelHeight Sets flex="0 0 auto"]** Setting `flex = "0 0 auto"` on panels overrides any CSS flex-grow/shrink. This is intentional: CSS flexbox cannot correctly distribute heights because the amount of excess is only known at runtime.

> **[DIVERGENCE — Pure CSS Abandoned]** The original design intent was a "pure CSS" layout using `flex` and `min-content` sizing. This was abandoned because OS virtual keyboard interaction made it impossible without JS viewport tracking. The JS-driven layout is now the permanent architecture.

> **[OPEN QUESTION — Defensive Divider Measurement]** The layout engine measures divider heights from the DOM, which breaks if dividers are restyled. See R1.4.

> **[RECOMMENDATION — R1.4 (Priority 1): Layout Engine Defensive Measurements]**
> **Status: Proposed — not yet implemented or approved.**
>
> **Problem:** The layout engine queries the DOM for divider heights, which breaks silently if dividers are restyled with different margins or padding.
>
> **Recommendation:**
> 1. Add a CSS custom property `--divider-total-height` equal to `height + marginTop + marginBottom` for each divider, and read this property in the layout engine instead of querying the DOM.
> 2. Add a developer-mode flag that logs all layout measurements to the console on each `recalculateLayoutHeights()` call.
>
> **Spec change when implemented:** Update section 10.2 to reference the CSS property rather than DOM queries for divider height measurement.

---

## 11. Action Mode System

### 11.1 Global State
`activeMode` (string, default `"Edit"`). Values: `"Edit"`, `"Delete"`, `"@CloudTTS"`, `"@LocalTTS"`, `"Copy"`, `"@CloudAI"`, `"Recolor"`.

### 11.2 Effect of Mode on Action Button Click
| Mode | Effect |
|---|---|
| `Edit` | `insertTextAtCursor(action_text)`, sets `loadedActionTag = tag` |
| `@CloudTTS` | `speakCloudTTS(action_text)` |
| `@LocalTTS` | `speakLocalTTS(action_text)` |
| `Copy` | Copies to clipboard, chat log confirmation |
| `Delete` | `confirm()` dialog then `deleteAction(tag)` |
| `@CloudAI` | Sets editor to `action_text`, calls `executeSendCloud()` |
| `Recolor` | Saves action with selected hex color |

**`loadedActionTag` mutation rule:** Only clicking an action button in `Edit` mode may set `loadedActionTag`. Clicking an action button in `@CloudTTS`, `@LocalTTS`, `Copy`, `Delete`, `@CloudAI`, or `Recolor` mode must NOT read or modify `loadedActionTag` in any way.

### 11.3 Effect of Mode on Category Click
- Normal/Edit/TTS/Copy/AI: drills into category
- Delete: modal to delete category + all children
- Recolor: modal to recolor all actions in category

### 11.4 Recolor Color Palette
Blue `#1f538d`, Green `#2ecc71`, Red `#e74c3c`, Orange `#e67e22`, Purple `#9b59b6`, Yellow `#f1c40f`, Teal `#1abc9c`, Pink `#e84393`, Gray `#475569`. Text color: black for Yellow/Green/Teal, white for all others.

> **[INTENT — Mode System Replaces Context Menus]** Instead of right-click → submenu → action, the user sets their mode once and then acts on as many buttons as needed. This is far more efficient for eye-gaze users who cannot right-click.

> **[INTENT — Edit as Default Mode]** Edit is the most common use case: clicking an action pastes its text into the editor for editing before sending.

> **[INTENT — @CloudAI for Direct-Fire Workflows]** @CloudAI mode allows one-tap automated workflows: click a macro that says "What is the weather today?" and the AI responds, without going through the editor.

> **[INTENT — Mode Toolbar in Actions Not Editor]** Mode selection conceptually belongs to the actions you take on macro buttons, not to the editor itself.

---

## 12. Text-to-Speech (TTS)

### 12.1 Cloud TTS
Backend: `POST /api/tts` → ElevenLabs `eleven_v3` model, `timeout=10.0s`. Returns `audio/mpeg`.

Frontend `speakCloudTTS(text)`:
- If already speaking → cancel instead
- Fetch `/api/tts` with voice ID, create `Audio` object, play
- Fallback on any failure → `speakLocalTTS(text)` (silent automatic fallback)
- Cancellation: `AbortController` + `audio.pause()`

Default voice: `URdpYjdnCOSIXKpzB6KE` ("Kay's beautiful voice 1").

### 12.2 Local TTS
`speakLocalTTS(text)` → Web Speech API `SpeechSynthesisUtterance`. Voice: `settings.local_tts_voice`. Fallback: English Google voice, then any English voice.

### 12.3 Conflict Prevention
When one TTS service is active, the other's button is disabled. When cloud TTS is active, `@CloudTTS` button shows "Speaking...", `@LocalTTS` is disabled. Vice versa for local.

### 12.4 TTS Trigger Points
- Editor toolbar: speaks full editor content
- Actions panel mode: speaks `action_text` directly
- Cloud AI XML operations: `<operation type="speak" phrase="..."/>` auto-triggers
- Timer expiry: speaks `"Timer finished for [label]"`

> **[INTENT — Two TTS Systems for Redundancy]** Cloud TTS (ElevenLabs `eleven_v3`) provides high quality with Kay's cloned voice. Local TTS (Web Speech API) is lower quality but offline and always available. Fallback from cloud to local is automatic and silent.

> **[INTENT — Cloned Voice is Primary]** Kay's cloned voice (voice ID `URdpYjdnCOSIXKpzB6KE`) is the first voice in the list because it is Kay's preferred voice for communication. Speaking in her own voice is a key feature.

> **[INTENT — Silent Automatic Fallback]** If ElevenLabs fails, the user still hears something rather than silence. The chat log shows "Cloud TTS failed. Falling back to local TTS."

> **[INTENT — Conflict Prevention]** Two voices overlapping simultaneously would be confusing. TTS conflict prevention ensures only one voice plays at a time.

> **[DIVERGENCE — Speaking Button Color Unchanged]** When TTS is active, the button text changes to "Speaking..." but the button color remains unchanged. Making the button visually distinct during speech (e.g., red pulsing) would improve feedback. See R3.1.

> **[RECOMMENDATION — R1.5 (Priority 1): Fix ElevenLabs TTS Timeout]**
> **Status: Proposed — not yet implemented or approved. (This is a bug fix.)**
>
> **Problem:** `backend/main.py` line 888 sets `timeout=10.0` on the `httpx` POST to ElevenLabs. The `eleven_v3` model takes approximately 1–2s per 10 words of text. At ~50+ words (~300 characters), generation routinely exceeds 10 seconds, causing a timeout exception. The backend returns HTTP 500, the frontend falls back to `@LocalTTS` silently.
>
> **Recommendation:** Increase the timeout to 45 seconds:
> ```python
> # backend/main.py line 888
> response = await httpx_client.post(url, json=data, headers=headers, timeout=45.0)
> ```
> 45 seconds comfortably covers several paragraphs of text. The frontend already has independent handling for very long TTS via the `AbortController` (user can cancel).
>
> **Spec change when implemented:** Update section 12.1 to read `timeout=45.0s` instead of `timeout=10.0s`.

> **[RECOMMENDATION — R3.1 (Priority 3): TTS Button Visual State During Speaking]**
> **Status: Proposed — not yet implemented or approved.**
>
> **Problem:** When TTS is active, the button text changes to "Speaking..." but the color stays the same, providing weak visual feedback.
>
> **Recommendation:** Add a `.speaking` CSS class to the active TTS button while speaking:
> ```css
> .btn.speaking {
>   animation: pulse-speaking 1s ease-in-out infinite alternate;
>   background-color: #ef4444 !important;
> }
> @keyframes pulse-speaking {
>   from { opacity: 0.8; }
>   to { opacity: 1.0; box-shadow: 0 0 12px rgba(239,68,68,0.8); }
> }
> ```
> Add `.speaking` in `speakCloudTTS()` / `speakLocalTTS()`, remove it in `resetCloudTTSButtons()` / `resetLocalTTSButtons()`.
>
> **Spec change when implemented:** Update section 12.3 (Conflict Prevention) to describe the `.speaking` class and its animation.

---

## 13. Cloud AI (Chat)

### 13.1 Triggering
`executeSendCloud(clearEditor)` called by: Enter key in editor (no Shift), @CloudAI toolbar button, action button in @CloudAI mode.

### 13.2 Retry Logic
Up to 3 attempts; 30s timeout per attempt; 1.5s delay between retries. Shows attempt count in "thinking" bubble.

If all 3 attempts fail: the `.thinking` element is removed from the DOM, and a `.chat-message.system` entry is appended to the chat log with the failure reason (e.g., `"Cloud AI request failed after 3 retries: [error message]"`). Error notifications MUST be logged as system messages — never as blocking browser dialogs (`alert()` or `confirm()`), which are inaccessible to eye-gaze users.

### 13.3 Context Sent
profile_summary, contacts_summary, settings_summary, macros_summary (saved macros + current suggestions), app_manual, home_assistant_url/token, last 10 chat messages as history.

### 13.4 AI Configuration
Model: `gemini-2.5-flash`. Tools: Google Search + Code Execution. History format: `types.Content` with role `"user"` or `"model"`. System instruction: ~800 words (K2 persona, operations, suggestions format).

### 13.5 Response Processing
1. Parse XML `<operation>` tags (backend + client)
2. Parse `<suggestions>` block → 3 `<action>` tags
3. Remove operation/suggestions tags from display text
4. Render markdown in chat log
5. Show 3 suggestion pills
6. Execute `client_actions` list

### 13.6 Auto Memory Extraction
After each AI response: background call to `/api/extract-memory` with last 6 turns. Returns profile/contact operations applied silently.

> **[INTENT — AI Persona as K2]** K2's AI has the persona of a knowledgeable companion for Kay. The system prompt is extensive (~800 words) because Kay's use cases are diverse: general knowledge, smart home control, image search, profile management, etc.

> **[INTENT — Always Ends with Suggestions]** The AI always ends with a `<suggestions>` block (3 options). After each AI response, the user sees 3 likely next actions and can click rather than type. This is fundamental to reducing typing burden.

> **[INTENT — Macro Summary in Every Request]** The macro summary is included in every chat request so the AI knows what macros exist. This allows the AI to reference, create, or manage macros in its responses.

> **[INTENT — Retry Logic]** Kay relies on K2 for communication. Silent failure is unacceptable. Up to 3 attempts with 30s timeout each was designed to handle transient network issues and Gemini API overload.

> **[DIVERGENCE — Memory System Works via Profile]** The design envisions K2 "remembering" facts across sessions via the profile and contacts. This is implemented (auto-extract-memory). The AI proactively uses profile data because `profile_summary` is included in every request.

> **[OPEN QUESTION — Disable Google Search / Code Execution]** Google Search and Python Code Execution tools are always enabled. Should there be a way to disable them from the UI?

> **[OPEN QUESTION — "Do you want me to:" Display]** The trailing "Do you want me to:..." sentence is redundant with the suggestion pills. Should it be stripped from the displayed response? See R3.3.

---

## 14. Prediction System

### 14.1 Word Predictions (Local + Cloud Blended)
- Local: hardcoded ~200-word dictionary with frequency weights
- Cloud: `POST /api/predict-words` → up to 15 `{word, weight}` predictions, cached in `lastApiPredictions`
- Blend: `alpha = 0.6` when cloud available (60% cloud, 40% local). Top 10 shown.
- Cloud fetch trigger: word boundaries (400ms debounce)

### 14.2 Phrase Predictions (Cloud Only)
`POST /api/predict-phrases` → 3 phrases.
- Continuation mode: predict next phrase given text before cursor
- FIM mode: predict text to fill gap between prefix and suffix (when text after cursor exists)
- Trigger: same as words (word boundary, 400ms debounce). Abort controller cancels in-flight requests.

### 14.3 Keyboard Probability Coloring
`getBlendedCharProbabilities(textBefore)` blends bigram statistics + word dictionary/API data → per-letter probability → HSL color on red→green gradient.

---

## 15. Data Stores

### 15.1 Settings Store Keys
| Key | Default | Description |
|---|---|---|
| `font_size_editor` | 32 | Editor font size (px) |
| `font_size_keyboard` | 24 | Keyboard key font size (px) |
| `min_target_width` | 50 | Min button width (px) → CSS `--min-target-width` |
| `min_target_height` | 40 | Min button/label height (px) → CSS `--min-target-height` |
| `button_gap_x` | 4 | Horizontal gap (px) → CSS `--button-gap-x` |
| `button_gap_y` | 4 | Vertical gap (px) → CSS `--button-gap-y` |
| `hover_brightness` | 1.2 | Hover brightness filter → CSS `--hover-brightness` |
| `basins_of_attraction` | 0 | Basin of attraction toggle (not yet implemented) |
| `use_os_keyboard` | 0 | 1 = use OS keyboard |
| `auto_hide_k2_keyboard` | 0 | 1 = auto-hide K2 keyboard |
| `home_assistant_url` | "" | HA base URL |
| `home_assistant_token` | "" | HA long-lived token |
| `biography_text` | "Name: Kay…" | Free-text profile |
| `biography_text_timestamp` | "" | ISO timestamp of last biography edit |
| `local_tts_voice` | "" | Local TTS voice name |
| `elevenlabs_voice` | "URdpYjdnCOSIXKpzB6KE" | ElevenLabs voice ID |
| `tag_separator` | "\|" | Hierarchy delimiter |
| `grid_penalty_a` | 1.0 | Penalty weight: below-fold fraction |
| `grid_penalty_b` | 1.0 | Penalty weight: 2-line labels |
| `grid_penalty_c` | 1.0 | Penalty weight: 3+ line labels |

### 15.2 Profile Store CRUD
`add`: appends to or creates category. `set`: overwrites. `delete` (no `old_content`): removes category. `delete` (with `old_content`): removes substring. `update`: replaces `old_content` substring with `content`.

### 15.3 Contacts Store CRUD
Same operations as profile. Value format: `"phone=xxx; email=xxx; relationship=xxx"`.

### 15.4 Macros Store Operations (via AI XML)
`add`/`set`: saves action. `delete`: removes action. No `update` action (use delete + add).

### 15.5 Actions CSV Import Format
For bulk import via Settings (`btn-import-actions-csv`), the expected CSV format is:
```csv
tag,action_text,color
"Greetings|Hello","Hello there!","#2ecc71"
"Greetings|Goodbye","Goodbye!","#2ecc71"
"Pete","Pete",""
```
- `tag`: Full hierarchical tag with separator characters
- `action_text`: The text content of the macro
- `color`: Hex color string (optional, may be empty)

> **[INTENT — Unified Dictionary Spec]** The add/set/update/delete operations with `old_content` allow the AI to perform precise edits to structured data without overwriting entire categories.

> **[INTENT — Fixed Preferred Profile Categories]** Preferred categories (User Info, Relationships, Interests, Schedule, Smart Home Setup, Medical Preferences) are fixed because the AI needs to know where to look for context, and consistent categories make the profile more useful.

> **[OPEN QUESTION — Profile/Contacts UI View]** Kay cannot see what the AI "knows" about her from within the app (except by asking the AI directly). A profile/contacts view in Settings would help. See R3.4 and R3.5.

> **[RECOMMENDATION — R4.4 (Priority 4): Document Actions CSV Format]**
> **Status: Proposed — not yet implemented or approved.**
>
> **Problem:** The CSV import for actions (`btn-import-actions-csv`) exists but the expected format is not documented in the app or user guide.
>
> **Recommendation:** The format is now documented in section 15.5 above. Additionally, add a tooltip or help text near the "Import Actions (CSV)" button in the Settings modal explaining the format, and consider generating an example CSV download button that shows a template.
>
> **Spec change when implemented:** Section 15.5 is already the spec change. Also update section 16.2 to note the tooltip/help text.

---

## 16. Settings

### 16.1 Settings Modal
Opened: `⚙️ Settings` button. Closed: "Close & Save" button at bottom.
Full-screen overlay (`z-index: 1000`), max-width 580px, scrollable content.

### 16.2 Settings Controls (in order)
1. Personal Profile textarea (`#biography-text`) + Compile button (`#btn-compile`, label: `Compile Profile from Text`)
2. Data Operations grid — exactly 8 buttons in a 2-column grid, in this order:
   - Row 1 (Profile): `📁 Import Profile (Text)` (`#btn-import-profile-file`) | `🧠 Update Profile from Chat Log` (`#btn-sync-memory`)
   - Row 2 (Contacts): `📇 Import Contacts (CSV)` (`#btn-import-contacts-file`) | `📤 Export Contacts (CSV)` (`#btn-export-contacts-csv`)
   - Row 3 (Actions): `⚡ Import Actions (CSV)` (`#btn-import-actions-csv`) | `📤 Export Actions (CSV)` (`#btn-export-actions-csv`)
   - Row 4 (Config): `📥 Import Config (JSON)` (`#btn-import-config`) | `⚙️ Export Config (JSON)` (`#btn-export-config`)
3. Editor/Keyboard font sizes
4. Button gaps (X, Y)
5. Hover brightness
6. Min target width/height
7. Grid penalties (A, B, C)
8. Home Assistant URL + Token
9. Basins of attraction toggle
10. Use OS Keyboard toggle
11. Auto-Hide K2 Keyboard toggle (hidden when OS Keyboard enabled)
12. ElevenLabs Voice select (live preview on change)
13. Local TTS Voice select
14. Action Tag Separator input
15. Close & Save button (`#btn-settings-close`, label: `Close & Save`)

### 16.3 Save Behavior
On close: all settings written to IndexedDB, `settings` object updated, CSS vars updated, `applyKeyboardSettings()` called. If tag separator changed: all macro tags migrated. If biography changed: timestamp recorded.

**Commit timing:** Settings form controls update only a temporary in-memory draft while the modal is open. Settings are committed to IndexedDB and the live `settings` object ONLY when `#btn-settings-close` is explicitly clicked. No `change` or `input` event on any settings control should write to IndexedDB or alter live behavior while the modal is open. The modal has no "Cancel" button; however, a future implementation that adds one must discard the draft without writing.

### 16.4 AI-Driven Settings
`<operation type="setting" action="set" key="..." content="..."/>`. Key normalized (underscores, abbreviations). Boolean values normalized (`1/true/on/enable/yes` → `"1"`, `0/false/off/disable/no` → `"0"`). Side effects applied immediately.

> **[INTENT — Dense Scrollable Form]** All settings in one scrollable form rather than multiple screens: Kay should not have to navigate between multiple settings pages.

> **[INTENT — Compile Profile Button]** Bridges the gap between natural language (Kay describes herself in plain English) and structured data (the AI needs key-value categories). Kay writes freely, clicks Compile, and the AI structures it.

> **[INTENT — 8-Button Data Operations Grid]** Provides complete data portability: Kay can import/export her entire configuration between devices or as backups.

> **[INTENT — Grid Penalty Sliders]** The A, B, C penalty sliders are an advanced setting. Default 1.0 weights give equal priority. Users preferring compactness might set B and C lower.

> **[DIVERGENCE — Tag Separator Migration Not Atomic]** When the tag separator is changed in Settings, all existing macro tags are migrated one by one. If the process is interrupted mid-migration (e.g., browser crash), some tags may have the old separator and others the new one. This edge case is acceptable given the rarity of separator changes.

> **[RECOMMENDATION — R3.4 (Priority 3): Profile View in Settings]**
> **Status: Proposed — not yet implemented or approved.**
>
> **Problem:** Kay cannot see the structured profile data the AI uses. The biography textarea shows the raw input, not the compiled categories.
>
> **Recommendation:** Add a read-only "Compiled Profile" display section to the Settings modal, below the Compile button, showing the current `personal_summary` store contents in a simple table (Category | Content). Add a "Clear Profile" button alongside it.
>
> **Spec change when implemented:** Add the profile display element and "Clear Profile" button to section 16.2.

> **[RECOMMENDATION — R3.5 (Priority 3): Contacts View in Settings]**
> **Status: Proposed — not yet implemented or approved.**
>
> **Problem:** There is no way to view, edit, or delete individual contacts from the UI (only via AI commands).
>
> **Recommendation:** Add a collapsible "Contacts" section to the Settings modal (using `<details>`) showing the contacts list with per-contact delete buttons. Format as a simple `Name | Value` list.
>
> **Spec change when implemented:** Add the contacts view element to section 16.2.

> **[RECOMMENDATION — R4.3 (Priority 4): Conversation Export]**
> **Status: Proposed — not yet implemented or approved.**
>
> **Problem:** Kay or Phil may want to export the chat log as a readable text file.
>
> **Recommendation:** Add an "Export Chat Log" button to the Settings Data Operations grid (a fifth row). Export as plain text: `[timestamp] User: ...\n[timestamp] AI: ...\n`. Also consider `window.print()` with a print-optimized stylesheet for PDF.
>
> **Spec change when implemented:** Add `btn-export-chat-log` to section 16.2.

---

## 17. Backend API Endpoints

### 17.1 `POST /api/chat`
Sends to Gemini with full context. Returns `{reply, suggestions, client_actions}`. Server retries 2× on error.

### 17.2 `POST /api/predict-words`
Returns `{predictions: [{word, weight}]}`. Up to 15 predictions.

### 17.3 `POST /api/predict-phrases`
Returns `{phrases: [str, str, str]}`. FIM mode when `text_suffix` non-empty.

### 17.4 `POST /api/tts`
Body: `{text, voice_id}`. Returns `audio/mpeg`. Uses ElevenLabs `eleven_v3`. Timeout: 10.0s *(see R1.5)*.

### 17.5 `POST /api/transcribe`
Body: `multipart/form-data` with audio file. Returns `{transcript}`. Uses Gemini audio transcription.

### 17.6 `GET /api/elevenlabs-voices`
Returns list of `{voice_id, name, preview_url}`. Fetches from ElevenLabs if key set; falls back to 3 default voices.

### 17.7 `POST /api/compile-profile`
Body: `multipart/form-data` with `profile_text`. Returns list of `{category, content}`. Uses Gemini.

### 17.8 `POST /api/extract-memory`
Body: `{history, profile_summary, contacts_summary}`. Returns `{client_actions, raw}`. Scans last 6 turns for new facts.

### 17.9 `POST /api/parse-bulk-file`
Body: `{file_content, target_store, mode, existing_context}`. Returns `{items}`. Fast CSV parser for contacts; Gemini for others.

> **[INTENT — Backend is Minimal]** The backend provides only the AI/TTS proxy functionality that cannot run client-side. All data storage, UI logic, and state management are client-side.

> **[INTENT — sanitize_history_content]** The `sanitize_history_content()` function strips base64 image data from history before sending to Gemini. This prevents the context window from being filled with binary data.

> **[OPEN QUESTION — No Authentication]** The backend has no authentication. Any client on the local network can call the AI and TTS endpoints, consuming API quota. For a single-user home deployment this is acceptable, but it is a security gap.

---

## 18. XML Operation System

### 18.1 Operations Table

The canonical operation `type` strings are listed below. **Each `type` has exactly one canonical string.** The system prompt must instruct the AI to use these exact strings, and the backend must route exactly these strings — no synonyms.

| `type` | Executed | Effect |
|---|---|---|
| `home_assistant` | Backend | Calls HA REST API; derives domain from `entity_id` prefix (e.g. `climate.thermostat` → domain `climate`, path `/api/services/climate/{service}`). Logs status to chat. |
| `speak` | Backend → frontend | Backend extracts `phrase` attribute; appends `{type: "speak", text: phrase}` to `client_actions`. Frontend calls `speakCloudTTS(phrase)`. |
| `inject` | Backend → frontend | Backend extracts `text` attribute; appends `{type: "copy", text}` to `client_actions`. Frontend calls `injectTextToEditor(text)` + clipboard. |
| `share` | Frontend | `navigator.share()` with `title`, `text`, `url` attributes; falls back to clipboard. |
| `email` | Frontend | Opens `mailto:{recipient}?subject={subject}&body={body}` URL. |
| `sms` | Frontend | Opens `sms:{phone}?body={message}` URL; copies body to clipboard as fallback. |
| `export_file` | Frontend | Downloads file blob with `filename` and `content` attributes. |
| `show_image` | Frontend | Renders `.k2-image-card` with `url` and `caption` attributes. `show_image` tags are **not** stripped from the reply text (unlike all other operation types) so the frontend can render the card inline. |
| `set_timer` | Frontend | JS countdown using `seconds` and `label` attributes; plays chime + TTS on expiry. |
| `set_alarm` | Frontend | Logs confirmation to chat only (no OS alarm). Uses `time` and `label` attributes. |
| `set_reminder` | Frontend | Logs confirmation to chat only (no OS reminder). Uses `time` and `label` attributes. |
| `profile` | Frontend | CRUD on `personal_summary` store. Attributes: `action` (add/set/update/delete), `key` (category), `content`, `old_content`. |
| `contact` | Frontend | CRUD on `contacts` store. Same attributes as profile. |
| `setting` | Frontend | Updates settings + applies side effects immediately. Attributes: `action` (always `set`), `key`, `content`. |
| `macro` | Frontend | CRUD on `saved_actions` store. Attributes: `action`, `key` (tag), `content` (action_text), `color`, `old_content`. |
| `get_web_image` | Backend | Wikipedia image search for `query` attribute → resolves to `show_image` client action. |
| `generate_image` | Backend | Gemini image generation for `prompt` attribute → resolves to `show_image` client action with base64 data URL. |

### 18.2 Suggestions Block
```xml
<suggestions>
  <action tag="Label" description="description">user action text</action>
  ...3 total...
</suggestions>
```
Tags truncated to 15 characters. Fallback: regex extraction of numbered list. Final fallback: 3 hardcoded defaults.

> **[INTENT — XML Format Over JSON]** XML is natively embedded in text (the AI produces a text response with embedded XML tags). The AI handles it reliably because it is trained on vast amounts of XML/HTML.

> **[INTENT — Server-Side Parsing]** Operations are parsed server-side (Python), which is more robust than JavaScript regex. Only client-side operations are passed to the frontend via `client_actions`.

> **[INTENT — Speak/Inject Two-Step]** `speak` and `inject` operations are handled server-side (via `thread_local` storage) and then executed client-side via `client_actions`. This two-step approach allows the backend to parse XML first, then the frontend executes in order.

> **[DIVERGENCE — set_alarm / set_reminder are Stubs]** `set_alarm` and `set_reminder` only log to the chat log — no actual OS alarm is set. On Windows there is no web API for system alarms. Current system messages say "⏰ Alarm set for {time}" which implies success when no OS alarm was set. See R2.5.

> **[DIVERGENCE — `get_web_image` Function Undefined]** In `backend/main.py`, the operation type `get_web_image` (and alias `get_image`) is routed to a Python call `get_web_image(query)` which does not exist — only `get_wikipedia_image()` is defined. If the AI emits `<operation type="get_web_image" .../>` (which the system prompt explicitly instructs it to do), the backend will raise a `NameError` and crash the request. **Intent:** `get_web_image` should route to `get_wikipedia_image()`. This is a pre-existing bug to be fixed.

> **[DIVERGENCE — Undocumented Operation Type Aliases]** The backend silently accepts multiple alias strings for the same operation: `get_image` (for `get_web_image`), `wikipedia_image` and `get_wikipedia_image` (for the Wikipedia image search), `generate_ai_image` and `ai_image` (for `generate_image`). These aliases were added ad-hoc as defensive coding but are not design intent — the canonical string is the only one that should be used. **Intent:** One canonical `type` string per operation, matching exactly between the AI system prompt and the backend router. The aliases should be removed once the canonical strings are confirmed.

> **[OPEN QUESTION — Misleading Alarm/Reminder Messages]** Should `set_alarm` and `set_reminder` messages clearly state that no OS alarm was set? See R2.5.

> **[RECOMMENDATION — R2.5 (Priority 2): Clarify Alarm/Reminder Stub Behavior]**
> **Status: Proposed — not yet implemented or approved.**
>
> **Problem:** `set_alarm` and `set_reminder` log messages implying success when no OS alarm is set, which may confuse Kay.
>
> **Recommendation:** Change the system messages to:
> - `"⏰ Alarm request noted for [time] ([label]). Note: K2 cannot set OS alarms — please set one manually."`
> - `"🔔 Reminder request noted for [time]: '[label]'. Note: K2 cannot set OS reminders — please set one manually."`
>
> **Spec change when implemented:** Update section 18.1 `set_alarm` and `set_reminder` rows to say "logs clarifying note to chat (no OS alarm/reminder created)".

> **[RECOMMENDATION — R4.5 (Priority 4): Complete Home Assistant Integration]**
> **Status: Proposed — not yet implemented or approved.**
>
> **Current state:** The backend `control_home_assistant()` sends REST calls to the HA API. The client-side `processClientAction()` for `op === "home_assistant"` only logs a stub message: `"🏠 [Home Assistant Operation] Stub called with arguments: ..."`.
>
> **Recommendation:** Update the client-side stub to show the actual HA service and entity: `"🏠 [service] sent to [entity_id]"`. Update the backend to return the HA API response status in the `client_actions` list so the frontend can confirm success or report errors.
>
> **Spec change when implemented:** Update section 18.1 `home_assistant` row to describe the complete flow including status feedback.

---

## 19. Accessibility and Input Handling

### 19.1 Minimum Target Sizes
All interactive elements: `min-height: var(--min-target-height)`, `min-width: var(--min-target-width)` (defaults: 40px / 50px).

### 19.2 Dwell Scrolling (Eye Gaze)
- **Vertical** (chat log, actions grid): hover within 15% of top/bottom → proportional scroll ±15px/frame
- **Horizontal** (all toolbar rows, prediction rows): hover within 20% of left/right → proportional scroll ±18px/frame

Also supports click-drag slide. Drag >4px cancels click.

### 19.3 Touch/Click Dual Handling
Touchstart fires immediately; click suppressed if `handledByTouch` active (300ms window). `mousedown` on keys calls `e.preventDefault()` to prevent editor blur.

### 19.4 Physical Keyboard Support
Global `window.keydown` listener: when editor is not the active element, letter/digit/Backspace/Delete routed to editor. Enter in editor = send to AI. Ctrl/Meta not intercepted.

### 19.5 No OS Virtual Keyboard
`inputmode="none"` on editor textarea prevents OS keyboard. Exception: "Use OS Keyboard" setting.

> **[INTENT — Dwell Scroll for Eye Gaze]** Dwell scroll is an alternative to scroll bar dragging (which requires fine motor control). Users only need to hold their gaze near the edge.

> **[INTENT — Drag-to-Slide for Mouse]** Click-drag slide on horizontal rows allows mouse users to browse predictions and macros that overflow the visible area.

> **[INTENT — Physical Keyboard Support]** The global `window.keydown` handler allows K2 to be used by users who can still type physically, routing keystrokes to the editor regardless of focus.

> **[DIVERGENCE — No Key Echo]** The design documents mention that a physical key press should briefly highlight the corresponding key on the K2 keyboard ("key echo"). This feature is not currently implemented.

> **[OPEN QUESTION — Switch Access]** K2 keyboard keys are `div` elements, not `button` elements with `tabindex`. This means the keyboard is not keyboard-navigable via Tab/Space/Enter (switch access). This is a significant accessibility gap for users who cannot use eye gaze.

---

## 20. Visual Design System

### 20.1 Color Tokens
```
--bg-app:        #030712  (Deep Slate-950)
--glass-bg:      rgba(15,23,42,0.65)  (Frosted Slate-900)
--glass-border:  rgba(255,255,255,0.08)
--color-primary: #3b82f6  (Blue)
--color-success: #10b981  (Emerald Green)
--color-warning: #f59e0b  (Amber)
--color-danger:  #ef4444  (Red)
--color-teal:    #0d9488
--color-text:    #f3f4f6  (Off-white)
--color-text-muted: #9ca3af  (Gray)
```

### 20.2 Button Color Classes
`btn-gray` (#475569/white), `btn-purple` (#9b59b6/white), `btn-green` (#2ecc71/black), `btn-blue` (#1f538d/white), `btn-orange` (#e67e22/white), `btn-red` (#ef4444/white), `btn-secondary` (#e2e8f0/black), `btn-teal` (#0d9488/black), `btn-primary` (#3b82f6/black), `btn-warning` (#f59e0b/black).

### 20.3 Hover Effects
All `.btn`: `filter: brightness(var(--hover-brightness))` (default 1.2). Action cards: white border on hover. Category cards/breadcrumbs: brighter amber + glow.

> **[SIDEBAR — Known inconsistency]** Action card hover uses `border-color` change rather than a brightness filter (unlike standard buttons). This inconsistency is noted as a future cleanup item.

### 20.4 Typography
- Font: `Outfit` (weights 300/400/600/800)
- Panel labels: 0.65rem, 800 weight, uppercase, letter-spacing 0.15em
- Chat messages: 0.95rem, line-height 1.35
- Editor box: `font_size_editor` px (default 32), line-height 1.3
- Keyboard keys: `font_size_keyboard` px (default 24)
- Action buttons: 0.8rem, 600 weight
- Mode buttons: clamp(0.65rem, 1.2vw, 0.8rem), 600 weight

### 20.5 Narrow-Mode Adjustments (≤768px)
- `--button-gap-x: 2px`
- Panel label width: 24px (from 30px)
- Panel label font: 0.55rem
- App padding: 4px sides

### 20.6 Dark Mode Only
Single dark theme. No light mode implemented.

> **[INTENT — Dark Theme for Eye Strain]** Dark theme reduces eye strain (important for long-duration use), creates visual hierarchy (panels float on dark background), and provides a modern, premium look that does not feel clinical.

> **[INTENT — Outfit Font]** Outfit was chosen for readability at small sizes (0.65rem panel labels) and visual character at large sizes (32px editor text). It works well across the full size range used.

> **[INTENT — Color Semantics]** Green = "go" / "play" (TTS, action buttons). Blue = AI (Gemini's color palette). Orange = save (data change, caution). Gray = delete/destructive (muted, not alarming).

> **[DIVERGENCE — Color Plus Icons is Correct]** The design documents note that color alone should not be the only differentiator. Current buttons use both color AND text/icon labels (short labels include emoji: 🗑️, ⌫, 🎙️, etc.), which is correct accessibility practice.

> **[INTENT — Hover Brightness Filter]** A 20% brightening (`1.2`) is subtle but visible. Configurable in settings so users can adjust based on their monitor and preference.

> **[OPEN QUESTION — Prediction Button Hover Feedback]** Should prediction buttons (WORDS row, PHRASES row) use a brightness filter on hover, or a different visual cue? Currently they use the same brightness filter as toolbar buttons.

---

*End of K2-web Master Specification*  
*Version: 2026-08-24*
