/*
  Theme controller
  ----------------
  The site follows the visitor's system setting on first load, then remembers
  their Archive (light) or Night Ops (dark) choice in this browser.
*/

(function initializeTheme() {
  const storageKey = "oss-spy-jail-theme";
  const root = document.documentElement;
  const systemPrefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;

  function getSavedTheme() {
    try {
      return localStorage.getItem(storageKey);
    } catch {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(storageKey, theme);
    } catch {
      // The selected theme still works when browser storage is unavailable.
    }
  }

  function applyTheme(theme) {
    const isDark = theme === "dark";
    root.dataset.theme = isDark ? "dark" : "light";

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = isDark ? "#090d14" : "#f4f1e8";

    document.querySelectorAll(".theme-toggle").forEach((button) => {
      const label = button.querySelector(".theme-toggle-label");
      const icon = button.querySelector(".theme-toggle-icon");
      if (label) label.textContent = isDark ? "Archive" : "Night Ops";
      if (icon) icon.textContent = isDark ? "☼" : "◐";
      button.setAttribute("aria-label", `Switch to ${isDark ? "Archive" : "Night Ops"} theme`);
      button.setAttribute("aria-pressed", String(isDark));
    });
  }

  const savedTheme = getSavedTheme();
  applyTheme(savedTheme === "dark" || savedTheme === "light" ? savedTheme : systemPrefersDark ? "dark" : "light");

  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(root.dataset.theme);
    document.querySelectorAll(".theme-toggle").forEach((button) => {
      button.addEventListener("click", () => {
        const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
        applyTheme(nextTheme);
        saveTheme(nextTheme);
      });
    });
  });
})();
