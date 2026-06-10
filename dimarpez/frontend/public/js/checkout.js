import { formatCOP, showToast } from './utils.js';
import { getCart, getCartTotal, clearCart } from './cart.js';
import { closeCart } from './ui.js';

let selectedPay = "";

export function openCheckout() {
  if (getCart().length === 0) return;
  closeCart();
  selectedPay = "";
  document.querySelectorAll(".pay-opt").forEach(el => el.classList.remove("on"));
  document.getElementById("chkName").value = "";
  document.getElementById("chkAlias").value = "";
  document.getElementById("chkAddress").value = "";
  document.getElementById("chkNote").value = "";
  document.getElementById("chkError").style.display = "none";
  updateOrderSummary();
  document.getElementById("checkoutModal").style.display = "flex";
}

export function closeCheckout() {
  document.getElementById("checkoutModal").style.display = "none";
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
      `<div class="sum-item"><span>${i.nombre} ${i.weight < 1 ? i.weight*1000+"g" : i.weight+"kg"}</span><span>${formatCOP(i.subtotal)}</span></div>`
    ).join("");
  }
  document.getElementById("orderSummaryTotal").textContent = formatCOP(total);
  const confirmBtn = document.getElementById("confirmBtn");
  if (confirmBtn) confirmBtn.textContent = `✅ Confirmar pedido · ${formatCOP(total)}`;
}

export function confirmOrder() {
  const name = document.getElementById("chkName").value.trim();
  const address = document.getElementById("chkAddress").value.trim();
  const errEl = document.getElementById("chkError");
  if (!name || !address || !selectedPay) {
    errEl.textContent = "⚠️ Completa los campos obligatorios y selecciona método de pago.";
    errEl.style.display = "block";
    return;
  }
  errEl.style.display = "none";
  closeCheckout();
  clearCart();
  // mostrar pantalla de éxito (manejado en main.js)
  document.getElementById("successScreen").style.display = "flex";
}

// Inicializar opciones de pago en el modal
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
    opt.addEventListener("click", (e) => {
      selectPay(opt, opt.dataset.pay);
    });
  });
}