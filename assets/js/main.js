(function () {
  "use strict";

  /* ---------- Menú móvil ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Resúmenes desplegables ---------- */
  document.querySelectorAll("[data-toggle-abstract]").forEach(function (btn) {
    var abstract = btn.previousElementSibling;
    abstract.classList.add("is-collapsed");
    btn.addEventListener("click", function () {
      var collapsed = abstract.classList.toggle("is-collapsed");
      btn.setAttribute("aria-expanded", String(!collapsed));
      btn.textContent = collapsed ? "Leer más" : "Leer menos";
    });
  });

  /* ---------- Visor de PDF ---------- */
  var viewer = document.getElementById("viewer");
  var frame = document.getElementById("viewer-frame");
  var titleEl = document.getElementById("viewer-title");
  var openLink = document.getElementById("viewer-open");
  var downloadLink = document.getElementById("viewer-download");

  // En móviles los PDF incrustados no suelen mostrarse: se abren en una pestaña nueva.
  var canEmbedPdf =
    typeof viewer.showModal === "function" &&
    navigator.pdfViewerEnabled !== false &&
    window.matchMedia("(min-width: 721px)").matches;

  function openViewer(pdf, title) {
    if (!canEmbedPdf) {
      window.open(pdf, "_blank", "noopener");
      return;
    }
    titleEl.textContent = title;
    openLink.href = pdf;
    downloadLink.href = pdf;
    frame.src = pdf + "#view=FitH";
    viewer.showModal();
  }

  function closeViewer() {
    viewer.close();
  }

  viewer.addEventListener("close", function () {
    frame.src = "about:blank";
  });
  viewer.addEventListener("click", function (e) {
    if (e.target === viewer) closeViewer();
  });
  document.getElementById("viewer-close").addEventListener("click", closeViewer);

  document.querySelectorAll("[data-pdf]").forEach(function (el) {
    el.addEventListener("click", function () {
      openViewer(el.getAttribute("data-pdf"), el.getAttribute("data-title"));
    });
  });

  /* ---------- Video de YouTube ---------- */
  document.querySelectorAll(".video-frame[data-youtube-id]").forEach(function (box) {
    var raw = (box.getAttribute("data-youtube-id") || "").trim();
    if (!raw) return;
    var match = raw.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
    var id = match ? match[1] : raw;
    var iframe = document.createElement("iframe");
    iframe.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?rel=0";
    iframe.title = box.getAttribute("data-video-title") || "Video de YouTube";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.loading = "lazy";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    box.innerHTML = "";
    box.appendChild(iframe);
  });

  /* ---------- Enlace activo en el menú ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".site-nav a"));
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.forEach(function (a) {
      var section = document.querySelector(a.getAttribute("href"));
      if (section) observer.observe(section);
    });
  }
})();
