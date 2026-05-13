// ===========================
// 共有状態
// ===========================
const state = {
  screen: 'checkin',
  adults: 0,
  children: 0,
  customerId: null,
  tableNo: null,
  currentCategory: 'おすすめ',
  cart: [],          // { item, qty }
  orders: [],        // { item, qty, time }
  selectedItem: null,
  selectedQty: 1,
  callMode: null,
  checkoutData: null,
  nomihodaiEndsAt: null,  // 飲み放題終了時刻（Dateオブジェクト）
};

// ===========================
// 画面遷移
// ===========================
function goto(screen) {
  state.screen = screen;
  render();
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

  // 飲み放題プランが含まれているか確認
  state.cart.forEach(c => {
    if (c.item.nomihodaiMinutes) {
      const endsAt = new Date(Date.now() + c.item.nomihodaiMinutes * 60 * 1000);
      // すでに飲み放題中の場合は長い方を採用
      if (!state.nomihodaiEndsAt || endsAt > state.nomihodaiEndsAt) {
        state.nomihodaiEndsAt = endsAt;
      }
    }
  });

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
// メインレンダラー（各画面JSに依存）
// ===========================
function render() {
  const app = document.getElementById('app');
  switch (state.screen) {
    case 'checkin':          app.innerHTML = screenCheckin();         break;
    case 'menu':             app.innerHTML = screenMenu();            break;
    case 'qty_select':       app.innerHTML = screenQtySelect();       break;
    case 'item_added':       app.innerHTML = screenItemAdded();       break;
    case 'cart':             app.innerHTML = screenCart();            break;
    case 'order_confirmed':  app.innerHTML = screenOrderConfirmed();  break;
    case 'history':          app.innerHTML = screenHistory();         break;
    case 'call_checkout':    app.innerHTML = screenCallCheckout();    break;
    case 'calling':          app.innerHTML = screenCalling();         break;
    case 'checkout_confirm': app.innerHTML = screenCheckoutConfirm(); break;
    case 'error':            app.innerHTML = screenError();           break;
    default:                 app.innerHTML = screenError();
  }
  attachEvents();
}
