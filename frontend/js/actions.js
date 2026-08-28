// --- Actions & Hierarchical Tag Navigation ES Module ---

let currentNavPath = [];
let hoverTimeoutId = null;
let resetTimeoutId = null;
let canvasContext = null;

export function getCurrentNavPath() {
  return currentNavPath;
}

export function setCurrentNavPath(path) {
  currentNavPath = Array.isArray(path) ? path : [];
}

export function resetNavPath() {
  currentNavPath = [];
  return currentNavPath;
}

export function getCurrentSeparator(tagSeparator = "|") {
  return tagSeparator || "|";
}

export function getCurrentPrefix(tagSeparator = "|") {
  const sep = getCurrentSeparator(tagSeparator);
  if (currentNavPath.length === 0) return "";
  return currentNavPath.join(sep) + sep;
}

export function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function setupHoverPreview(element, text) {
  if (!element) return;
  element.onmouseenter = () => {
    if (resetTimeoutId) {
      clearTimeout(resetTimeoutId);
      resetTimeoutId = null;
    }
    if (hoverTimeoutId) {
      clearTimeout(hoverTimeoutId);
    }
    hoverTimeoutId = setTimeout(() => {
      const previewEl = document.getElementById("actions-preview");
      if (previewEl) previewEl.textContent = text;
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
      const previewEl = document.getElementById("actions-preview");
      if (previewEl) previewEl.textContent = "Hover over an action to preview...";
      resetTimeoutId = null;
    }, 2000);
  };
}

export function getCanvasContext() {
  if (!canvasContext) {
    const canvas = document.createElement("canvas");
    canvasContext = canvas.getContext("2d");
  }
  return canvasContext;
}

export function evaluateLabelLines(ctx, label, availWidth) {
  if (availWidth <= 0) return 3;
  ctx.font = "600 12.8px Outfit, sans-serif";
  const fullW = ctx.measureText(label).width;
  if (fullW <= availWidth) return 1;

  const words = label.split(/\s+/);
  let linesCount = 1;
  let currentLineW = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const wordW = ctx.measureText(word).width;
    if (wordW > availWidth) {
      return 3; // Word doesn't fit horizontally -> mid-word break required
    }
    const spaceW = (currentLineW > 0) ? ctx.measureText(" ").width : 0;
    if (currentLineW + spaceW + wordW <= availWidth) {
      currentLineW += spaceW + wordW;
    } else {
      linesCount++;
      currentLineW = wordW;
    }
  }

  return linesCount;
}

export function chooseGridColumns(settings = {}) {
  const grid = document.getElementById("actions-grid");
  if (!grid) return;

  const cards = grid.querySelectorAll(".action-card");
  const totalButtons = cards.length;
  if (totalButtons === 0) return;

  const labels = Array.from(cards).map(card => card.textContent || "");

  const gridWidth = grid.clientWidth - 8; // subtract padding
  const gridHeight = grid.clientHeight;
  if (gridWidth <= 0) return;

  const minTargetWidth = settings.min_target_width || 50;
  const minTargetHeight = settings.min_target_height || 40;
  const buttonGapX = settings.button_gap_x || 4;
  const buttonGapY = settings.button_gap_y || 4;

  const penA = settings.grid_penalty_a ?? 1.0;
  const penB = settings.grid_penalty_b ?? 1.0;
  const penC = settings.grid_penalty_c ?? 1.0;

  const maxColumns = Math.max(1, Math.floor((gridWidth + buttonGapX) / (minTargetWidth + buttonGapX)));
  const visibleRows = Math.max(1, Math.floor((gridHeight + buttonGapY) / (minTargetHeight + buttonGapY)));

  const ctx = getCanvasContext();
  let bestC = 1;
  let minPenalty = Infinity;

  for (let c = 1; c <= maxColumns; c++) {
    const btnW = (gridWidth - (c - 1) * buttonGapX) / c;
    const availTextW = btnW - 12;

    const visibleCapacity = visibleRows * c;
    const outsideCount = Math.max(0, totalButtons - visibleCapacity);
    const outsideFrac = outsideCount / totalButtons;

    let twoLinerCount = 0;
    let badLinerCount = 0;

    for (let i = 0; i < totalButtons; i++) {
      const lines = evaluateLabelLines(ctx, labels[i], availTextW);
      if (lines === 2) {
        twoLinerCount++;
      } else if (lines >= 3) {
        badLinerCount++;
      }
    }

    const twoLinerFrac = twoLinerCount / totalButtons;
    const badLinerFrac = badLinerCount / totalButtons;

    const penalty = penA * outsideFrac + penB * twoLinerFrac + penC * badLinerFrac;

    if (penalty <= minPenalty) {
      minPenalty = penalty;
      bestC = c;
    }
  }

  grid.style.gridTemplateColumns = `repeat(${bestC}, minmax(0, 1fr))`;
}

export function renderActionsNavBar(tagSeparator = "|", onNavigate) {
  const navBar = document.getElementById("actions-nav-bar");
  if (!navBar) return;
  navBar.innerHTML = "";

  const sep = getCurrentSeparator(tagSeparator);

  // Home root button (Home icon only)
  const homeBtn = document.createElement("button");
  homeBtn.className = "nav-breadcrumb-btn nav-home-btn" + (currentNavPath.length === 0 ? " active" : "");
  homeBtn.innerHTML = "🏠";
  homeBtn.title = "Home";
  homeBtn.onclick = () => {
    currentNavPath = [];
    if (typeof onNavigate === "function") onNavigate();
  };
  navBar.appendChild(homeBtn);

  // Subtag breadcrumb buttons
  currentNavPath.forEach((subtag, idx) => {
    const sepSpan = document.createElement("span");
    sepSpan.className = "nav-breadcrumb-sep";
    sepSpan.textContent = sep;
    navBar.appendChild(sepSpan);

    const btn = document.createElement("button");
    const isLast = (idx === currentNavPath.length - 1);
    btn.className = "nav-breadcrumb-btn" + (isLast ? " active" : "");
    btn.textContent = subtag;
    btn.title = `Navigate to ${currentNavPath.slice(0, idx + 1).join(` ${sep} `)}`;
    btn.onclick = () => {
      currentNavPath = currentNavPath.slice(0, idx + 1);
      if (typeof onNavigate === "function") onNavigate();
    };
    navBar.appendChild(btn);
  });
}

