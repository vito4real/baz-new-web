function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    {
      pageLanguage: "ru",
      autoDisplay: false,
      includedLanguages: "ru,en,es,pt,zh-CN",
    },
    "google_translate_element"
  );
}

document.addEventListener("DOMContentLoaded", function () {
  const langBtn = document.getElementById("langBtn");
  const langMenu = document.getElementById("langMenu");

  if (!langBtn || !langMenu) return;

  const labels = {
    ru: "RU",
    en: "EN",
    es: "ES",
    pt: "PT",
    "zh-CN": "ZH",
  };

  function setCookie(name, value, days = 1) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/`;
  }

  function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${location.hostname}`;
  }

  function updateButtonLabel(lang) {
    langBtn.innerHTML = `${
      labels[lang] || "RU"
    } <span class="lang__chev">▾</span>`;
  }

  function getCurrentLangFromCookie() {
    const match = document.cookie.match(/(?:^|; )googtrans=([^;]+)/);
    if (!match) return "ru";

    const value = decodeURIComponent(match[1]);
    const parts = value.split("/");

    return parts[2] || "ru";
  }

  function applyLanguage(lang) {
    const trySetLanguage = () => {
      const select = document.querySelector(".goog-te-combo");
      if (!select) return false;

      select.value = lang;
      select.dispatchEvent(new Event("change"));
      return true;
    };

    if (lang === "ru") {
      deleteCookie("googtrans");
      setCookie("googtrans", "/ru/ru");
      updateButtonLabel("ru");
      location.reload();
      return;
    }

    setCookie("googtrans", `/ru/${lang}`);
    updateButtonLabel(lang);

    if (trySetLanguage()) return;

    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;

      if (trySetLanguage() || attempts > 30) {
        clearInterval(interval);
      }
    }, 300);
  }

  updateButtonLabel(getCurrentLangFromCookie());

  langBtn.addEventListener("click", function () {
    langMenu.classList.toggle("lang__menu--open");
    langBtn.setAttribute(
      "aria-expanded",
      langMenu.classList.contains("lang__menu--open") ? "true" : "false"
    );
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".lang")) {
      langMenu.classList.remove("lang__menu--open");
      langBtn.setAttribute("aria-expanded", "false");
    }
  });

  langMenu.addEventListener("click", function (e) {
    const item = e.target.closest("[data-lang]");
    if (!item) return;

    const targetLang = item.dataset.lang;

    langMenu.classList.remove("lang__menu--open");
    langBtn.setAttribute("aria-expanded", "false");

    applyLanguage(targetLang);
  });
});
