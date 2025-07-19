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
