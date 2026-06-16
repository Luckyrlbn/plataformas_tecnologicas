// public/js/checkout.js
import { formatCOP } from './utils.js';
import { getCart, getCartTotal, clearCart } from './cart.js';
import { showToast } from './utils.js';
import { closeCart } from './ui.js';
import { getCurrentUser, openAuth } from './auth.js';
import { createOrder } from '@services/api.js';

let selectedPay = "";

export function openCheckout() {
  if (!getCurrentUser()) {
    showToast("⚠️ Debes iniciar sesión para pagar", true);
    openAuth();
    return;
  }
  if (getCart().length === 0) {
    showToast("🛒 Carrito vacío", true);
    return;
  }
  closeCart();
  selectedPay = "";
  document.querySelectorAll(".pay-opt").forEach(el => el.classList.remove("on"));

  const user = getCurrentUser();
  const nameInput = document.getElementById("chkName");
  if (nameInput && user) nameInput.value = user.nombre || "";
  const aliasInput = document.getElementById("chkAlias");
  if (aliasInput && user) aliasInput.value = user.alias || "";
  const addressInput = document.getElementById("chkAddress");
  if (addressInput && user) addressInput.value = user.direccion || "";
  const noteInput = document.getElementById("chkNote");
  if (noteInput) noteInput.value = "";
  const err = document.getElementById("chkError");
  if (err) err.style.display = "none";

  updateOrderSummary();
  const modal = document.getElementById("checkoutModal");
  if (modal) modal.style.display = "flex";
}

export function closeCheckout() {
  const modal = document.getElementById("checkoutModal");
  if (modal) modal.style.display = "none";
}

export function selectPay(el, method) {
  document.querySelectorAll(".pay-opt").forEach(e => e.classList.remove("on"));
  el.classList.add("on");
  selectedPay = method;
}

function updateOrderSummary() {
  const cart = getCart();
  const total = getCartTotal();
  const container = document.getElementById("orderSummaryItems");
  if (container) {
    container.innerHTML = cart.map(i =>
      `<div class="sum-item"><span>${i.nombre} ${i.weight < 1 ? i.weight * 1000 + "g" : i.weight + " kg"}</span><span>${formatCOP(i.subtotal)}</span></div>`
    ).join("");
  }
  const totalSpan = document.getElementById("orderSummaryTotal");
  if (totalSpan) totalSpan.textContent = formatCOP(total);
  const confirmBtn = document.getElementById("confirmBtn");
  if (confirmBtn) confirmBtn.textContent = `✅ Confirmar pedido · ${formatCOP(total)}`;
}

export async function confirmOrder() {
  if (!getCurrentUser()) {
    showToast("Debes iniciar sesión", true);
    closeCheckout();
    openAuth();
    return;
  }

  const name    = document.getElementById("chkName")?.value.trim();
  const alias   = document.getElementById("chkAlias")?.value.trim() || "";
  const address = document.getElementById("chkAddress")?.value.trim();
  const note    = document.getElementById("chkNote")?.value.trim() || "";
  const errEl   = document.getElementById("chkError");

  if (!name || !address || !selectedPay) {
    if (errEl) {
      errEl.textContent = "⚠️ Completa todos los campos obligatorios y selecciona método de pago.";
      errEl.style.display = "block";
    }
    return;
  }
  if (errEl) errEl.style.display = "none";

  const user  = getCurrentUser();
  const cart  = getCart();
  const total = getCartTotal();

  // Construir el cuerpo del pedido según el modelo de Spring Boot
  const orderBody = {
    codigo:     `#${Math.floor(10000 + Math.random() * 90000)}`,
    nombre:     name,
    alias:      alias,
    direccion:  address,
    metodoPago: selectedPay,
    nota:       note,
    total:      total,
    estado:     "Pendiente",
    perfil: { id: user.id },
    items: cart.map(i => ({
      nombre:     i.nombre,
      precioUnit: i.precio,
      cantidadKg: i.weight,
      subtotal:   i.subtotal,
      producto:   { id: i.id }
    }))
  };

  const confirmBtn = document.getElementById("confirmBtn");
  if (confirmBtn) {
    confirmBtn.disabled = true;
    confirmBtn.textContent = "⏳ Guardando pedido...";
  }

  try {
    await createOrder(orderBody);
    clearCart();
    closeCheckout();
    const success = document.getElementById("successScreen");
    if (success) success.style.display = "flex";
    showToast("✅ Pedido confirmado y guardado");
  } catch (error) {
    showToast("❌ Error al guardar el pedido: " + error.message, true);
    if (confirmBtn) {
      confirmBtn.disabled = false;
      confirmBtn.textContent = `✅ Confirmar pedido · ${formatCOP(total)}`;
    }
  }
}

export function initPayOptions() {
  const grid = document.getElementById("payGrid");
  if (!grid) return;
  grid.innerHTML = `
    <div class="pay-opt" data-pay="Efectivo">💵 Efectivo</div>
    <div class="pay-opt" data-pay="Nequi">💜 Nequi</div>
    <div class="pay-opt" data-pay="Daviplata">🔴 Daviplata</div>
    <div class="pay-opt" data-pay="Transferencia Bancaria">🏦 Transferencia Bancaria</div>
  `;
  grid.querySelectorAll(".pay-opt").forEach(opt => {
    opt.addEventListener("click", () => selectPay(opt, opt.dataset.pay));
  });
}
