# K2-web Visual Baseline Screenshots

These screenshots represent the **correct, approved visual state** of the K2-web application as of **2026-08-25**, calibrated to target device profiles (iPad Landscape and iPhone Portrait) at 1:1 pixel scaling (1.0 DPR). They are used as regression references when making UI changes.

## Baseline States

| File | Description | Target Device Profile | Viewport |
|---|---|---|---|
| `01_ipad_landscape_default.png` | Default startup state — all panels open, wide side-by-side layout | iPad Landscape (11" Pro/Air) | 1194 x 834 |
| `02_iphone_portrait_default.png` | Default startup state — narrow stacked layout | iPhone Portrait (Standard) | 390 x 844 |
| `03_ipad_chat_collapsed.png` | Chat panel collapsed — Actions panel expands to fill column | iPad Landscape | 1194 x 834 |
| `04_ipad_actions_drilled.png` | Actions panel drilled into category folder showing breadcrumb nav (Home \| Greetings) | iPad Landscape | 1194 x 834 |
| `05_ipad_editor_typing.png` | Editor with typed text — keyboard shows HSL probability key coloring | iPad Landscape | 1194 x 834 |
| `06_ipad_predictor_active.png` | Predictor panel — active word and phrase suggestions after typing | iPad Landscape | 1194 x 834 |
| `07_ipad_settings_modal.png` | Settings modal open over the app | iPad Landscape | 1194 x 834 |

## How to Use

When making **any UI change** (HTML structure, CSS, JS layout logic):

1. Before your change, note which baseline states your change could affect.
2. After your change, run the app locally and compare the current UI against the relevant baseline images.
3. If the change is intentional and approved, **refresh the baseline** (see below).
4. If the change is unintentional, it is a regression — revert it.

## How to Refresh the Baseline

If a visual change is intentionally approved by Phil:

1. Run the app locally: `.venv\Scripts\uvicorn backend.main:app --host 127.0.0.1 --port 8000`
2. Navigate to each affected state on the target viewport sizes (iPad 1194x834, iPhone 390x844).
3. Replace the relevant file(s) in this directory.
4. Update this README's date and any changed state descriptions.
5. Commit with message: `Update visual baseline: [description of change]`

## Spec Reference

Visual baseline states correspond to the following sections of `documents/master_specification.md`:
- Section 3 (Application Shell and Viewport) — wide/narrow mode, safe areas
- Section 4 (Panel System) — collapse/expand behavior
- Section 6 (Actions Panel) — category drill-down & breadcrumbs
- Section 7 (Editor Panel) — editor text box and toolbar
- Section 8 (Predictor Panel) — word/phrase rows
- Section 9 (Keyboard Panel) — HSL key coloring
- Section 16 (Settings) — settings modal
