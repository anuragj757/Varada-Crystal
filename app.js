/**
 * VARADA CRYSTAL — Interactive Application Logic (app.js)
 * Multi-Page Cart Sync, Smooth Scroll & Luxury Interactivity Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initScrollReveal();
  initCartSystem();
  initAccordions();
  initCategoryDrawerEvents();
  initHeroParallaxHover();
});

/* ==========================================================================
   1. SILKY-SMOOTH SCROLL ENGINE WITH CUBIC EASING
   ========================================================================== */
function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      e.preventDefault();

      // Close drawer if open before scrolling
      closeCategoryDrawer();
      closeCart();

      // Trigger custom smooth scroll
      smoothScrollTo(targetElement, 750);
    }
  });
}

function smoothScrollTo(target, duration = 750) {
  const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
  if (!targetElement) return;

  const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 20;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    } else {
      window.scrollTo(0, targetPosition);
    }
  }

  function easeInOutCubic(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t * t + b;
    t -= 2;
    return (c / 2) * (t * t * t + 2) + b;
  }

  requestAnimationFrame(animation);
}

/* ==========================================================================
   2. SCROLL-DRIVEN ENTRANCE REVEAL ANIMATIONS
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.spotlight-card, .benefit-card-light, .spec-box-light, .usage-step-card-light, .review-card-light, .comparison-table-light-wrapper, .product-card-light, .section-header');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  revealElements.forEach(el => {
    el.classList.add('reveal-item');
    revealObserver.observe(el);
  });
}

/* ==========================================================================
   3. CATEGORY SLIDE-OUT DRAWER
   ========================================================================== */
function openCategoryDrawer() {
  const drawer = document.getElementById('categoryDrawerOverlay');
  if (drawer) {
    drawer.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false');
  }
}

function closeCategoryDrawer() {
  const drawer = document.getElementById('categoryDrawerOverlay');
  if (drawer) {
    drawer.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true');
  }
}

function initCategoryDrawerEvents() {
  const drawerOverlay = document.getElementById('categoryDrawerOverlay');
  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', (e) => {
      if (e.target === drawerOverlay) {
        closeCategoryDrawer();
      }
    });
  }
}

/* ==========================================================================
   4. CATEGORY FILTERING ENGINE (ON SHOP PAGE)
   ========================================================================== */
function filterCatalog(category) {
  const filterBtns = document.querySelectorAll('.category-pill-btn-light');
  const cards = document.querySelectorAll('.product-card-light');

  // Update active pill state
  filterBtns.forEach(btn => {
    if (btn.getAttribute('data-category') === category) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Filter cards with smooth opacity animation
  cards.forEach(card => {
    const cardCategory = card.getAttribute('data-category');
    if (category === 'all' || cardCategory === category) {
      card.style.display = 'flex';
      card.style.opacity = '0';
      card.style.transform = 'translateY(15px)';
      setTimeout(() => {
        card.style.transition = 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 50);
    } else {
      card.style.display = 'none';
    }
  });
}

/* ==========================================================================
   5. HERO PARALLAX & TILT TRANSITIONS (ON HOME PAGE)
   ========================================================================== */
function initHeroParallaxHover() {
  const heroViewport = document.getElementById('hero');
  const primaryCard = document.querySelector('.editorial-photo-primary');
  const secondaryCard = document.querySelector('.editorial-photo-secondary');
  const giantTitle = document.querySelector('.editorial-giant-title');

  if (!heroViewport || window.innerWidth <= 992) return;

  heroViewport.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    const xOffset = (clientX / innerWidth - 0.5) * 20;
    const yOffset = (clientY / innerHeight - 0.5) * 20;

    if (primaryCard) {
      primaryCard.style.transform = `translate3d(${-xOffset * 0.8}px, ${-yOffset * 0.8}px, 0)`;
    }
    if (secondaryCard) {
      secondaryCard.style.transform = `translate3d(${xOffset * 1.2}px, ${yOffset * 1.2}px, 0) rotate(${1 + xOffset * 0.05}deg)`;
    }
    if (giantTitle) {
      giantTitle.style.transform = `translate3d(${xOffset * 0.4}px, ${yOffset * 0.4}px, 0)`;
    }
  });

  heroViewport.addEventListener('mouseleave', () => {
    if (primaryCard) primaryCard.style.transform = 'translate3d(0, 0, 0)';
    if (secondaryCard) secondaryCard.style.transform = 'translate3d(0, 0, 0)';
    if (giantTitle) giantTitle.style.transform = 'translate3d(0, 0, 0)';
  });
}

/* ==========================================================================
   6. PERSISTENT SHOPPING CART & COMMERCE ENGINE (LOCALSTORAGE SYNC)
   ========================================================================== */
let cart = loadCartFromStorage();

function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem('varada_cart');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error(e);
  }
  return [
    {
      name: 'Single Bottle (100ml)',
      price: 349,
      quantity: 1
    }
  ];
}

