// public/js/main.js
import { loadProductsAndRender, renderCatalog, setFilter } from './catalog.js';
import { updateCartUI, openCart, closeCart, resetSuccess } from './ui.js';
import { openCheckout, closeCheckout, confirmOrder, initPayOptions } from './checkout.js';
import { openAuth, closeAuth, handleAuth, switchAuthTab } from './auth.js';
import { addToCart, removeFromCart } from './cart.js';
import { showToast } from './utils.js';
import { fetchProducts } from '@services/api.js'; 
import { updateAuthButton } from './auth.js';

// Navegación

function showPage(pageName) {
  document.querySelectorAll("[data-page]").forEach(el => el.classList.remove("active"));
  const page = document.getElementById(`page-${pageName}`);
  if (page) page.classList.add("active");
  document.querySelectorAll(".nav-link").forEach(el => el.classList.remove("active"));
  const activeNav = document.querySelector(`.nav-link[data-nav="${pageName}"]`);
  if (activeNav) activeNav.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (pageName === "catalog") renderCatalog();
}
window.showPage = showPage;

// Delegación de eventos global
function setupDelegation() {
  document.body.addEventListener("click", async (e) => {
    // Agregar al carrito
    const addBtn = e.target.closest(".add-btn");
    if (addBtn && addBtn.dataset.addId) {
      e.preventDefault();
      const productId = parseInt(addBtn.dataset.addId);
      const card = addBtn.closest(".pcard");
      const select = card?.querySelector(".wselect");
      if (select) {
        // Obtener todos los productos (o podríamos obtener solo uno por ID)
        const products = await fetchProducts();
        const product = products.find(p => p.id === productId);
        if (product) {
          const weight = parseFloat(select.value);
          addToCart(product, weight);
        }
      }
      return;
    }
    // Eliminar del carrito
    const removeBtn = e.target.closest(".ci-del");
    if (removeBtn && removeBtn.dataset.remove) {
      const cartId = parseFloat(removeBtn.dataset.remove);
      removeFromCart(cartId);
      return;
    }
    // Filtros
    const filterBtn = e.target.closest(".filter");
    if (filterBtn && filterBtn.dataset.filter) {
      setFilter(filterBtn.dataset.filter);
      return;
    }
  });
}

function bindStaticEvents() {
  document.querySelectorAll("[data-nav]").forEach(el => {
    el.addEventListener("click", () => showPage(el.dataset.nav));
  });
  document.getElementById("openCartBtn")?.addEventListener("click", openCart);
  document.getElementById("openAuthBtn")?.addEventListener("click", openAuth);
  document.querySelectorAll("[data-close-cart]").forEach(el => el.addEventListener("click", closeCart));
  document.getElementById("checkoutBtn")?.addEventListener("click", openCheckout);
  document.getElementById("closeCheckoutBtn")?.addEventListener("click", closeCheckout);
  document.getElementById("confirmBtn")?.addEventListener("click", confirmOrder);
  document.getElementById("resetSuccessBtn")?.addEventListener("click", resetSuccess);
  document.getElementById("closeAuthBtn")?.addEventListener("click", closeAuth);
  document.getElementById("authBtn")?.addEventListener("click", handleAuth);
  document.querySelectorAll(".auth-tab").forEach(tab => {
    tab.addEventListener("click", () => switchAuthTab(tab.dataset.authTab));
  });
  document.getElementById("whatsappBtn")?.addEventListener("click", () => window.open('https://wa.me/573028561215','_blank'));
  
  window.addEventListener("scroll", () => {
    const nav = document.getElementById("mainNav");
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 10);
  });
}

async function init() {
  await loadProductsAndRender();
  updateAuthButton();  
  updateCartUI();
  initPayOptions();
  setupDelegation();
  bindStaticEvents();
}

init();