/**
 * Renders hierarchical action cards and category folder buttons in the grid.
 */
export function renderActionsGrid(savedActions, options = {}) {
  const {
    tagSeparator = "|",
    activeMode = "Edit",
    settings = {},
    onCategoryClick,
    onActionClick,
    onNavigate
  } = options;

  renderActionsNavBar(tagSeparator, onNavigate);

  const grid = document.getElementById("actions-grid");
  if (!grid) return;
  grid.innerHTML = "";

  const sep = getCurrentSeparator(tagSeparator);
  const currentPrefix = getCurrentPrefix(tagSeparator);

  const categoriesMap = new Map(); // subtag -> array of child actions
  const directActions = []; // array of action objects at current level

  (savedActions || []).forEach(action => {
    const tag = action.tag || "";
    if (currentPrefix === "" || tag.startsWith(currentPrefix)) {
      const remaining = currentPrefix === "" ? tag : tag.substring(currentPrefix.length);
      const parts = remaining.split(sep);
      if (parts.length === 1) {
        // Direct leaf action at current level
        directActions.push({
          ...action,
          leafLabel: parts[0] || tag
        });
      } else if (parts.length > 1) {
        // Interior category at next level
        const catName = parts[0];
        if (!categoriesMap.has(catName)) {
          categoriesMap.set(catName, []);
        }
        categoriesMap.get(catName).push(action);
      }
    }
  });

  // Sort Categories alphabetically A-Z
  const sortedCategories = Array.from(categoriesMap.keys()).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );

  // Sort Direct Actions alphabetically A-Z
  directActions.sort((a, b) =>
    (a.leafLabel || "").localeCompare(b.leafLabel || "", undefined, { sensitivity: "base" })
  );

  // 1. Render Categories First (Yellow Chamfered Folder Polygon Buttons)
  sortedCategories.forEach(catName => {
    const card = document.createElement("div");
    card.className = "action-card category-card";
    card.textContent = catName;

    const childCount = categoriesMap.get(catName).length;
    setupHoverPreview(card, `Category: "${catName}" (${childCount} action${childCount === 1 ? "" : "s"})`);

    card.onclick = () => {
      if (typeof onCategoryClick === "function") {
        onCategoryClick(catName);
      }
    };

    grid.appendChild(card);
  });

  // 2. Render Actions Next
  directActions.forEach(action => {
    const card = document.createElement("div");
    card.className = "action-card";
    card.textContent = action.leafLabel;

    // Apply macro card background colors if set in database
    if (action.color) {
      card.style.backgroundColor = action.color;
      const isBright = ["#2ecc71", "#f1c40f", "#1abc9c", "Yellow", "Green", "Teal"].some(c => action.color.includes(c));
      card.style.color = isBright ? "black" : "white";
    }

    setupHoverPreview(card, `Macro Preview: "${action.action_text}" (Tag: ${action.tag})`);

    card.onclick = async () => {
      if (typeof onActionClick === "function") {
        onActionClick(action.tag, action.action_text);
      }
    };

    grid.appendChild(card);
  });

  chooseGridColumns(settings);
}

export function showCategoryDeleteModal(catName, catPrefix, onConfirm) {
  const modal = document.getElementById("category-delete-modal");
  const msg = document.getElementById("category-delete-msg");
  const btnYes = document.getElementById("btn-category-delete-yes");
  const btnNo = document.getElementById("btn-category-delete-no");
  if (!modal) return;

  msg.textContent = `Do you really want to delete the category "${catName}" and everything in it?`;
  modal.style.display = "flex";

  btnYes.onclick = async () => {
    modal.style.display = "none";
    if (typeof onConfirm === "function") await onConfirm();
  };

  btnNo.onclick = () => {
    modal.style.display = "none";
  };
}

export function showCategoryRecolorModal(catName, catPrefix, chosenColorName, onConfirm) {
  const modal = document.getElementById("category-recolor-modal");
  const msg = document.getElementById("category-recolor-msg");
  const btnYes = document.getElementById("btn-category-recolor-yes");
  const btnNo = document.getElementById("btn-category-recolor-no");
  if (!modal) return;

  msg.textContent = `Do you really want to recolor every action in category "${catName}" to ${chosenColorName}?`;
  modal.style.display = "flex";

  btnYes.onclick = async () => {
    modal.style.display = "none";
    if (typeof onConfirm === "function") await onConfirm();
  };

  btnNo.onclick = () => {
    modal.style.display = "none";
  };
}

export async function migrateTagSeparators(oldSep, newSep, getSavedActionsFn, deleteActionFn, saveActionFn) {
  if (!oldSep || !newSep || oldSep === newSep) return;
  const allActions = await getSavedActionsFn();
  let changed = 0;
  for (const action of allActions) {
    if (action.tag && action.tag.includes(oldSep)) {
      const newTag = action.tag.split(oldSep).join(newSep);
      await deleteActionFn(action.tag);
      await saveActionFn(newTag, action.action_text, action.color);
      changed++;
    }
  }
  if (changed > 0) {
    console.log(`Migrated ${changed} action tags from separator '${oldSep}' to '${newSep}'`);
  }
}