function saveCartToStorage() {
  try {
    localStorage.setItem('varada_cart', JSON.stringify(cart));
  } catch (e) {
    console.error(e);
  }
}

function initCartSystem() {
  const cartToggleBtn = document.getElementById('cartToggleBtn');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartOverlay = document.getElementById('cartOverlay');

  if (cartToggleBtn) {
    cartToggleBtn.addEventListener('click', openCart);
  }

  if (cartCloseBtn) {
    cartCloseBtn.addEventListener('click', closeCart);
  }

  if (cartOverlay) {
    cartOverlay.addEventListener('click', (e) => {
      if (e.target === cartOverlay) {
        closeCart();
      }
    });
  }

  renderCart();
}

function openCart() {
  const cartOverlay = document.getElementById('cartOverlay');
  if (cartOverlay) {
    cartOverlay.classList.add('active');
    cartOverlay.setAttribute('aria-hidden', 'false');
  }
}

function closeCart() {
  const cartOverlay = document.getElementById('cartOverlay');
  if (cartOverlay) {
    cartOverlay.classList.remove('active');
    cartOverlay.setAttribute('aria-hidden', 'true');
  }
}

function addToCart(name, price, qty = 1) {
  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity += qty;
  } else {
    cart.push({ name, price, quantity: qty });
  }

  saveCartToStorage();
  renderCart();
  openCart();
  showToast(`Added ${name} to your bag!`);
}

function updateCartItemQty(index, change) {
  if (!cart[index]) return;
  cart[index].quantity += change;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }
  saveCartToStorage();
  renderCart();
}

function renderCart() {
  const cartList = document.getElementById('cartItemsList');
  const cartCountBadge = document.getElementById('cartCountBadge');
  const drawerCartCount = document.getElementById('drawerCartCount');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const shippingFill = document.getElementById('shippingMeterFill');
  const shippingText = document.getElementById('shippingMeterText');

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cartCountBadge) cartCountBadge.textContent = totalItems;
  if (drawerCartCount) drawerCartCount.textContent = totalItems;
  if (cartSubtotal) cartSubtotal.textContent = `₹${subtotal.toFixed(2)}`;

  // Free shipping progress logic (Threshold ₹499)
  if (shippingFill && shippingText) {
    const freeShippingThreshold = 499;
    if (subtotal >= freeShippingThreshold) {
      shippingFill.style.width = '100%';
      shippingText.innerHTML = '🎉 <strong>FREE EXPRESS SHIPPING UNLOCKED!</strong>';
    } else {
      const remaining = freeShippingThreshold - subtotal;
      const progressPercent = Math.min(100, Math.max(10, (subtotal / freeShippingThreshold) * 100));
      shippingFill.style.width = `${progressPercent}%`;
      shippingText.innerHTML = `Add <strong>₹${remaining.toFixed(0)}</strong> more for <strong>FREE SHIPPING!</strong>`;
    }
  }

  if (!cartList) return;

  if (cart.length === 0) {
    cartList.innerHTML = `
      <div class="empty-cart-state" id="emptyCartState">
        <div class="empty-icon">🛍️</div>
        <p>Your bag is currently empty.</p>
        <a href="shop.html" class="btn btn-blue btn-sm" onclick="closeCart()">Explore Store</a>
      </div>
    `;
    return;
  }

  let html = '';
  cart.forEach((item, index) => {
    html += `
      <div class="cart-item-card">
        <div class="cart-item-meta">
          <h4>${item.name}</h4>
          <span>₹${item.price} each</span>
        </div>
        <div class="cart-item-actions">
          <button class="qty-btn" onclick="updateCartItemQty(${index}, -1)" aria-label="Decrease quantity">−</button>
          <span style="font-weight:700; min-width:20px; text-align:center;">${item.quantity}</span>
          <button class="qty-btn" onclick="updateCartItemQty(${index}, 1)" aria-label="Increase quantity">+</button>
        </div>
      </div>
    `;
  });

  cartList.innerHTML = html;
}

