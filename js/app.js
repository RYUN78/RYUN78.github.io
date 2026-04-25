// ===========================
// アプリ状態管理
// ===========================
const state = {
  screen: 'checkin',       // 現在の画面
  adults: 0,
  children: 0,
  customerId: null,        // 入店後に発行
  tableNo: null,
  currentCategory: 'おすすめ',
  cart: [],                // {item, qty}
  orders: [],              // 確定済み注文 {item, qty, time}
  selectedItem: null,      // 数量選択中のアイテム
  selectedQty: 1,
  callMode: null,          // 'call' | 'checkout'
  checkoutData: null,      // 会計表示用
};

// ===========================
// 画面遷移
// ===========================
function goto(screen) {
  state.screen = screen;
  render();
}

// ===========================
// 入店処理
// ===========================
function checkin() {
  if (state.adults === 0 && state.children === 0) {
    alert('人数を入力してください');
    return;
  }
  // 顧客ID発行（7桁ゼロパディング）
  state.customerId = String(Math.floor(Math.random() * 9999999)).padStart(7, '0');
  state.tableNo = document.querySelector('#table-no')?.value || '3';
  goto('menu');
}

// ===========================
// カート操作
// ===========================
function addToCart(item, qty) {
  const existing = state.cart.find(c => c.item.id === item.id);
  if (existing) {
    existing.qty += qty;
  } else {
    state.cart.push({ item, qty });
  }
}

function updateCartQty(itemId, delta) {
  const entry = state.cart.find(c => c.item.id === itemId);
  if (!entry) return;
  entry.qty = Math.max(0, entry.qty + delta);
  if (entry.qty === 0) state.cart = state.cart.filter(c => c.item.id !== itemId);
  renderCart();
}

function confirmOrder() {
  if (state.cart.length === 0) return;
  const now = new Date().toISOString();
  state.cart.forEach(c => state.orders.push({ ...c, time: now }));
  state.cart = [];
  goto('order_confirmed');
  setTimeout(() => goto('menu'), 2000);
}

function cartTotal() {
  return state.cart.reduce((s, c) => s + c.item.price * c.qty, 0);
}

function ordersTotal() {
  return state.orders.reduce((s, c) => s + c.item.price * c.qty, 0);
}

// ===========================
// 画面レンダラー
// ===========================
function render() {
  const app = document.getElementById('app');
  switch (state.screen) {
    case 'checkin':        app.innerHTML = screenCheckin();        break;
    case 'menu':           app.innerHTML = screenMenu();           break;
    case 'qty_select':     app.innerHTML = screenQtySelect();      break;
    case 'item_added':     app.innerHTML = screenItemAdded();      break;
    case 'cart':           app.innerHTML = screenCart();           break;
    case 'order_confirmed':app.innerHTML = screenOrderConfirmed(); break;
    case 'history':        app.innerHTML = screenHistory();        break;
    case 'call_checkout':  app.innerHTML = screenCallCheckout();   break;
    case 'calling':        app.innerHTML = screenCalling();        break;
    case 'checkout_confirm':app.innerHTML = screenCheckoutConfirm(); break;
    case 'error':          app.innerHTML = screenError();          break;
    default:               app.innerHTML = screenError();
  }
  attachEvents();
}

