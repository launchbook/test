// 📁 template-loader.js

async function loadTemplate(path) {
  try {
    const res = await fetch(`/templates/${path}`);
    if (!res.ok) throw new Error("Failed to fetch template");
    const template = await res.json();

    // Apply formatting
    await saveUserFormatting(template);
    applyFormattingToPreview(template);

    // Apply preview content
    const preview = document.getElementById("ebook_preview_area");
    if (!preview) return;

    preview.innerHTML = "";
    template.sections.forEach((section, idx) => {
      const block = document.createElement("div");
      block.className = "border rounded-xl p-4 space-y-2 shadow-sm bg-gray-50 mb-4";

      block.innerHTML = `
        <input class="text-lg font-semibold w-full border-b focus:outline-none preview-headline" value="${section.headline}" />
        <input class="text-md text-gray-800 w-full border-b focus:outline-none" value="${section.subheadline || ''}" />
        <textarea class="w-full h-32 border rounded p-2 focus:outline-none resize-y">${section.text}</textarea>
        ${section.image_url ? `<img src="${section.image_url}" class="w-full rounded-xl max-h-64 object-cover" />` : ''}
        <div class="flex justify-between text-sm text-gray-600 pt-2">
          <button>♻️ Regenerate Section</button>
          <div class="flex gap-2">
            <button>🖼️ Replace Image</button>
            <button>❌ Delete</button>
          </div>
        </div>
      `;

      preview.appendChild(block);
    });

    Toast.success("Template applied! ✅");
    closeTemplateModal();

  } catch (err) {
    Toast.error("Template load failed ⚠️");
    console.error(err);
  }
}

// Bind click handler
setTimeout(() => {
  document.querySelectorAll(".apply-template").forEach(btn => {
    btn.addEventListener("click", () => {
      const path = btn.closest(".template-card").dataset.templatePath;
      if (path) loadTemplate(path);
    });
  });
}, 100);
