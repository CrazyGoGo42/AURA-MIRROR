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
  if (priceSlider) {
    priceSlider.addEventListener("input", function () {
      const value = this.value;
      priceValue.textContent = value >= 200 ? "$200+" : `$${value}`;
      filterProducts();
    });
  }

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
      ?.dataset.category;
    const maxPrice = priceSlider ? parseInt(priceSlider.value) : 200;

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

  // Cart functionality
  class ShoppingCart {
    constructor() {
      this.items = JSON.parse(localStorage.getItem("cart")) || [];
      this.updateCartDisplay();
    }

    addItem(product) {
      const existingItem = this.items.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.items.push({ ...product, quantity: 1 });
      }

      this.saveCart();
      this.updateCartDisplay();
      this.showAddedToCartMessage(product.name);
    }

    removeItem(productId) {
      this.items = this.items.filter((item) => item.id !== productId);
      this.saveCart();
      this.updateCartDisplay();
    }

    updateQuantity(productId, newQuantity) {
      if (newQuantity <= 0) {
        this.removeItem(productId);
        return;
      }

      const item = this.items.find((item) => item.id === productId);
      if (item) {
        item.quantity = newQuantity;
        this.saveCart();
        this.updateCartDisplay();
      }
    }

    getItemCount() {
      return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    getTotal() {
      return this.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    }

    saveCart() {
      localStorage.setItem("cart", JSON.stringify(this.items));
    }

    updateCartDisplay() {
      this.updateCartBadge();
      this.updateCartPopup();
      // Check if we're on the cart page
      if (window.location.pathname.includes("cart.html")) {
        this.updateCartPage();
      }
    }

    updateCartBadge() {
      const badge = document.querySelector(".cart-badge");
      const count = this.getItemCount();

      if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? "flex" : "none";
      }
    }

    updateCartPopup() {
      const cartItemsContainer = document.querySelector(".cart-popup-items");
      const cartTotal = document.querySelector(".cart-popup .total-amount");

      if (!cartItemsContainer) return;

      if (this.items.length === 0) {
        cartItemsContainer.innerHTML =
          '<div class="cart-empty">Your cart is empty</div>';
      } else {
        cartItemsContainer.innerHTML = this.items
          .map(
            (item) => `
          <div class="cart-popup-item">
            <div class="cart-item-image" style="background-image: url('${
              item.image
            }')"></div>
            <div class="cart-item-details">
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-price">$${item.price}</div>
              <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="cart.updateQuantity('${
                  item.id
                }', ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="cart.updateQuantity('${
                  item.id
                }', ${item.quantity + 1})">+</button>
              </div>
            </div>
          </div>
        `
          )
          .join("");
      }

      if (cartTotal) {
        cartTotal.textContent = `$${this.getTotal().toFixed(2)}`;
      }
    }

    updateCartPage() {
      const cartItemsContainer = document.querySelector(".cart-items");
      const subtotalElement = document.querySelector(".subtotal");
      const shippingElement = document.querySelector(".shipping");
      const totalElement = document.querySelector(
        ".cart-summary .total-amount"
      );

      if (!cartItemsContainer) return;

      if (this.items.length === 0) {
        cartItemsContainer.innerHTML = `
        <div class="empty-cart">
          <span class="material-symbols-outlined">shopping_cart</span>
          <h3>Your cart is empty</h3>
          <p>Add some products to get started!</p>
        </div>
      `;

        // Reset totals
        if (subtotalElement) subtotalElement.textContent = "$0.00";
        if (shippingElement) shippingElement.textContent = "$0.00";
        if (totalElement) totalElement.textContent = "$0.00";
        return;
      }

      cartItemsContainer.innerHTML = this.items
        .map(
          (item) => `
      <div class="cart-item">
        <div class="cart-item-img" style="background-image: url('${
          item.image
        }')"></div>
        <div class="cart-item-info">
          <h3>${item.name}</h3>
          <p>${item.description || "Premium beauty product"}</p>
          <div class="cart-item-price">$${item.price}</div>
        </div>
        <div class="cart-item-controls">
          <div class="cart-quantity-controls">
            <button class="quantity-btn" onclick="cart.updateQuantity('${
              item.id
            }', ${item.quantity - 1})">-</button>
            <span class="cart-quantity-display">${item.quantity}</span>
            <button class="quantity-btn" onclick="cart.updateQuantity('${
              item.id
            }', ${item.quantity + 1})">+</button>
          </div>
          <button class="remove-item-btn" onclick="cart.removeItem('${
            item.id
          }')">Remove</button>
        </div>
      </div>
    `
        )
        .join("");

      const subtotal = this.getTotal();
      const shipping = subtotal > 0 ? (subtotal >= 500 ? 0 : 9.99) : 0;
      const total = subtotal + shipping;

      if (subtotalElement)
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
      if (shippingElement)
        shippingElement.textContent =
          shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`;
      if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
    }

    showAddedToCartMessage(productName) {
      // Create and show a temporary notification
      const notification = document.createElement("div");
      notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background-color: var(--accent);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: var(--border-radius);
      z-index: 10000;
      font-family: 'CatchyMager', serif;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;
      notification.textContent = `Added "${productName}" to cart!`;

      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.transform = "translateX(0)";
      }, 100);

      setTimeout(() => {
        notification.style.transform = "translateX(100%)";
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
        }, 300);
      }, 2000);
    }
  }

  // Initialize cart
  const cart = new ShoppingCart();
  window.cart = cart; // Make cart globally accessible

  // Initialize "Add to Cart" buttons with product data
  const shopButtons = document.querySelectorAll(".shop-button");
  shopButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productCard = this.closest(".product-card");
      if (!productCard) return;

      const productName = productCard.querySelector("h3").textContent;
      const priceText = productCard.querySelector(".price").textContent;
      const productPrice = parseFloat(priceText.replace("$", ""));
      const productImageElement = productCard.querySelector(".product-image");
      const productImage = productImageElement
        ? productImageElement.style.backgroundImage.slice(5, -2)
        : "assets/images/default-product.jpg";
      const productDescription = productCard.querySelector("p").textContent;

      // Create unique ID from product name
      const productId = productName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      const product = {
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        description: productDescription,
      };

      cart.addItem(product);
    });
  });

  // Initialize product page "Add to Cart" buttons
  const productAddCartButtons = document.querySelectorAll(".product-add-cart");
  productAddCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productInfo = this.closest(".product-info");
      if (!productInfo) return;

      const productName = productInfo.querySelector("h1").textContent;
      const priceText = productInfo.querySelector(".product-price").textContent;
      const productPrice = parseFloat(priceText.replace("$", ""));
      const productDescription =
        productInfo.querySelector(".product-tagline").textContent;
      const mainImage = document.querySelector(".main-image img");
      const productImage = mainImage
        ? mainImage.src
        : "assets/images/default-product.jpg";

      // Get quantity
      const quantityInput = productInfo.querySelector(".quantity-input");
      const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

      // Create unique ID from product name
      const productId = productName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      const product = {
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        description: productDescription,
      };

      // Add the specified quantity
      for (let i = 0; i < quantity; i++) {
        cart.addItem(product);
      }
    });
  });
});
