// 📘 generate.js – LaunchBook AI Generator Logic (Live Preview, Formatting, Regeneration)

let previewData = [];

function initGenerator() {
  const generateBtn = document.querySelector("#generateBtn") || document.querySelector(".generate-btn")
  if (!generateBtn) return;

  generateBtn.addEventListener("click", async () => {
    const url = document.querySelector("input[type='url']").value.trim();
    const title = document.querySelector("input[placeholder='Book Title']").value.trim();
    const author = document.querySelector("input[placeholder='Author Name']").value.trim();
    const description = document.querySelector("textarea[placeholder='Brief description...']").value.trim();
    const instructions = document.querySelector("textarea[placeholder='AI instruction or style preference...']").value.trim();

    const outputFormat = document.querySelector("input[name='output_format']:checked").value;

    const font = document.querySelector("select[name='font']")?.value || "Inter";
    const fontSize = document.querySelector("select[name='font_size']")?.value || "12pt";
    const spacing = document.querySelector("select[name='line_spacing']")?.value || "1.5";
    const pageSize = document.querySelector("select[name='page_size']")?.value || "A4";

    const audience = document.querySelector("select[name='audience']")?.value;
    const tone = document.querySelector("select[name='tone']")?.value;
    const purpose = document.querySelector("select[name='purpose']")?.value;

    const affiliateLink = document.querySelector("input[placeholder='Affiliate Link']")?.value;
    const keywords = document.querySelector("input[placeholder='Trigger Keywords (comma separated)']")?.value;

    const payload = {
      url,
      title,
      author,
      description,
      instructions,
      outputFormat,
      font,
      fontSize,
      spacing,
      pageSize,
      audience,
      tone,
      purpose,
      affiliateLink,
      keywords,
    };

    showToast("Generating...", "loading");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to generate");
      const data = await res.json();

      previewData = data.sections || [];
      renderPreview();
      showToast("eBook generated!", "success");
    } catch (err) {
      console.error(err);
      showToast("Generation failed.", "error");
    }
  });
}

function renderPreview() {
  const container = document.querySelector("#preview");
  if (!container || !previewData.length) return;

  container.innerHTML = "";
  previewData.forEach((section, idx) => {
    const block = document.createElement("div");
    block.className = "border rounded-xl p-4 space-y-2 shadow-sm bg-gray-50 mb-4";

    block.innerHTML = `
      <input class="text-lg font-semibold w-full border-b focus:outline-none" value="${section.title || ''}" />
      <input class="text-md text-gray-800 w-full border-b focus:outline-none" value="${section.subtitle || ''}" />
      <textarea class="w-full h-32 border rounded p-2 focus:outline-none resize-y">${section.text || ''}</textarea>
      ${section.image ? `<img src="${section.image}" class="w-full rounded-xl max-h-64 object-cover" />` : ''}
      <div class="flex justify-between text-sm text-gray-600 pt-2">
        <button onclick="regenerateSection(${idx})">♻️ Regenerate Section</button>
        <div class="flex gap-2">
          <button onclick="replaceImage(${idx})">🖼️ Replace Image</button>
          <button onclick="deleteSection(${idx})">❌ Delete</button>
        </div>
      </div>
    `;

    container.appendChild(block);
  });

  // ➕ Add New Section
  const addBtn = document.createElement("button");
  addBtn.className = "w-full border rounded-xl py-3 text-center hover:bg-gray-100";
  addBtn.innerText = "➕ Add New Section";
  addBtn.onclick = () => {
    previewData.push({ title: "", subtitle: "", text: "" });
    renderPreview();
  };

  container.appendChild(addBtn);
}

function regenerateSection(index) {
  showToast("Regenerating section...", "loading");
  // logic to regenerate section from backend
  setTimeout(() => {
    previewData[index].text = previewData[index].text + " (Updated)";
    renderPreview();
    showToast("Section updated", "success");
  }, 1000);
}

function deleteSection(index) {
  previewData.splice(index, 1);
  renderPreview();
}

function replaceImage(index) {
  const url = prompt("Enter new image URL:");
  if (url) {
    previewData[index].image = url;
    renderPreview();
  }
}
// 📁 generate.js – eBook Generator with Editable Live Preview

import { showToast } from './toast.js';

