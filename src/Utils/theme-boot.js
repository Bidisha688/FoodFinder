// theme-boot.js
(function () {
    var STORAGE_KEY = "theme";
    try {
      var t = localStorage.getItem(STORAGE_KEY);
      var initial = t === "dark" ? "dark" : "light"; // default = light
  
      // Apply immediately to avoid flash
      var docEl = document.documentElement;
      if (initial === "dark") {
        docEl.classList.add("dark");
      } else {
        docEl.classList.remove("dark");
      }
      docEl.setAttribute("data-theme", initial);
      docEl.style.colorScheme = initial; // native controls
  
      // Optional: set browser UI color on mobile
      var meta = document.querySelector('meta[name="theme-color"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'theme-color';
        document.head.appendChild(meta);
      }
      meta.content = initial === 'dark' ? '#0a0a0a' : '#ffffff';
    } catch (_) {
      // If localStorage is blocked, fall back to light
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
      document.documentElement.style.colorScheme = "light";
    }
  })();
  