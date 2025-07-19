import { exportEbook } from "./export.js";

document.getElementById("saveBtn").addEventListener("click", async (e) => {
  e.preventDefault();
  const html = document.getElementById("ebook_preview_area").innerHTML;
  const format = document.querySelector("input[name='output_format']:checked").value;
  const title = document.getElementById("titleInput")?.value || "LaunchBookAI";

  await exportEbook(format, html, title.replace(/\s+/g, "-").toLowerCase());
});
