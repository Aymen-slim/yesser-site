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
