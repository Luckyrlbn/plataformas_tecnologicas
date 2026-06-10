import { formatCOP } from './utils.js';
import { getCart, getCartTotal, onCartChange, removeFromCart } from './cart.js';

let cartPanelOpen = false;

// Renderiza el contenido del carrito en el panel lateral
export function renderCartPanel() {
  const body = document.getElementById("cartBody");
  if (!body) return;
  const cart = getCart();
  if (cart.length === 0) {
    body.innerHTML = `<div class="empty"><div class="empty-icon">🦐</div><p>Tu carrito está vacío</p></div>`;
    return;
  }
  body.innerHTML = cart.map(i => `
    <div class="ci" data-cart-id="${i.cartId}">
      <span class="ci-e">${i.emoji}</span>
      <div class="ci-info">
        <div class="ci-name">${i.nombre}</div>
        <div class="ci-sub">${i.weight < 1 ? i.weight*1000+"g" : i.weight+" kg"} × ${formatCOP(i.precio)}/${i.unidad}</div>
        <div class="ci-price">${formatCOP(i.subtotal)}</div>
      </div>
      <button class="ci-del" data-remove="${i.cartId}" aria-label="Eliminar">🗑️</button>
    </div>
  `).join("");
}

// Actualiza el contador del carrito, el total y el botón de checkout
export function updateCartUI() {
  const count = getCart().length;
  const countEl = document.getElementById("cartCount");
  if (countEl) {
    countEl.style.display = count > 0 ? "flex" : "none";
    countEl.textContent = count;
  }
  const total = getCartTotal();
  const cartTotalSpan = document.getElementById("cartTotal");
  if (cartTotalSpan) cartTotalSpan.textContent = formatCOP(total);
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) checkoutBtn.disabled = count === 0;
  
  // Si el panel del carrito está abierto, refrescar su contenido
  if (cartPanelOpen) renderCartPanel();
}

// Abre el panel lateral del carrito
export function openCart() {
  cartPanelOpen = true;
  renderCartPanel();
  document.getElementById("cartOverlay").style.display = "block";
}

// Cierra el panel lateral del carrito
export function closeCart() {
  cartPanelOpen = false;
  document.getElementById("cartOverlay").style.display = "none";
}

// Resetea la pantalla de éxito y vuelve al inicio
export function resetSuccess() {
  document.getElementById("successScreen").style.display = "none";
  // showPage se inyecta desde main o se accede globalmente
  if (typeof window.showPage === 'function') {
    window.showPage("home");
  } else {
    // Fallback: forzar recarga de página o simplemente ocultar
    location.reload();
  }
}

// Suscribirse a cambios del carrito para mantener la UI sincronizada
onCartChange(() => {
  updateCartUI();
  if (cartPanelOpen) renderCartPanel();
});