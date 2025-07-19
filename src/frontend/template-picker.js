// public/frontend/template-picker.js

window.initTemplatePicker = function () {
  document.querySelectorAll('[data-template-path]').forEach((el) => {
    el.addEventListener('click', async () => {
      const path = el.dataset.templatePath;
      try {
        const res = await fetch(`/templates/${path}`);
        const template = await res.json();

        // ✅ Fill form fields
        if (template.title) document.querySelector('input[placeholder="Book Title"]').value = template.title;
        if (template.audience) document.querySelector('select:nth-of-type(1)').value = template.audience;
        if (template.tone) document.querySelector('select:nth-of-type(2)').value = template.tone;
        if (template.purpose) document.querySelector('select:nth-of-type(3)').value = template.purpose;

        // ✅ Fill formatting
        const formatting = {
          font_family: template.font_family,
          font_size: template.font_size,
          headline_size: template.headline_size,
          text_size: template.text_size,
          line_spacing: template.line_spacing,
          text_align: template.text_align,
          margin_top: template.margin_top,
          margin_right: template.margin_right,
          margin_bottom: template.margin_bottom,
          margin_left: template.margin_left,
        };
        Object.entries(formatting).forEach(([k, v]) => {
          const field = document.getElementById(k);
          if (field) field.value = v;
        });
        applyFormattingToPreview(formatting);

        // ✅ Fill preview content
        const preview = document.getElementById("ebook_preview_area");
        preview.innerHTML = "";
        template.sections.forEach((s) => {
          const section = document.createElement("div");
          section.className = "border rounded-xl p-4 space-y-2 shadow-sm bg-gray-50";
          section.innerHTML = `
            <input class="text-lg font-semibold w-full border-b preview-headline" value="${s.headline}" />
            <input class="text-md text-gray-800 w-full border-b" value="${s.subheadline}" />
            <textarea class="w-full h-32 border rounded p-2 resize-y">${s.text}</textarea>
            <img src="${s.image_url}" class="w-full rounded-xl max-h-64 object-cover" />
            <div class="flex justify-between text-sm text-gray-600 pt-2">
              <button>♻️ Regenerate Section</button>
              <div class="flex gap-2">
                <button>🖼️ Replace Image</button>
                <button>❌ Delete</button>
              </div>
            </div>`;
          preview.appendChild(section);
        });

        toast.success("Template applied successfully!");
        const modal = document.getElementById("templateModal");
        if (modal) modal.style.display = "none";
      } catch (err) {
        toast.error("Failed to load template.");
        console.error(err);
      }
    });
  });
};