// ===========================
// イベント登録（render後に呼ぶ）
// ===========================
function attachEvents() {
  // 入店画面
  document.getElementById('btn-checkin')?.addEventListener('click', checkin);
  document.getElementById('btn-adults-plus')?.addEventListener('click', () => { state.adults++; updateCheckinCount(); });
  document.getElementById('btn-adults-minus')?.addEventListener('click', () => { state.adults = Math.max(0, state.adults-1); updateCheckinCount(); });
  document.getElementById('btn-children-plus')?.addEventListener('click', () => { state.children++; updateCheckinCount(); });
  document.getElementById('btn-children-minus')?.addEventListener('click', () => { state.children = Math.max(0, state.children-1); updateCheckinCount(); });

  // カテゴリタブ
  document.querySelectorAll('.cat-tab').forEach(el => {
    el.addEventListener('click', () => {
      state.currentCategory = el.dataset.cat;
      renderMenuContent();
      document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
      el.classList.add('active');
    });
  });

  // メニューアイテム
  document.querySelectorAll('.menu-item-card').forEach(el => {
    el.addEventListener('click', () => {
      const id = parseInt(el.dataset.id);
      const cat = MENU_DATA[state.currentCategory];
      state.selectedItem = cat.find(i => i.id === id);
      state.selectedQty = 1;
      goto('qty_select');
    });
  });

  // 数量選択
  document.getElementById('btn-qty-plus')?.addEventListener('click', () => { state.selectedQty++; document.getElementById('qty-val').textContent = state.selectedQty; });
  document.getElementById('btn-qty-minus')?.addEventListener('click', () => { state.selectedQty = Math.max(1, state.selectedQty-1); document.getElementById('qty-val').textContent = state.selectedQty; });
  document.getElementById('btn-qty-confirm')?.addEventListener('click', () => {
    addToCart(state.selectedItem, state.selectedQty);
    goto('item_added');
    setTimeout(() => goto('menu'), 1500);
  });
  document.getElementById('btn-qty-back')?.addEventListener('click', () => goto('menu'));

  // カート画面
  document.getElementById('btn-cart-close')?.addEventListener('click', () => goto('menu'));
  document.getElementById('btn-order-confirm')?.addEventListener('click', confirmOrder);
  document.querySelectorAll('.cart-qty-plus').forEach(el => {
    el.addEventListener('click', () => { updateCartQty(parseInt(el.dataset.id), 1); });
  });
  document.querySelectorAll('.cart-qty-minus').forEach(el => {
    el.addEventListener('click', () => { updateCartQty(parseInt(el.dataset.id), -1); });
  });

  // フッターアイコン
  document.getElementById('btn-call-checkout')?.addEventListener('click', () => goto('call_checkout'));
  document.getElementById('btn-history')?.addEventListener('click', () => goto('history'));
  document.getElementById('btn-cart')?.addEventListener('click', () => goto('cart'));

  // 注文履歴
  document.getElementById('btn-history-back')?.addEventListener('click', () => goto('menu'));

  // 呼び出し・会計
  document.getElementById('btn-call')?.addEventListener('click', () => { state.callMode = 'call'; goto('calling'); });
  document.getElementById('btn-checkout')?.addEventListener('click', () => {
    state.checkoutData = { tableNo: state.tableNo || '3', total: ordersTotal() };
    goto('checkout_confirm');
  });
  document.getElementById('btn-call-checkout-back')?.addEventListener('click', () => goto('menu'));

  // 呼び出し中
  document.getElementById('btn-calling-cancel')?.addEventListener('click', () => goto('menu'));

  // 会計確認
  document.getElementById('btn-checkout-yes')?.addEventListener('click', () => goto('menu'));
}

function updateCheckinCount() {
  const a = document.getElementById('adults-count');
  const c = document.getElementById('children-count');
  if (a) a.textContent = state.adults;
  if (c) c.textContent = state.children;
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
  // イベント再登録
  document.querySelectorAll('.menu-item-card').forEach(el => {
    el.addEventListener('click', () => {
      const id = parseInt(el.dataset.id);
      const cat = MENU_DATA[state.currentCategory];
      state.selectedItem = cat.find(i => i.id === id);
      state.selectedQty = 1;
      goto('qty_select');
    });
  });
}

function renderCart() {
  const el = document.getElementById('cart-list');
  if (!el) return;
  el.innerHTML = state.cart.map(c => `
    <div class="cart-row">
      <div class="cart-row-name">${c.item.name}</div>
      <div class="cart-qty-ctrl">
        <button class="qty-btn cart-qty-minus" data-id="${c.item.id}">⊖</button>
        <span class="qty-num">${c.qty}</span>
        <button class="qty-btn cart-qty-plus" data-id="${c.item.id}">⊕</button>
      </div>
    </div>
  `).join('');
  const totalEl = document.getElementById('cart-total');
  if (totalEl) totalEl.textContent = `¥${cartTotal().toLocaleString()}`;
  document.querySelectorAll('.cart-qty-plus').forEach(el => {
    el.addEventListener('click', () => { updateCartQty(parseInt(el.dataset.id), 1); });
  });
  document.querySelectorAll('.cart-qty-minus').forEach(el => {
    el.addEventListener('click', () => { updateCartQty(parseInt(el.dataset.id), -1); });
  });
}
