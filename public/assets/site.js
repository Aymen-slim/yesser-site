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
  var hero = document.querySelector(".home-hero");
  var wrap = document.querySelector(".home-header_content-wrapper");
  if (!hero || !wrap) return;
  var slides = Array.prototype.slice.call(hero.querySelectorAll(".home-hero_slide"));
  var meters = Array.prototype.slice.call(hero.querySelectorAll(".home-hero_meter span"));
  if (slides.length < 2) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var index = 0;
  var timer = null;
  var delay = 3000;
  var started = false;
  var origin = null;
  var swiped = false;

  function show(next) {
    index = (next + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle("is-active", i === index);
    });
    meters.forEach(function (meter, i) {
      meter.classList.toggle("is-done", i < index);
      meter.classList.remove("is-active");
    });
    var current = meters[index];
    if (current && !reduce) {
      void current.offsetWidth;
      current.classList.add("is-active");
    }
  }

  function arm() {
    if (timer) clearTimeout(timer);
    timer = null;
    if (reduce || document.hidden || !started) return;
    timer = setTimeout(function () {
      show(index + 1);
      arm();
    }, delay);
  }

  function step(direction) {
    show(index + direction);
    arm();
  }

  wrap.addEventListener("pointerdown", function (event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    origin = { x: event.clientX, y: event.clientY, id: event.pointerId };
    swiped = false;
  });

  function finishSwipe(event) {
    if (!origin || origin.id !== event.pointerId) return;
    var dx = event.clientX - origin.x;
    var dy = event.clientY - origin.y;
    origin = null;
    if (Math.abs(dx) < 42 || Math.abs(dx) < Math.abs(dy) * 1.15) return;
    swiped = true;
    step(dx < 0 ? 1 : -1);
  }

  wrap.addEventListener("pointerup", finishSwipe);
  wrap.addEventListener("pointercancel", function () {
    origin = null;
  });
  wrap.addEventListener(
    "click",
    function (event) {
      if (!swiped) return;
      swiped = false;
      event.preventDefault();
      event.stopPropagation();
    },
    true
  );

  document.addEventListener("visibilitychange", function () {
    if (!started) return;
    if (document.hidden) {
      if (timer) clearTimeout(timer);
      timer = null;
    } else {
      arm();
    }
  });

  var waits = 0;
  function boot() {
    var pre = document.querySelector(".preloader-container");
    var gone = !pre;
    if (pre) {
      var style = getComputedStyle(pre);
      var box = pre.getBoundingClientRect();
      gone = style.display === "none" || style.visibility === "hidden" || parseFloat(style.opacity) < 0.05 || box.height < 2 || box.bottom < 0;
    }
    if (gone || waits > 24) {
      started = true;
      show(0);
      arm();
    } else {
      waits += 1;
      setTimeout(boot, 250);
    }
  }

  boot();
})();
