/* Tiny runtime include loader + basic UI hooks
   - Loads any element with [data-include="path.html"]
   - Wires modal open/close via [data-modal-target] and [data-modal-close]
   - Wires dark mode toggle via [data-toggle="dark"]
*/
const q = (s, r = document) => r.querySelector(s);
const qa = (s, r = document) => [...r.querySelectorAll(s)];

async function includePartials(root = document) {
  const nodes = qa("[data-include]", root);
  await Promise.all(nodes.map(async (el) => {
    const url = el.getAttribute("data-include");
    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      el.innerHTML = await res.text();
      el.removeAttribute("data-include");
      // Recursively process nested includes
      await includePartials(el);
    } catch (err) {
      console.error("Include failed:", url, err);
      el.innerHTML = `<div class="include-error">Failed to load ${url}</div>`;
    }
  }));
}

function wireModals() {
  const idFor = (name) => `modal-${name}`;
  // Open
  document.addEventListener("click", (e) => {
    const openBtn = e.target.closest("[data-modal-target]");
    if (!openBtn) return;
    e.preventDefault();
    const name = openBtn.getAttribute("data-modal-target");
    const dlg = q(`#${idFor(name)}`);
    if (dlg && typeof dlg.showModal === "function") dlg.showModal();
  });
  // Close
  document.addEventListener("click", (e) => {
    const closeBtn = e.target.closest("[data-modal-close]");
    if (!closeBtn) return;
    const dlg = e.target.closest("dialog");
    if (dlg && typeof dlg.close === "function") dlg.close();
  });
}

function wireHeader() {
  const year = q("#year");
  if (year) year.textContent = new Date().getFullYear();

  const mobileBtn = q("#btn-open-mobile");
  const mobileAcc = q("#mobile-accordions");
  if (mobileBtn && mobileAcc) {
    mobileBtn.addEventListener("click", () => {
      const open = mobileBtn.getAttribute("aria-expanded") === "true";
      mobileBtn.setAttribute("aria-expanded", String(!open));
      mobileAcc.toggleAttribute("open"); // CSS can show/hide by [open]
      mobileAcc.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}

function wireToggles() {
  // Dark mode
  document.addEventListener("click", (e) => {
    const btn = e.target.closest('[data-toggle="dark"]');
    if (!btn) return;
    document.documentElement.classList.toggle("dark");
    // persist
    try { localStorage.setItem("pmr.dark", document.documentElement.classList.contains("dark") ? "1" : "0"); } catch {}
  });
  // Restore
  try {
    const saved = localStorage.getItem("pmr.dark");
    if (saved === "1") document.documentElement.classList.add("dark");
  } catch {}
}

function wireChat() {
  const form = q(".chat-input");
  const stream = q(".chat-stream");
  if (!form || !stream) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = q("#user-msg");
    const text = (input?.value || "").trim();
    if (!text) return;
    stream.insertAdjacentHTML("beforeend", `<div class="bubble user"></div>`);
    stream.lastElementChild.textContent = text;
    input.value = "";
    // Stubbed bot echo
    setTimeout(() => {
      stream.insertAdjacentHTML("beforeend", `<div class="bubble bot"></div>`);
      stream.lastElementChild.textContent = "Got it. (Stub reply)";
      stream.lastElementChild.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 200);
  });
}

async function boot() {
  await includePartials();
  wireModals();
  wireHeader();
  wireToggles();
  wireChat();
  // Reveal desktop asides after partials load; CSS will hide/show by breakpoint
  q("#aside-left")?.removeAttribute("hidden");
  q("#aside-right")?.removeAttribute("hidden");
}
document.addEventListener("DOMContentLoaded", boot);