let sectionCounter = 1;

export function initGenerator() {
  const generateBtn = document.querySelector('#generateBtn');
  if (!generateBtn) return;

  generateBtn.addEventListener('click', async () => {
    const title = document.querySelector('[placeholder="Book Title"]').value;
    const author = document.querySelector('[placeholder="Author Name"]').value;
    const description = document.querySelector('[placeholder="Brief description..."]').value;
    const instructions = document.querySelector('[placeholder="AI instruction or style preference..."]').value;
    const url = document.querySelector('input[type="url"]').value;
    const output = document.querySelector('input[name="output_format"]:checked')?.value;
    const tone = document.querySelector('select:nth-of-type(2)').value;
    const audience = document.querySelector('select:nth-of-type(1)').value;
    const purpose = document.querySelector('select:nth-of-type(3)').value;

    showToast('Generating eBook...', 'loading');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author, description, instructions, url, output, tone, audience, purpose })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate');

      renderSections(data.sections || []);
      showToast('eBook generated successfully!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  });
}

function renderSections(sections) {
  const previewArea = document.querySelector('#ebook_preview_area');
  previewArea.innerHTML = '';

  sections.forEach(sec => {
    const block = document.createElement('div');
    block.className = 'border rounded-xl p-4 space-y-2 shadow-sm bg-gray-50';
    block.innerHTML = `
      <input class="text-lg font-semibold w-full border-b focus:outline-none" value="${sec.heading || ''}" />
      <input class="text-md text-gray-800 w-full border-b focus:outline-none" value="${sec.subheading || ''}" />
      <textarea class="w-full h-32 border rounded p-2 focus:outline-none resize-y">${sec.text || ''}</textarea>
      ${sec.image ? `<img src="${sec.image}" class="w-full rounded-xl max-h-64 object-cover" />` : ''}
      <div class="flex justify-between text-sm text-gray-600 pt-2">
        <button class="regen-btn">♻️ Regenerate Section</button>
        <div class="flex gap-2">
          <button class="replace-img-btn">🖼️ Replace Image</button>
          <button class="delete-btn">❌ Delete</button>
        </div>
      </div>
    `;

    previewArea.appendChild(block);

    block.querySelector('.delete-btn').onclick = () => block.remove();
    block.querySelector('.regen-btn').onclick = () => showToast('Section regenerated (mock)', 'info');
    block.querySelector('.replace-img-btn').onclick = () => showToast('Image replaced (mock)', 'info');
  });

  const addBtn = document.createElement('button');
  addBtn.className = 'w-full border rounded-xl py-3 text-center hover:bg-gray-100';
  addBtn.textContent = '➕ Add New Section';
  addBtn.onclick = () => {
    sectionCounter++;
    renderSections([...sections, { heading: `Chapter ${sectionCounter}`, subheading: '', text: '', image: '' }]);
  };
  previewArea.appendChild(addBtn);
}
import { getUserSettings } from "./utils.js";

// Call this once the page is ready
async function applySavedFormatting() {
  const settings = await getUserSettings(); // Supabase fetch

  if (!settings || !settings.formatting) return;

  const f = settings.formatting;

  // Map settings into form fields
  document.getElementById("font_family").value = f.font_family || "Inter";
  document.getElementById("font_size").value = f.font_size || "14pt";
  document.getElementById("headline_size").value = f.headline_size || "24pt";
  document.getElementById("text_size").value = f.text_size || "14pt";
  document.getElementById("line_spacing").value = f.line_spacing || "1.5";
  document.getElementById("text_align").value = f.text_align || "justify";

  document.getElementById("margin_top").value = f.margin_top || "1in";
  document.getElementById("margin_right").value = f.margin_right || "1in";
  document.getElementById("margin_bottom").value = f.margin_bottom || "1in";
  document.getElementById("margin_left").value = f.margin_left || "1in";
  
  applyFormattingToPreview(f);
}
function applyFormattingToPreview(formatting) {
  const preview = document.getElementById("ebook_preview_area");
  if (!preview) return;

  preview.style.fontFamily = formatting.font_family || "Inter";
  preview.style.fontSize = formatting.text_size || "14pt";
  preview.style.lineHeight = formatting.line_spacing || "1.5";
  preview.style.textAlign = formatting.text_align || "justify";
  preview.style.paddingTop = formatting.margin_top || "1in";
  preview.style.paddingRight = formatting.margin_right || "1in";
  preview.style.paddingBottom = formatting.margin_bottom || "1in";
  preview.style.paddingLeft = formatting.margin_left || "1in";

  // Apply headline size separately to headings inside blocks
  preview.querySelectorAll(".preview-headline").forEach(el => {
    el.style.fontSize = formatting.headline_size || "24pt";
  });
}

async function generateEbook() {
  const apiKey = getActiveAPIKey(); // your existing API handling
  const topic = document.getElementById("topicInput").value;
  const title = document.getElementById("titleInput").value;
  const desc = document.getElementById("descInput").value;
  const instructions = document.getElementById("ai_instructions").value;

  // Get formatting settings from inputs
  const formatting = {
    font_family: document.getElementById("font_family").value,
    font_size: document.getElementById("font_size").value,
    headline_size: document.getElementById("headline_size").value,
    text_size: document.getElementById("text_size").value,
    line_spacing: document.getElementById("line_spacing").value,
    text_align: document.getElementById("text_align").value,
    margin_top: document.getElementById("margin_top").value,
    margin_right: document.getElementById("margin_right").value,
    margin_bottom: document.getElementById("margin_bottom").value,
    margin_left: document.getElementById("margin_left").value,
  };

  // Add any other relevant inputs...
  const outputFormat = document.querySelector("input[name='output_format']:checked").value;

  // Build payload for AI generation
  const payload = {
    api_key: apiKey,
    topic,
    title,
    description: desc,
    instructions,
    formatting,
    output_format: outputFormat,
    // Optional: language, audience, tone, purpose, etc.
  };

  // UI feedback
  showSpinner(true);

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      renderPreview(data.content); // assumes you already have this
      applyFormattingToPreview(formatting);
      showToast("✅ eBook generated successfully");
    } else {
      showToast("❌ Generation failed: " + (data.error || "Unknown error"));
    }
  } catch (err) {
    console.error(err);
    showToast("❌ Network error");
  } finally {
    showSpinner(false);
  }
}
async function saveFormattingToSupabase() {
  const formatting = {
    font_family: document.getElementById("font_family").value,
    font_size: document.getElementById("font_size").value,
    headline_size: document.getElementById("headline_size").value,
    text_size: document.getElementById("text_size").value,
    line_spacing: document.getElementById("line_spacing").value,
    text_align: document.getElementById("text_align").value,
    margin_top: document.getElementById("margin_top").value,
    margin_right: document.getElementById("margin_right").value,
    margin_bottom: document.getElementById("margin_bottom").value,
    margin_left: document.getElementById("margin_left").value,
  };

  const user = supabase.auth.getUser ? (await supabase.auth.getUser()).data.user : null;
  if (!user) {
    showToast("⚠️ Please sign in to save formatting");
    return;
  }

  const { error } = await supabase
    .from("user_settings")
    .upsert([{ user_id: user.id, formatting }], { onConflict: ["user_id"] });

  if (error) {
    console.error(error);
    showToast("❌ Failed to save formatting");
  } else {
    showToast("✅ Formatting saved!");
    localStorage.setItem("formatting", JSON.stringify(formatting));
    applyFormattingToPreview(formatting);
  }
}
import { exportEbook } from "./export.js";

