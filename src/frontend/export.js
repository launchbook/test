// 📦 export.js – Handles exporting eBook (PDF/EPUB/Kindle)

// Triggered on Export button click
async function handleExport() {
  const preview = document.getElementById("ebook_preview_area");
  if (!preview) return showToast("❌ No preview content to export");

  const blocks = [...preview.querySelectorAll(".editable-block")].map(block => {
    return {
      title: block.querySelector(".block-title")?.value || "",
      headline: block.querySelector(".block-headline")?.value || "",
      text: block.querySelector(".block-text")?.value || "",
      image: block.querySelector("img")?.src || "",
    };
  });

  const formatting = {
    font_family: document.getElementById("font_family")?.value,
    font_size: document.getElementById("font_size")?.value,
    headline_size: document.getElementById("headline_size")?.value,
    text_size: document.getElementById("text_size")?.value,
    line_spacing: document.getElementById("line_spacing")?.value,
    text_align: document.getElementById("text_align")?.value,
    margin_top: document.getElementById("margin_top")?.value,
    margin_right: document.getElementById("margin_right")?.value,
    margin_bottom: document.getElementById("margin_bottom")?.value,
    margin_left: document.getElementById("margin_left")?.value,
  };

  const bookTitle = document.querySelector("input[placeholder='Book Title']")?.value || "ebook";
  const format = document.querySelector("input[name='output_format']:checked")?.value || "pdf";

  if (format === "kindle" && currentUserPlan !== 'pro' && currentUserPlan !== 'agency') {
    return showToast("❌ Kindle export is only for Pro/Agency users");
  }

  showToast("⏳ Exporting your ebook...");

  const payload = {
    blocks,
    formatting,
    title: bookTitle,
    format,
  };

  try {
    const res = await fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok || !data?.file_url) {
      throw new Error("Export failed");
    }

    // Show toast + reveal download button
    showToast("✅ Your Ebook is Ready! Click to download");

    const saveBtn = document.getElementById("saveBtn");
    saveBtn.classList.remove("hidden");
    saveBtn.href = data.file_url;
    saveBtn.download = `LaunchBook - ${bookTitle}.${format === "kindle" ? "mobi" : format}`;
  } catch (err) {
    console.error(err);
    showToast("❌ Export failed. Try again");
  }
}

// Bind it to the button
if (document.getElementById("export_btn")) {
  document.getElementById("export_btn").addEventListener("click", handleExport);
}
