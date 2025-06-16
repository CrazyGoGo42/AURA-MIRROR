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

  // Gentle parallax effect for shop hero
  function initShopParallax() {
    const shopHero = document.querySelector(".shop-hero");

    if (!shopHero) return;

    function updateShopParallax() {
      const scrollTop = window.pageYOffset;
      const heroRect = shopHero.getBoundingClientRect();
      const heroTop = heroRect.top + scrollTop;

      // Only apply parallax when hero is in viewport
      if (heroRect.bottom >= 0 && heroRect.top <= window.innerHeight) {
        const yPos = (scrollTop - heroTop) * 0.3;
        const decorations = shopHero.querySelector(".shop-hero-decorations");
        const icon = shopHero.querySelector(".shop-hero-icon");

        if (decorations) {
          decorations.style.transform = `translateY(${yPos}px)`;
        }

        if (icon) {
          icon.style.transform = `translateY(${yPos * 0.5}px) scale(1)`;
        }
      }
    }

    let ticking = false;

    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(updateShopParallax);
        ticking = true;
      }
    }

    function handleScroll() {
      requestTick();
      ticking = false;
    }

    window.addEventListener("scroll", handleScroll);
    updateShopParallax(); // Initial call
  }

  // Initialize shop parallax
  initShopParallax();

  // Enhanced scroll animations with Intersection Observer
  function initScrollAnimations() {
    // Remove scroll-based reveals for immediate luxury feel
    const productCards = document.querySelectorAll(".product-card");
    productCards.forEach((card, index) => {
      // Remove animation delays and paused states
      card.style.animationPlayState = "running";
      card.classList.add("animate-in");

      // Add immediate sophisticated hover effects
      card.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-15px) scale(1.02)";
        this.style.boxShadow = "0 25px 70px rgba(0, 0, 0, 0.15)";
      });

      card.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0) scale(1)";
        this.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.06)";
      });
    });

    // Keep featured cards but make them immediately visible
    const featuredCards = document.querySelectorAll(".featured-card");
    featuredCards.forEach((card) => {
      card.classList.add("animate-in");
    });

    // Make category items immediately visible
    const categoryItems = document.querySelectorAll(".category-item");
    categoryItems.forEach((item, index) => {
      item.style.animationDelay = "0s";
      item.classList.add("animate-in");
    });
  }

  // Initialize scroll animations
  initScrollAnimations();

  // Add luxurious parallax effect for hero section
  function initLuxuriousParallax() {
    const hero = document.querySelector(".shop-hero");
    const decorations = document.querySelectorAll(".beauty-element");

    if (!hero) return;

    function updateParallax() {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;

      decorations.forEach((decoration, index) => {
        const speed = 0.3 + index * 0.1;
        decoration.style.transform = `translateY(${scrolled * speed}px) scale(${
          0.5 + index * 0.1
        })`;
      });

      // Subtle hero content parallax
      const heroContent = hero.querySelector(".shop-hero-content");
      if (heroContent) {
        heroContent.style.transform = `translateY(${rate * 0.2}px)`;
      }
    }

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
    updateParallax();
  }

  // Enhanced product card interactions with luxury effects
  function enhanceProductCards() {
    const productCards = document.querySelectorAll(".product-card");

    productCards.forEach((card) => {
      // Add sophisticated magnetic effect on mouse move
      card.addEventListener("mousemove", function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;

        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.02)`;
      });

      card.addEventListener("mouseleave", function () {
        this.style.transform =
          "perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)";
      });

      // Enhanced button interactions with immediate luxury response
      const button = card.querySelector(".shop-button");
      if (button) {
        button.addEventListener("mouseenter", function () {
          this.style.transform = "translateY(-3px) scale(1.05)";
          this.style.boxShadow = "0 12px 30px rgba(200, 162, 125, 0.5)";
        });

        button.addEventListener("mouseleave", function () {
          this.style.transform = "translateY(0) scale(1)";
          this.style.boxShadow = "0 8px 25px rgba(200, 162, 125, 0.4)";
        });

        button.addEventListener("click", function (e) {
          // Create refined ripple effect
          const ripple = document.createElement("div");
          const rect = this.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          const x = e.clientX - rect.left - size / 2;
          const y = e.clientY - rect.top - size / 2;

          ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: luxuryRipple 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
          `;

          this.appendChild(ripple);

          setTimeout(() => {
            ripple.remove();
          }, 600);
        });
      }

      // Add subtle product image hover effects
      const productImage = card.querySelector(".product-image");
      if (productImage) {
        card.addEventListener("mouseenter", function () {
          productImage.style.transform = "scale(1.05)";
        });

        card.addEventListener("mouseleave", function () {
          productImage.style.transform = "scale(1)";
        });
      }
    });
  }

  // Initialize luxury parallax
  initLuxuriousParallax();

  // Enhanced CSS for immediate luxury feel
  const enhancedStyle = document.createElement("style");
  enhancedStyle.textContent = `
    @keyframes luxuryRipple {
      to {
        transform: scale(2.5);
        opacity: 0;
      }
    }
    
    .animate-in {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
    
    .product-card {
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .product-image {
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .product-badge {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .shop-button {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
  `;
  document.head.appendChild(enhancedStyle);
});
