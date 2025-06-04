document.addEventListener("DOMContentLoaded", function () {
  // Initialize the scroll effect for the header
  const nav = document.querySelector("nav");
  const scrollThreshold = 50;

  function toggleHeaderClass() {
    if (window.scrollY > scrollThreshold) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }

  toggleHeaderClass();
  window.addEventListener("scroll", toggleHeaderClass);

  // Product Gallery
  const mainImage = document.querySelector(".main-image img");
  const thumbnails = document.querySelectorAll(".thumbnail");

  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", function () {
      // Update main image
      const newSrc = this.querySelector("img").src;
      mainImage.src = newSrc;

      // Update active thumbnail
      thumbnails.forEach((thumb) => thumb.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Quantity selector
  const quantityInput = document.querySelector(".quantity-input");
  const minusButton = document.querySelector(".quantity-button.minus");
  const plusButton = document.querySelector(".quantity-button.plus");

  if (minusButton && plusButton && quantityInput) {
    minusButton.addEventListener("click", function () {
      let currentValue = parseInt(quantityInput.value);
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
    });

    plusButton.addEventListener("click", function () {
      let currentValue = parseInt(quantityInput.value);
      if (currentValue < 10) {
        quantityInput.value = currentValue + 1;
      }
    });

    // Validate manual input
    quantityInput.addEventListener("change", function () {
      let value = parseInt(this.value);
      if (isNaN(value) || value < 1) {
        this.value = 1;
      } else if (value > 10) {
        this.value = 10;
      }
    });
  }

  // Product option buttons
  const optionButtons = document.querySelectorAll(".option-button");

  optionButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Get all buttons in the same group
      const parentGroup = this.closest(".option-group");
      const groupButtons = parentGroup.querySelectorAll(".option-button");

      // Remove active class from all buttons in this group
      groupButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");
    });
  });

  // Add to cart button
  const addToCartButton = document.querySelector(".product-add-cart");

  if (addToCartButton) {
    addToCartButton.addEventListener("click", function () {
      const productName =
        document.querySelector(".product-info h1").textContent;
      const quantity = document.querySelector(".quantity-input").value;
      const finish = document.querySelector(
        ".option-group:first-child .option-button.active"
      ).textContent;
      const size = document.querySelector(
        ".option-group:last-child .option-button.active"
      ).textContent;

      alert(`Added to cart: ${quantity} x ${productName} (${finish}, ${size})`);
    });
  }

  // Product Tabs
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabPanes = document.querySelectorAll(".tab-pane");

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab");

      // Remove active class from all buttons and panes
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabPanes.forEach((pane) => pane.classList.remove("active"));

      // Add active class to clicked button and corresponding pane
      this.classList.add("active");
      document.getElementById(tabId).classList.add("active");
    });
  });

  // Load More Reviews button
  const loadMoreButton = document.querySelector(".load-more");

  if (loadMoreButton) {
    loadMoreButton.addEventListener("click", function () {
      // In a real app, this would load more reviews via AJAX
      alert(
        "In a complete implementation, this would load more reviews from the server."
      );
    });
  }
});