document.getElementById("saveBtn").addEventListener("click", async (e) => {
  e.preventDefault();
  const html = document.getElementById("ebook_preview_area").innerHTML;
  const format = document.querySelector("input[name='output_format']:checked").value;
  const title = document.getElementById("titleInput")?.value || "LaunchBookAI";

  await exportEbook(format, html, title.replace(/\s+/g, "-").toLowerCase());
});
document.getElementById("ebook_preview_area").addEventListener("click", async (e) => {
  const section = e.target.closest(".ebook-section");
  const sectionId = section?.dataset?.sectionId;

  if (!section) return;

  // ♻️ Regenerate Text
  if (e.target.classList.contains("regen-text")) {
    const title = section.querySelector(".section-title").value;
    const headline = section.querySelector(".section-headline").value;
    showToast("♻️ Regenerating section text...");

    const res = await fetch("/api/regenerate-section", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, headline }),
    });

    const data = await res.json();
    if (res.ok && data.text) {
      section.querySelector(".section-body").value = data.text;
      showToast("✅ Section text updated!");
    } else {
      showToast("❌ Failed to regenerate text", "error");
    }
  }

  // 🖼️ Regenerate Image
  if (e.target.classList.contains("regen-image")) {
    const headline = section.querySelector(".section-headline").value;
    showToast("🖼️ Regenerating image...");

    const res = await fetch("/api/regenerate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: headline }),
    });

    const data = await res.json();
    if (res.ok && data.image_url) {
      section.querySelector(".section-image").src = data.image_url;
      showToast("✅ Image updated!");
    } else {
      showToast("❌ Failed to regenerate image", "error");
    }
  }

  // ❌ Delete Section
  if (e.target.classList.contains("delete-section")) {
    section.remove();
    showToast("🗑️ Section removed");
  }

  // 📤 Replace Image
  if (e.target.classList.contains("replace-image")) {
    // You can trigger a file input dynamically here if needed
    alert("📤 Manual image upload coming in next step...");
  }
});
// generate.js (continue or place inside your generate.js file)

