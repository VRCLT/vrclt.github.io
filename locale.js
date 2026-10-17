"use strict";

// Only the root chooses a language. A shared /en/, /ko/, etc. URL always wins.
(() => {
  const supported = new Set(["en", "ko", "ja", "zh", "zh-hant"]);
  const preferenceKey = "vrclt.site.language";

  function matchLanguage(language) {
    const parts = String(language).toLowerCase().replaceAll("_", "-").split("-");
    if (parts[0] === "zh") {
      if (parts.includes("hant")) return "zh-hant";
      if (parts.includes("hans")) return "zh";
      return parts.some(part => ["tw", "hk", "mo"].includes(part)) ? "zh-hant" : "zh";
    }
    return supported.has(parts[0]) ? parts[0] : null;
  }

  if (document.documentElement.hasAttribute("data-auto-language")) {
    let preferred;
    try {
      preferred = localStorage.getItem(preferenceKey);
    } catch {
      // The site still works when browser storage is unavailable.
    }
    if (!supported.has(preferred)) {
      const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
      preferred = languages.map(matchLanguage).find(Boolean) || "en";
    }
    const destination = new URL(`${preferred}/`, location.href);
    destination.search = location.search;
    destination.hash = location.hash;
    location.replace(destination.href);
  }

  document.addEventListener("click", event => {
    const link = event.target.closest?.(".language-links a[data-language]");
    const language = link?.dataset.language;
    if (!supported.has(language)) return;
    try {
      localStorage.setItem(preferenceKey, language);
    } catch {
      // The explicit language link works without persistent storage.
    }
  });
})();