/* ==========================================================================
   7. NOTIFY ME / PRE-ORDER MODAL ENGINE
   ========================================================================== */
let activeNotifyProduct = '';

function openNotifyModal(productName) {
  activeNotifyProduct = productName;
  const modal = document.getElementById('notifyModal');
  const title = document.getElementById('notifyModalTitle');
  const desc = document.getElementById('notifyModalDesc');

  if (title) title.textContent = `Get Early Access: ${productName}`;
  if (desc) desc.textContent = `We will notify you immediately once ${productName} is ready to dispatch with an exclusive 20% launch code!`;

  if (modal) {
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
  }
}

function closeNotifyModal() {
  const modal = document.getElementById('notifyModal');
  if (modal) {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
  }
}

function submitNotifyForm(e) {
  e.preventDefault();
  const input = document.getElementById('notifyEmailInput');
  closeNotifyModal();
  if (input) input.value = '';
  showToast(`🎉 You're on the VIP list for ${activeNotifyProduct || 'new arrivals'}!`);
}

/* ==========================================================================
   8. ACCORDIONS (FAQS)
   ========================================================================== */
function initAccordions() {
  const faqQuestions = document.querySelectorAll('.faq-question-light');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const answer = btn.nextElementSibling;

      faqQuestions.forEach(otherBtn => {
        if (otherBtn !== btn) {
          otherBtn.setAttribute('aria-expanded', 'false');
          if (otherBtn.nextElementSibling) {
            otherBtn.nextElementSibling.classList.remove('show');
          }
        }
      });

      btn.setAttribute('aria-expanded', !isExpanded);
      if (answer) {
        answer.classList.toggle('show');
      }
    });
  });
}

/* ==========================================================================
   9. CHECKOUT TRIGGER & MODAL
   ========================================================================== */
function triggerCheckout() {
  if (cart.length === 0) {
    showToast('Your bag is empty! Please add a product to checkout.');
    return;
  }

  closeCart();
  const modal = document.getElementById('checkoutModal');
  const summaryBox = document.getElementById('modalOrderSummary');

  if (summaryBox) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 499 ? 'FREE' : '₹49.00';

    summaryBox.innerHTML = `
      <p style="margin-bottom: 6px;"><strong>Items Ordered:</strong> ${totalItems} item(s)</p>
      <ul style="list-style: none; margin-bottom: 8px; color: var(--text-light-muted);">
        ${cart.map(item => `<li>• ${item.name} x ${item.quantity} (₹${item.price * item.quantity})</li>`).join('')}
      </ul>
      <p style="border-top: 1px solid var(--border-subtle); padding-top: 6px;"><strong>Shipping:</strong> ${shipping}</p>
      <p style="font-size: 1.05rem; color: var(--color-blue-azure); font-weight: 800;"><strong>Total Payable:</strong> ₹${subtotal.toFixed(2)}</p>
    `;
  }

  if (modal) {
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
  }
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkoutModal');
  if (modal) {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
  }
}

/* ==========================================================================
   10. TOAST NOTIFICATIONS
   ========================================================================== */
function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00B4D8" stroke-width="2.5">
      <path d="M20 6L9 17L4 12"/>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3200);
}
