// --- Chat Log & Markdown Formatting ES Module ---

/**
 * Builds responsive image card HTML with QuickChart JSON URL encoding and fallbacks.
 */
export function buildImageCard(rawUrl, cap) {
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

/**
 * Handles image load errors with Wikipedia REST API thumbnail fallback.
 */
export async function handleImageLoadError(imgEl, altText) {
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

// Make handleImageLoadError available globally for inline HTML onerror handlers
if (typeof window !== "undefined") {
  window.handleImageLoadError = handleImageLoadError;
}

/**
 * Formats markdown syntax safely with XSS prevention and image card restoration.
 */
export function formatMarkdownContent(text) {
  if (!text) return "";

  // --- Step 0: Extract image tags into numbered placeholders BEFORE any escaping ---
  const imgCards = [];
  let html = text;

  // <operation type="show_image" url="..." caption="..."/>  — double-quoted url
  html = html.replace(/<operation\s+type=["']show_image["']\s+url="([^"]+)"(?:\s+caption="([^"]*)")?\s*\/?>/gi,
    (m, url, cap) => { const i = imgCards.length; imgCards.push(buildImageCard(url, cap || "")); return `\x00IMG${i}\x00`; });

  // <operation type="show_image" url='...' caption='...'/>  — single-quoted url
  html = html.replace(/<operation\s+type=["']show_image["']\s+url='([^']+)'(?:\s+caption='([^']*)')?\s*\/?>/gi,
    (m, url, cap) => { const i = imgCards.length; imgCards.push(buildImageCard(url, cap || "")); return `\x00IMG${i}\x00`; });

  // Markdown images: ![alt](url)
  html = html.replace(/!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g,
    (m, alt, url) => { const i = imgCards.length; imgCards.push(buildImageCard(url, alt || "")); return `\x00IMG${i}\x00`; });

  // Legacy: raw <div><img></div> blocks stored by older handlers
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

export function msgToHtml(msg) {
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

export function createChatMessageElement(msg, onSuggestionClick) {
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
        if (typeof onSuggestionClick === "function") {
          onSuggestionClick(sug.action_text);
        }
      };
      sugCont.appendChild(btn);
    });
    div.appendChild(sugCont);
  }
  return div;
}

export function renderSingleChatMessage(msg, onSuggestionClick) {
  const log = document.getElementById("chat-log-scroll");
  if (!log) return;

  const div = createChatMessageElement(msg, onSuggestionClick);

  const thinkingDiv = log.querySelector(".thinking");
  if (thinkingDiv) {
    log.insertBefore(div, thinkingDiv);
  } else {
    log.appendChild(div);
  }

  log.scrollTo({ top: log.scrollHeight, behavior: "smooth" });
}

export async function renderChatLog(getChatHistoryFn, force = false, onSuggestionClick) {
  const log = document.getElementById("chat-log-scroll");
  if (!log) return;

  if (force || log.children.length === 0) {
    log.innerHTML = "";
    const list = typeof getChatHistoryFn === "function" ? await getChatHistoryFn() : [];
    list.forEach(msg => {
      const div = createChatMessageElement(msg, onSuggestionClick);
      log.appendChild(div);
    });
    log.scrollTop = log.scrollHeight;
  }
}
