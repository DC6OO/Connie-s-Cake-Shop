(function () {
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav-toggle");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
  }

  var root = document.querySelector("[data-slideshow]");
  if (!root) return;

  var slides = root.querySelectorAll("[data-slide]");
  var dotsContainer = root.querySelector(".slideshow-dots");
  var prevBtn = root.querySelector("[data-prev]");
  var nextBtn = root.querySelector("[data-next]");
  var total = slides.length;
  var index = 0;
  var timer = null;
  var intervalMs = 6000;

  function show(i) {
    index = ((i % total) + total) % total;
    slides.forEach(function (el, j) {
      el.classList.toggle("is-active", j === index);
    });
    if (dotsContainer) {
      var dots = dotsContainer.querySelectorAll("button");
      dots.forEach(function (d, j) {
        d.setAttribute("aria-selected", j === index ? "true" : "false");
      });
    }
  }

  if (dotsContainer && total > 0) {
    slides.forEach(function (_, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", "Go to slide " + (i + 1));
      b.addEventListener("click", function () {
        stop();
        show(i);
        start();
      });
      dotsContainer.appendChild(b);
    });
    show(0);
  }

  function next() {
    show(index + 1);
  }

  function prev() {
    show(index - 1);
  }

  function start() {
    stop();
    timer = window.setInterval(next, intervalMs);
  }

  function stop() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      stop();
      next();
      start();
    });
  }
  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      stop();
      prev();
      start();
    });
  }

  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", function (e) {
    if (!root.contains(e.relatedTarget)) start();
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop();
    else start();
  });

  start();
})();
