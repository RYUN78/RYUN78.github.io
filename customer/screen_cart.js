// ===========================
// Slide 4: カート一覧
// ===========================
function screenCart() {
  return `
    <div class="screen screen-menu">
      ${menuSidebar()}
      <div class="menu-main">
        ${menuItemsHTML(true)}
        <div class="qty-overlay">
          <div class="cart-modal">
            <div class="cart-modal-title">カート一覧</div>
            <div class="cart-list" id="cart-list">
              ${cartListHTML()}
            </div>
            <div class="cart-actions">
              <button class="secondary-btn" id="btn-cart-close">閉じる</button>
              <button class="primary-btn${state.cart.length === 0 ? ' disabled' : ''}"
                id="btn-order-confirm" ${state.cart.length === 0 ? 'disabled' : ''}>
                注文確定
              </button>
            </div>
          </div>
        </div>
        ${menuFooter(true)}
      </div>
    </div>
  `;
}

function cartListHTML() {
  if (state.cart.length === 0) {
    return '<div class="cart-empty">カートは空です</div>';
  }
  return state.cart.map(c => `
    <div class="cart-row">
      <div class="cart-row-name">${c.item.name}</div>
      <div class="cart-qty-ctrl">
        <button class="qty-btn cart-qty-minus" data-id="${c.item.id}">⊖</button>
        <span class="qty-num">${c.qty}</span>
        <button class="qty-btn cart-qty-plus" data-id="${c.item.id}">⊕</button>
      </div>
    </div>
  `).join('');
}

function attachCartEvents() {
  document.getElementById('btn-cart-close')?.addEventListener('click', () => goto('menu'));
  document.getElementById('btn-order-confirm')?.addEventListener('click', confirmOrder);
  attachCartQtyEvents();
}

function attachCartQtyEvents() {
  document.querySelectorAll('.cart-qty-plus').forEach(el => {
    el.addEventListener('click', () => updateCartQty(parseInt(el.dataset.id), 1));
  });
  document.querySelectorAll('.cart-qty-minus').forEach(el => {
    el.addEventListener('click', () => updateCartQty(parseInt(el.dataset.id), -1));
  });
}

function renderCart() {
  const el = document.getElementById('cart-list');
  if (!el) return;
  el.innerHTML = cartListHTML();
  attachCartQtyEvents();
}
