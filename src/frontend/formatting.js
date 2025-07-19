// formatting.js

export function applyFormattingSettings(settings) {
  document.querySelectorAll(".ebook-section").forEach((section) => {
    const textArea = section.querySelector("textarea");
    if (textArea) {
      textArea.style.fontFamily = settings.fontFamily;
      textArea.style.fontSize = settings.fontSize;
      textArea.style.lineHeight = settings.lineHeight;
      textArea.style.textAlign = settings.textAlign;
      textArea.style.marginTop = settings.marginTop;
      textArea.style.marginRight = settings.marginRight;
      textArea.style.marginBottom = settings.marginBottom;
      textArea.style.marginLeft = settings.marginLeft;
    }
  });
}

export function getFormattingSettings() {
  return {
    fontFamily: document.getElementById("font_family")?.value || "Inter",
    fontSize: document.getElementById("font_size")?.value || "14px",
    lineHeight: document.getElementById("line_spacing")?.value || "1.6",
    textAlign: document.getElementById("text_align")?.value || "justify",
    marginTop: document.getElementById("margin_top")?.value || "1in",
    marginRight: document.getElementById("margin_right")?.value || "1in",
    marginBottom: document.getElementById("margin_bottom")?.value || "1in",
    marginLeft: document.getElementById("margin_left")?.value || "1in",
  };
}

export function saveFormattingToLocalStorage(settings) {
  localStorage.setItem("ebook_formatting_settings", JSON.stringify(settings));
}

export function loadFormattingFromLocalStorage() {
  const saved = localStorage.getItem("ebook_formatting_settings");
  if (!saved) return;
  const settings = JSON.parse(saved);
  Object.entries(settings).forEach(([key, value]) => {
    const el = document.getElementById(key);
    if (el) el.value = value;
  });
  return settings;
}

export function initFormattingHandlers() {
  const saveBtn = document.getElementById("saveFormattingBtn");
  if (!saveBtn) return;

  saveBtn.addEventListener("click", () => {
    const settings = getFormattingSettings();
    saveFormattingToLocalStorage(settings);
    applyFormattingSettings(settings);
    toast("✅ Formatting saved and applied");
  });

  const loaded = loadFormattingFromLocalStorage();
  if (loaded) applyFormattingSettings(loaded);
}
