// ===========================
// Slide 2: メニュー画面
// ===========================

// メニューとフッターの共通HTML部品
function menuSidebar() {
  return `
    <div class="menu-sidebar">
      ${CATEGORIES.map(cat => `
        <div class="cat-tab${cat === state.currentCategory ? ' active' : ''}" data-cat="${cat}">${cat}</div>
      `).join('')}
    </div>
  `;
}

function menuFooter(minimal = false) {
  const cartCount = state.cart.reduce((s, c) => s + c.qty, 0);
  return `
    <div class="menu-footer">
      <button class="footer-btn" id="btn-call-checkout">
        <span class="footer-icon">🔔</span>
        ${!minimal ? '<span class="footer-label">呼び出し・会計</span>' : ''}
      </button>
      <button class="footer-btn" id="btn-history">
        <span class="footer-icon">📄</span>
        ${!minimal ? '<span class="footer-label">注文履歴</span>' : ''}
      </button>
      <button class="footer-btn" id="btn-cart">
        <span class="footer-icon">🛒</span>
        ${!minimal ? '<span class="footer-label">カートを確認</span>' : ''}
        ${cartCount > 0 ? `<span class="cart-badge">${cartCount}</span>` : ''}
      </button>
    </div>
  `;
}

function menuItemsHTML(dimmed = false) {
  const items = MENU_DATA[state.currentCategory] || [];
  return `
    <div class="menu-items${dimmed ? ' dimmed' : ''}" id="menu-items">
      ${items.map(item => `
        <div class="menu-item-card" data-id="${item.id}">
          <div class="menu-item-emoji">${item.img}</div>
          <div class="menu-item-info">
            <div class="menu-item-name">${item.name}</div>
            ${item.desc ? `<div class="menu-item-desc">${item.desc}</div>` : ''}
            <div class="menu-item-price">¥${item.price.toLocaleString()}（税込）</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function screenMenu() {
  return `
    <div class="screen screen-menu">
      ${menuSidebar()}
      <div class="menu-main">
        ${menuItemsHTML()}
        ${menuFooter()}
      </div>
    </div>
  `;
}

function attachMenuEvents() {
  // カテゴリタブ
  document.querySelectorAll('.cat-tab').forEach(el => {
    el.addEventListener('click', () => {
      state.currentCategory = el.dataset.cat;
      document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
      el.classList.add('active');
      renderMenuContent();
    });
  });

  // メニューアイテム
  attachMenuItemEvents();

  // フッター
  document.getElementById('btn-call-checkout')?.addEventListener('click', () => goto('call_checkout'));
  document.getElementById('btn-history')?.addEventListener('click', () => goto('history'));
  document.getElementById('btn-cart')?.addEventListener('click', () => goto('cart'));
}

function attachMenuItemEvents() {
  document.querySelectorAll('.menu-item-card').forEach(el => {
    el.addEventListener('click', () => {
      const id = parseInt(el.dataset.id);
      const cat = MENU_DATA[state.currentCategory];
      state.selectedItem = cat?.find(i => i.id === id);
      state.selectedQty = 1;
      goto('qty_select');
    });
  });
}

function renderMenuContent() {
  const el = document.getElementById('menu-items');
  if (!el) return;
  const items = MENU_DATA[state.currentCategory] || [];
  el.innerHTML = items.map(item => `
    <div class="menu-item-card" data-id="${item.id}">
      <div class="menu-item-emoji">${item.img}</div>
      <div class="menu-item-info">
        <div class="menu-item-name">${item.name}</div>
        ${item.desc ? `<div class="menu-item-desc">${item.desc}</div>` : ''}
        <div class="menu-item-price">¥${item.price.toLocaleString()}（税込）</div>
      </div>
    </div>
  `).join('');
  attachMenuItemEvents();
}
