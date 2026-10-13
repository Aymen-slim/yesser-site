var photoStyle = document.createElement("style");
photoStyle.textContent = [
  ".w-slider,.w-slider-mask,.w-slide,.fs-slider_slider,.fs-slider_slide,.fs-slider_mask,",
  ".collection-item,.collection-item-4,.parallax-photo-wrapper,.big-photo,.small-photo,",
  ".project-template-hero-image-wrapper,.project-image-wrapper,.project-image-wrapper-2,",
  ".portfolio-grid-photo,.image-24,.image-48,img{",
  "background-color:transparent!important}"
].join("");
document.head.appendChild(photoStyle);

function clearPlaceholderBackgrounds() {
  document.querySelectorAll(".project-template-hero-image-wrapper,.project-image-wrapper,.project-image-wrapper-2,.collection-item-4,.parallax-photo-wrapper,.big-photo,.small-photo,.w-slide,.fs-slider_slide").forEach(function (el) {
    var image = getComputedStyle(el).backgroundImage;
    if (image && image.indexOf("background-image.svg") !== -1) {
      el.style.backgroundImage = "none";
    }
  });
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", clearPlaceholderBackgrounds);
} else {
  clearPlaceholderBackgrounds();
}

document.addEventListener(
  "click",
  function (event) {
    var consent = event.target.closest && event.target.closest(".consent-button");
    if (consent) {
      event.preventDefault();
      var banner = document.querySelector(".cookie-banner");
      if (banner) banner.style.display = "none";
      return;
    }

    var send = event.target.closest && event.target.closest("form.form a.cta");
    if (!send) return;
    event.preventDefault();
    var form = send.closest("form");
    if (form && typeof form.requestSubmit === "function") form.requestSubmit();
  },
  true
);

document.addEventListener(
  "submit",
  function (event) {
    var form = event.target;
    if (!form || !form.classList || !form.classList.contains("form")) return;
    if (!form.checkValidity()) return;
    event.preventDefault();
    event.stopPropagation();

    var block = form.closest(".w-form");
    if (!block) return;
    var done = block.querySelector(".w-form-done");
    var fail = block.querySelector(".w-form-fail");
    form.style.display = "none";
    if (fail) fail.style.display = "none";
    if (done) done.style.display = "block";
  },
  true
);

(function () {
  var section = document.querySelector(".section-home-header");
  var hero = document.querySelector(".home-hero");
  if (!section || !hero) return;
  var slides = Array.prototype.slice.call(hero.querySelectorAll(".home-hero_slide"));
  var meters = Array.prototype.slice.call(hero.querySelectorAll(".home-hero_meter span"));
  if (slides.length < 2) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var pending = false;

  function show(index, part) {
    slides.forEach(function (slide, i) {
      slide.classList.toggle("is-active", i === index);
    });
    meters.forEach(function (meter, i) {
      meter.classList.toggle("is-done", i < index);
      meter.classList.toggle("is-active", i === index);
      if (i === index) meter.style.setProperty("--meter", String(part));
      else meter.style.removeProperty("--meter");
    });
  }

  function frame() {
    pending = false;
    var rect = section.getBoundingClientRect();
    var scrollable = section.offsetHeight - window.innerHeight;
    var scrolled = -rect.top;
    if (scrolled < 0) scrolled = 0;
    if (scrollable > 0 && scrolled > scrollable) scrolled = scrollable;
    var progress = scrollable > 0 ? scrolled / scrollable : 0;
    var scaled = progress * slides.length;
    var index = Math.min(slides.length - 1, Math.floor(scaled));
    var part = scaled - index;
    if (progress >= 1) part = 1;
    show(index, part);
  }

  function queue() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(frame);
  }

  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue);
  queue();
})();
