// Header shrink on scroll effect
document.addEventListener("DOMContentLoaded", function () {
  const nav = document.querySelector("nav");
  const scrollThreshold = 50;

  // Function to toggle header class based on scroll position
  function toggleHeaderClass() {
    if (window.scrollY > scrollThreshold) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }

  // Initial check on page load
  toggleHeaderClass();

  // Add scroll event listener
  window.addEventListener("scroll", toggleHeaderClass);

  // Smooth scroll for navigation links
  document.querySelectorAll('nav a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const navHeight = nav.offsetHeight;
        const targetPosition =
          targetElement.getBoundingClientRect().top + window.pageYOffset;

        window.scrollTo({
          top: targetPosition - navHeight,
          behavior: "smooth",
        });
      }
    });
  });
});

// Parallax effect enhancement
window.addEventListener("scroll", function () {
  const parallaxElements = document.querySelectorAll(".parallax-bg");
  const scrollPosition = window.pageYOffset;

  parallaxElements.forEach((element) => {
    const speed = 0.5;
    element.style.transform = `translateY(${scrollPosition * speed}px)`;
  });
});
