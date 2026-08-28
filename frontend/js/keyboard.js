// --- Virtual Keyboard ES Module ---

export const KEYBOARD_LAYOUT = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m", ",", "."],
  ["Shift", "Space", "Backspace"]
];

let shiftActive = false;

export function isShiftActive() {
  return shiftActive;
}

export function setShiftActive(val) {
  shiftActive = !!val;
}

export function toggleShift() {
  shiftActive = !shiftActive;
  return shiftActive;
}

/**
 * Computes dynamic HSL key color based on character probability relative to max observed probability.
 * Hue: 0 (Red/gray) -> 120 (Green)
 * Saturation: 15% -> 80%
 * Lightness: 25% -> 40%
 */
export function computeKeyHsl(prob, maxObserved) {
  const ratio = maxObserved > 0 ? Math.min(1.0, prob / maxObserved) : 0;
  const hue = Math.round(ratio * 120);
  const sat = Math.round(15 + ratio * 65);
  const lit = Math.round(25 + ratio * 15);
  return {
    bg: `hsl(${hue}, ${sat}%, ${lit}%)`,
    border: `hsl(${hue}, ${sat}%, ${lit + 5}%)`
  };
}

/**
 * Renders the virtual keyboard with dynamic HSL coloring and zero-lag touch/click handlers.
 * @param {Object} probabilities - Map of char -> probability (e.g. { 'a': 0.08, 't': 0.12 })
 * @param {number} fontSize - Font size in px for key text
 * @param {Function} onKeyAction - Callback invoked when a key is tapped: (keyName, wasShifted) => void
 */
export function renderKeyboard(probabilities, fontSize = 24, onKeyAction) {
  const container = document.getElementById("keyboard");
  if (!container) return;
  container.innerHTML = "";

  const probs = probabilities || {};
  const probValues = Object.values(probs);
  const maxObserved = probValues.length > 0 ? Math.max(...probValues) : 0;

  KEYBOARD_LAYOUT.forEach((row, rowIdx) => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "keyboard-row";

    row.forEach(key => {
      const keyBtn = document.createElement("div");
      keyBtn.className = "key";
      keyBtn.style.fontSize = `${fontSize}px`;

      if (rowIdx === 4) {
        // Special bottom row: Shift, Space, Backspace
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
        const prob = probs[key.toLowerCase()] || 0;
        const hsl = computeKeyHsl(prob, maxObserved);
        keyBtn.style.backgroundColor = hsl.bg;
        keyBtn.style.borderColor = hsl.border;
      }

      // Key Tap dispatch handlers (0ms touch response + mouse compatibility)
      let handledByTouch = false;

      const executeKeyAction = () => {
        if (typeof onKeyAction === "function") {
          onKeyAction(key, shiftActive);
        }
      };

      keyBtn.addEventListener("mousedown", (e) => e.preventDefault());

      keyBtn.addEventListener("touchstart", (e) => {
        e.preventDefault(); // Prevent editor blur and OS virtual keyboard popup
        handledByTouch = true;
        executeKeyAction();
        setTimeout(() => { handledByTouch = false; }, 300);
      });

      keyBtn.onclick = (e) => {
        if (handledByTouch) return;
        executeKeyAction();
      };

      rowDiv.appendChild(keyBtn);
    });

    container.appendChild(rowDiv);
  });
}
