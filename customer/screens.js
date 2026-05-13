// ===========================
// 画面テンプレート群
// ===========================

// Slide 1: 入店画面
function screenCheckin() {
  return `
    <div class="screen screen-checkin">
      <div class="checkin-title">みどり亭へようこそ</div>
      <div class="checkin-subtitle">人数を入力してください</div>
      <div class="checkin-row">
        <span class="checkin-label">大人：</span>
        <button class="round-btn" id="btn-adults-minus">⊖</button>
        <span class="count-box" id="adults-count">${state.adults}</span>
        <button class="round-btn" id="btn-adults-plus">⊕</button>
      </div>
      <div class="checkin-row">
        <span class="checkin-label">子供：</span>
        <button class="round-btn" id="btn-children-minus">⊖</button>
        <span class="count-box" id="children-count">${state.children}</span>
        <button class="round-btn" id="btn-children-plus">⊕</button>
      </div>
      <button class="primary-btn" id="btn-checkin">確定する</button>
    </div>
  `;
}

// Slide 2: メニュー画面（ベース）
function screenMenu() {
  const items = MENU_DATA[state.currentCategory] || [];
  return `
    <div class="screen screen-menu">
      <div class="menu-sidebar">
        ${CATEGORIES.map(cat => `
          <div class="cat-tab${cat === state.currentCategory ? ' active' : ''}" data-cat="${cat}">${cat}</div>
        `).join('')}
      </div>
      <div class="menu-main">
        <div class="menu-items" id="menu-items">
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
        <div class="menu-footer">
          <button class="footer-btn" id="btn-call-checkout">
            <span class="footer-icon">🔔</span>
            <span class="footer-label">呼び出し・会計</span>
          </button>
          <button class="footer-btn" id="btn-history">
            <span class="footer-icon">📄</span>
            <span class="footer-label">注文履歴</span>
          </button>
          <button class="footer-btn${state.cart.length > 0 ? ' has-badge' : ''}" id="btn-cart">
            <span class="footer-icon">🛒</span>
            <span class="footer-label">カートを確認</span>
            ${state.cart.length > 0 ? `<span class="cart-badge">${state.cart.reduce((s,c)=>s+c.qty,0)}</span>` : ''}
          </button>
        </div>
      </div>
    </div>
  `;
}

