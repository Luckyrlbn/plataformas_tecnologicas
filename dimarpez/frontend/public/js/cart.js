import { showToast } from './utils.js';

let cart = [];
let cartListeners = [];

// Persistencia
function loadCart() {
  try {
    const saved = sessionStorage.getItem('dimarpez_cart');
    if (saved) cart = JSON.parse(saved);
  } catch(e) { cart = []; }
}
function persistCart() {
  sessionStorage.setItem('dimarpez_cart', JSON.stringify(cart));
}

export function getCart() {
  return [...cart];
}

export function addToCart(product, weight) {
  if (product.stock <= 0) {
    showToast("Producto sin stock", true);
    return false;
  }
  const subtotal = product.precio * weight;
  const newItem = {
    ...product,
    weight,
    subtotal,
    cartId: Date.now() + Math.random() * 10000
  };
  cart.push(newItem);
  persistCart();
  notifyListeners();
  showToast(`✓ ${product.nombre} agregado`);
  return true;
}

export function removeFromCart(cartId) {
  cart = cart.filter(i => i.cartId !== cartId);
  persistCart();
  notifyListeners();
}

export function clearCart() {
  cart = [];
  persistCart();
  notifyListeners();
}

export function getCartTotal() {
  return cart.reduce((s, i) => s + i.subtotal, 0);
}

export function onCartChange(listener) {
  cartListeners.push(listener);
  return () => { cartListeners = cartListeners.filter(l => l !== listener); };
}

function notifyListeners() {
  cartListeners.forEach(l => l(cart));
}

// Inicializar carga
loadCart();