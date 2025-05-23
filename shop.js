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

  // Category filtering
  const categoryItems = document.querySelectorAll(".category-item");
  const productCards = document.querySelectorAll(".product-card");
  const priceSlider = document.getElementById("priceRange");
  const priceValue = document.getElementById("priceValue");

  // Update the price display when the slider moves
  priceSlider.addEventListener("input", function () {
    const value = this.value;
    priceValue.textContent = value >= 200 ? "$200+" : `$${value}`;
    filterProducts();
  });

  // Add click event to category items
  categoryItems.forEach((item) => {
    item.addEventListener("click", function () {
      // Remove active class from all items
      categoryItems.forEach((cat) => cat.classList.remove("active"));

      // Add active class to clicked item
      this.classList.add("active");

      // Filter products
      filterProducts();
    });
  });

  // Function to filter products based on category and price
  function filterProducts() {
    const selectedCategory = document.querySelector(".category-item.active")
      .dataset.category;
    const maxPrice = parseInt(priceSlider.value);

    productCards.forEach((card) => {
      const cardCategory = card.dataset.category;
      const cardPrice = parseInt(card.dataset.price);

      // Check if the card should be visible based on category and price
      const categoryMatch =
        selectedCategory === "all" || cardCategory === selectedCategory;
      const priceMatch = cardPrice <= maxPrice;

      if (categoryMatch && priceMatch) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }

  // Initialize "Add to Cart" buttons
  const shopButtons = document.querySelectorAll(".shop-button");
  shopButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productName =
        this.closest(".product-card").querySelector("h3").textContent;
      alert(`Added "${productName}" to your cart!`);
    });
  });
});