// Slide 3: 数量選択（モーダル風）
function screenQtySelect() {
  const item = state.selectedItem;
  return `
    <div class="screen screen-menu">
      <div class="menu-sidebar">
        ${CATEGORIES.map(cat => `
          <div class="cat-tab${cat === state.currentCategory ? ' active' : ''}" data-cat="${cat}">${cat}</div>
        `).join('')}
      </div>
      <div class="menu-main">
        <div class="menu-items dimmed">
          ${(MENU_DATA[state.currentCategory] || []).map(i => `
            <div class="menu-item-card" data-id="${i.id}">
              <div class="menu-item-emoji">${i.img}</div>
              <div class="menu-item-info">
                <div class="menu-item-name">${i.name}</div>
                <div class="menu-item-price">¥${i.price.toLocaleString()}（税込）</div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="qty-overlay">
          <div class="qty-modal">
            <div class="qty-modal-title">個数を選択して下さい</div>
            <div class="qty-modal-item">${item ? item.name : ''}</div>
            <div class="qty-ctrl">
              <button class="round-btn lg" id="btn-qty-minus">⊖</button>
              <span class="qty-val" id="qty-val">${state.selectedQty}</span>
              <button class="round-btn lg" id="btn-qty-plus">⊕</button>
            </div>
            <div class="qty-actions">
              <button class="secondary-btn" id="btn-qty-back">戻る</button>
              <button class="primary-btn" id="btn-qty-confirm">確定</button>
            </div>
          </div>
        </div>
        <div class="menu-footer">
          <button class="footer-btn" id="btn-call-checkout"><span class="footer-icon">🔔</span><span class="footer-label">呼び出し・会計</span></button>
          <button class="footer-btn" id="btn-history"><span class="footer-icon">📄</span><span class="footer-label">注文履歴</span></button>
          <button class="footer-btn" id="btn-cart"><span class="footer-icon">🛒</span><span class="footer-label">カートを確認</span></button>
        </div>
      </div>
    </div>
  `;
}

// Slide 4: カート一覧
function screenCart() {
  return `
    <div class="screen screen-menu">
      <div class="menu-sidebar">
        ${CATEGORIES.map(cat => `
          <div class="cat-tab${cat === state.currentCategory ? ' active' : ''}" data-cat="${cat}">${cat}</div>
        `).join('')}
      </div>
      <div class="menu-main">
        <div class="menu-items dimmed">
          ${(MENU_DATA[state.currentCategory] || []).map(i => `
            <div class="menu-item-card" data-id="${i.id}">
              <div class="menu-item-emoji">${i.img}</div>
              <div class="menu-item-info">
                <div class="menu-item-name">${i.name}</div>
                <div class="menu-item-price">¥${i.price.toLocaleString()}（税込）</div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="qty-overlay">
          <div class="cart-modal">
            <div class="cart-modal-title">カート一覧</div>
            <div class="cart-list" id="cart-list">
              ${state.cart.length === 0
                ? '<div class="cart-empty">カートは空です</div>'
                : state.cart.map(c => `
                  <div class="cart-row">
                    <div class="cart-row-name">${c.item.name}</div>
                    <div class="cart-qty-ctrl">
                      <button class="qty-btn cart-qty-minus" data-id="${c.item.id}">⊖</button>
                      <span class="qty-num">${c.qty}</span>
                      <button class="qty-btn cart-qty-plus" data-id="${c.item.id}">⊕</button>
                    </div>
                  </div>
                `).join('')}
            </div>
            <div class="cart-actions">
              <button class="secondary-btn" id="btn-cart-close">閉じる</button>
              <button class="primary-btn${state.cart.length === 0 ? ' disabled' : ''}" id="btn-order-confirm" ${state.cart.length === 0 ? 'disabled' : ''}>注文確定</button>
            </div>
          </div>
        </div>
        <div class="menu-footer">
          <button class="footer-btn" id="btn-call-checkout"><span class="footer-icon">🔔</span><span class="footer-label">呼び出し・会計</span></button>
          <button class="footer-btn" id="btn-history"><span class="footer-icon">📄</span><span class="footer-label">注文履歴</span></button>
          <button class="footer-btn" id="btn-cart"><span class="footer-icon">🛒</span><span class="footer-label">カートを確認</span></button>
        </div>
      </div>
    </div>
  `;
}

// Slide 5: 注文確定トースト
function screenOrderConfirmed() {
  return `
    <div class="screen screen-menu">
      <div class="menu-sidebar">
        ${CATEGORIES.map(cat => `
          <div class="cat-tab${cat === state.currentCategory ? ' active' : ''}" data-cat="${cat}">${cat}</div>
        `).join('')}
      </div>
      <div class="menu-main">
        <div class="menu-items dimmed">
          ${(MENU_DATA[state.currentCategory] || []).map(i => `
            <div class="menu-item-card" data-id="${i.id}">
              <div class="menu-item-emoji">${i.img}</div>
              <div class="menu-item-info">
                <div class="menu-item-name">${i.name}</div>
                <div class="menu-item-price">¥${i.price.toLocaleString()}（税込）</div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="toast-overlay">
          <div class="toast-box">
            <div class="toast-icon">✅</div>
            <div class="toast-msg">ご注文が<br>確定されました</div>
          </div>
        </div>
        <div class="menu-footer">
          <button class="footer-btn" id="btn-call-checkout"><span class="footer-icon">🔔</span></button>
          <button class="footer-btn" id="btn-history"><span class="footer-icon">📄</span></button>
          <button class="footer-btn" id="btn-cart"><span class="footer-icon">🛒</span></button>
        </div>
      </div>
    </div>
  `;
}

// Slide 6: カート追加トースト（数量選択確定時）
function screenItemAdded() {
  return `
    <div class="screen screen-menu">
      <div class="menu-sidebar">
        ${CATEGORIES.map(cat => `
          <div class="cat-tab${cat === state.currentCategory ? ' active' : ''}" data-cat="${cat}">${cat}</div>
        `).join('')}
      </div>
      <div class="menu-main">
        <div class="menu-items dimmed">
          ${(MENU_DATA[state.currentCategory] || []).map(i => `
            <div class="menu-item-card" data-id="${i.id}">
              <div class="menu-item-emoji">${i.img}</div>
              <div class="menu-item-info">
                <div class="menu-item-name">${i.name}</div>
                <div class="menu-item-price">¥${i.price.toLocaleString()}（税込）</div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="toast-overlay">
          <div class="toast-box">
            <div class="toast-icon">🛒</div>
            <div class="toast-msg">カートに<br>追加されました</div>
          </div>
        </div>
        <div class="menu-footer">
          <button class="footer-btn" id="btn-call-checkout"><span class="footer-icon">🔔</span></button>
          <button class="footer-btn" id="btn-history"><span class="footer-icon">📄</span></button>
          <button class="footer-btn" id="btn-cart"><span class="footer-icon">🛒</span></button>
        </div>
      </div>
    </div>
  `;
}

// Slide 7: 注文履歴
function screenHistory() {
  const total = ordersTotal();
  return `
    <div class="screen screen-history">
      <div class="history-header">注文履歴</div>
      <div class="history-list">
        ${state.orders.length === 0
          ? '<div class="history-empty">注文履歴がありません</div>'
          : state.orders.map(c => `
            <div class="history-row">
              <div class="history-name">${c.item.name}</div>
              <div class="history-qty">${c.qty}点</div>
              <div class="history-price">¥${(c.item.price * c.qty).toLocaleString()}</div>
            </div>
          `).join('')}
      </div>
      <div class="history-total">
        <span>合計金額</span>
        <span>¥${total.toLocaleString()}</span>
      </div>
      <button class="primary-btn" id="btn-history-back">メニューへ戻る</button>
    </div>
  `;
}

// Slide 8: 呼び出し・会計選択
function screenCallCheckout() {
  return `
    <div class="screen screen-call">
      <button class="call-big-btn" id="btn-call">【呼び出す】</button>
      <button class="call-big-btn" id="btn-checkout">【会計】</button>
      <button class="secondary-btn" id="btn-call-checkout-back">メニューへ戻る</button>
    </div>
  `;
}

// Slide 9: 店員呼び出し中
function screenCalling() {
  return `
    <div class="screen screen-calling">
      <div class="calling-title">店員呼び出し</div>
      <div class="calling-tabs">
        <span class="calling-tab active">店員呼出し</span>
        <span class="calling-tab">お会計</span>
        <span class="calling-tab">注文履歴</span>
        <span class="calling-tab">注文</span>
      </div>
      <div class="calling-body">
        <div class="calling-icon">🧍</div>
        <div class="calling-msg">店員がまいります。<br>しばらくお待ちください。</div>
      </div>
      <button class="secondary-btn" id="btn-calling-cancel">キャンセル</button>
    </div>
  `;
}

// Slide 10: 会計確認
function screenCheckoutConfirm() {
  const d = state.checkoutData || { tableNo: '3', total: ordersTotal() };
  return `
    <div class="screen screen-call">
      <div class="checkout-card">
        <div class="checkout-table">卓番 ${d.tableNo}</div>
        <div class="checkout-amount">お支払金額　¥${d.total.toLocaleString()}</div>
        <div class="checkout-thanks">ご来店ありがとうございました。<br>レジへお越しください。</div>
      </div>
      <button class="primary-btn" id="btn-checkout-yes">はい</button>
    </div>
  `;
}

// Slide 11: エラー画面
function screenError(code = '') {
  return `
    <div class="screen screen-error">
      <div class="error-code">${code || 'E001'}</div>
      <div class="error-title">エラーが発生しました</div>
      <button class="primary-btn" onclick="goto('checkin')">最初に戻る</button>
    </div>
  `;
}
