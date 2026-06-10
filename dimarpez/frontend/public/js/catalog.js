import { formatCOP } from './utils.js';
import { addToCart, getCart } from './cart.js';
import { PRODUCTS, WEIGHT_OPTIONS } from '../services/api.js';

let currentFilter = "Todos";

export function renderProductCard(product, container) {
  const noStock = product.stock <= 0;
  const card = document.createElement('div');
  card.className = "pcard";
  card.innerHTML = `
    <div class="p-emoji">${product.emoji}</div>
    <div class="p-cat">${product.categoria}</div>
    <div class="p-name">${product.nombre}</div>
    <div class="p-desc">${product.descripcion}</div>
    <div class="p-price">${formatCOP(product.precio)} <small>/ ${product.unidad}</small></div>
    <div class="p-stock">📦 ${product.stock} ${product.unidad} disponibles</div>
    <select class="wselect" data-product-id="${product.id}" ${noStock ? "disabled" : ""}>
      ${WEIGHT_OPTIONS.map(w => `<option value="${w}">${w < 1 ? w*1000+"g" : w+" kg"} — ${formatCOP(product.precio * w)}</option>`).join("")}
    </select>
    <button class="add-btn" data-add-id="${product.id}" ${noStock ? "disabled" : ""}>${noStock ? "Sin stock" : "+ Agregar al carrito"}</button>
  `;
  const select = card.querySelector('.wselect');
  if (select) select.value = "0.5";
  container.appendChild(card);
}

export function renderFeatured() {
  const grid = document.getElementById("featuredGrid");
  if (!grid) return;
  grid.innerHTML = "";
  const featured = PRODUCTS.filter(p => p.activo).slice(0, 4);
  featured.forEach(p => renderProductCard(p, grid));
}

export function renderCatalog() {
  const grid = document.getElementById("catalogGrid");
  if (!grid) return;
  grid.innerHTML = "";
  const categories = ["Todos", ...new Set(PRODUCTS.filter(p=>p.activo).map(p=>p.categoria))];
  const filterContainer = document.getElementById("filterBtns");
  if (filterContainer) {
    filterContainer.innerHTML = "";
    categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.className = `filter${cat === currentFilter ? " on" : ""}`;
      btn.textContent = cat;
      btn.dataset.filter = cat;
      filterContainer.appendChild(btn);
    });
  }
  const filtered = currentFilter === "Todos" ? PRODUCTS.filter(p => p.activo) : PRODUCTS.filter(p => p.activo && p.categoria === currentFilter);
  filtered.forEach(p => renderProductCard(p, grid));
}

export function setFilter(filter) {
  currentFilter = filter;
  renderCatalog();
}