let ebookSections = [];

function renderAllSections() {
  const container = document.getElementById("ebook_preview_area");
  container.innerHTML = "";
  ebookSections.forEach((section, index) => {
    const block = document.createElement("div");
    block.className = "ebook-section border rounded-xl p-4 space-y-2 shadow-sm bg-gray-50 mb-4";
    block.dataset.sectionId = index;
    block.innerHTML = `
      <input class="section-title text-lg font-semibold w-full border-b" value="${section.title || "Chapter Title"}" />
      <input class="section-headline text-md text-gray-800 w-full border-b" value="${section.headline || "Headline"}" />
      <textarea class="section-body w-full h-32 border rounded p-2 resize-y">${section.text || "Text content..."}</textarea>
      <img class="section-image w-full rounded-xl max-h-64 object-cover" src="${section.image || "/placeholder.jpg"}" />
      <div class="flex justify-between text-sm text-gray-600 pt-2">
        <div class="flex gap-3">
          <button class="regen-text text-indigo-600 hover:underline">♻️ Regenerate Text</button>
          <button class="regen-image text-purple-600 hover:underline">🖼️ Regenerate Image</button>
        </div>
        <div class="flex gap-2">
          <button class="replace-image text-blue-600 hover:underline">📤 Replace Image</button>
          <button class="delete-section text-red-600 hover:underline">❌ Delete</button>
        </div>
      </div>
    `;

    attachSectionListeners(block, index);
    container.appendChild(block);
  });
}

function attachSectionListeners(block, index) {
  block.querySelector(".delete-section").onclick = () => {
    ebookSections.splice(index, 1);
    renderAllSections();
  };

  block.querySelector(".regen-text").onclick = async () => {
    const section = ebookSections[index];
    // Call your API here
    section.text = "[Regenerated text]";
    renderAllSections();
  };

  block.querySelector(".regen-image").onclick = async () => {
    const section = ebookSections[index];
    section.image = "/placeholder-regenerated.jpg";
    renderAllSections();
  };

  block.querySelector(".replace-image").onclick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        ebookSections[index].image = url;
        renderAllSections();
      }
    };
    input.click();
  };

  // Live sync text edits back to data
  block.querySelector(".section-title").oninput = e => ebookSections[index].title = e.target.value;
  block.querySelector(".section-headline").oninput = e => ebookSections[index].headline = e.target.value;
  block.querySelector(".section-body").oninput = e => ebookSections[index].text = e.target.value;
}

// ➕ Add New Section
function addNewSection() {
  ebookSections.push({
    title: "New Chapter",
    headline: "New Headline",
    text: "Section content here...",
    image: "/placeholder.jpg"
  });
  renderAllSections();
}

document.querySelector(".add-section-button")?.addEventListener("click", addNewSection);

// Initialize with one section for testing
ebookSections = [
  {
    title: "Chapter 1: Introduction",
    headline: "The Power of Focus",
    text: "Welcome to the first chapter of your ebook. This section covers the basics of staying focused.",
    image: "/placeholder.jpg"
  }
];
renderAllSections();
