document.addEventListener("DOMContentLoaded", function () {
  // Initialize language switcher
  initLanguageSwitcher();
});

function initLanguageSwitcher() {
  // Get saved language preference or default to English
  const savedLanguage = localStorage.getItem("language") || "en";

  // Apply the saved language
  applyLanguage(savedLanguage);

  // Add click event listeners to language buttons
  document.querySelectorAll(".language-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const lang = this.getAttribute("data-lang");
      console.log("Switching to language:", lang); // Debug line
      applyLanguage(lang);
      localStorage.setItem("language", lang);
    });
  });
}

// Parallax Effect
function initParallax() {
  const parallaxElements = document.querySelectorAll(
    ".parallax-bg, .parallax-container"
  );

  function updateParallax() {
    const scrollTop = window.pageYOffset;

    parallaxElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + scrollTop;
      const elementHeight = element.offsetHeight;
      const windowHeight = window.innerHeight;

      // Check if element is in viewport
      if (rect.bottom >= 0 && rect.top <= windowHeight) {
        const yPos = -(scrollTop - elementTop) * 0.2;

        if (element.classList.contains("parallax-bg")) {
          element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        } else if (element.classList.contains("parallax-container")) {
          element.style.backgroundPosition = `center ${yPos}px`;
        }
      }
    });
  }

  // Use requestAnimationFrame for smooth animation
  let ticking = false;

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  function handleScroll() {
    requestTick();
    ticking = false;
  }

  window.addEventListener("scroll", handleScroll);
  updateParallax(); // Initial call
}

// Initialize parallax
initParallax();
function applyLanguage(lang) {
  console.log("Applying language:", lang); // Debug line

  // Update active state on language buttons
  document.querySelectorAll(".language-btn").forEach((btn) => {
    if (btn.getAttribute("data-lang") === lang) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Add HTML lang attribute for accessibility
  document.documentElement.setAttribute("lang", lang);

  // Show elements for the selected language and hide others
  document.querySelectorAll("[data-lang-text]").forEach((element) => {
    try {
      const translations = JSON.parse(element.getAttribute("data-lang-text"));
      if (translations[lang]) {
        element.innerHTML = translations[lang];
      }
    } catch (error) {
      console.error("Error parsing translations for element:", element);
      console.error(error);
    }
  });

  // Handle placeholders for input elements
  document.querySelectorAll("[data-lang-placeholder]").forEach((element) => {
    try {
      const translations = JSON.parse(
        element.getAttribute("data-lang-placeholder")
      );
      if (translations[lang]) {
        element.placeholder = translations[lang];
      }
    } catch (error) {
      console.error(
        "Error parsing placeholder translations for element:",
        element
      );
      console.error(error);
    }
  });

  // Handle title translations
  const titleElement = document.querySelector("title[data-lang-text]");
  if (titleElement) {
    try {
      const translations = JSON.parse(
        titleElement.getAttribute("data-lang-text")
      );
      if (translations[lang]) {
        document.title = translations[lang];
      }
    } catch (error) {
      console.error("Error parsing title translation");
      console.error(error);
    }
  }
}
