// ===========================
// Slide 3: 数量選択オーバーレイ
// ===========================
function screenQtySelect() {
  const item = state.selectedItem;
  return `
    <div class="screen screen-menu">
      ${menuSidebar()}
      <div class="menu-main">
        ${menuItemsHTML(true)}
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
        ${menuFooter(true)}
      </div>
    </div>
  `;
}

function attachQtyEvents() {
  document.getElementById('btn-qty-plus')?.addEventListener('click', () => {
    state.selectedQty++;
    document.getElementById('qty-val').textContent = state.selectedQty;
  });
  document.getElementById('btn-qty-minus')?.addEventListener('click', () => {
    state.selectedQty = Math.max(1, state.selectedQty - 1);
    document.getElementById('qty-val').textContent = state.selectedQty;
  });
  document.getElementById('btn-qty-confirm')?.addEventListener('click', () => {
    addToCart(state.selectedItem, state.selectedQty);
    goto('item_added');
    setTimeout(() => goto('menu'), 1500);
  });
  document.getElementById('btn-qty-back')?.addEventListener('click', () => goto('menu'));
}

// ===========================
// Slide 6: カート追加トースト
// ===========================
function screenItemAdded() {
  return `
    <div class="screen screen-menu">
      ${menuSidebar()}
      <div class="menu-main">
        ${menuItemsHTML(true)}
        <div class="toast-overlay">
          <div class="toast-box">
            <div class="toast-icon">🛒</div>
            <div class="toast-msg">カートに<br>追加されました</div>
          </div>
        </div>
        ${menuFooter(true)}
      </div>
    </div>
  `;
}

// ===========================
// Slide 5: 注文確定トースト
// ===========================
function screenOrderConfirmed() {
  return `
    <div class="screen screen-menu">
      ${menuSidebar()}
      <div class="menu-main">
        ${menuItemsHTML(true)}
        <div class="toast-overlay">
          <div class="toast-box">
            <div class="toast-icon">✅</div>
            <div class="toast-msg">ご注文が<br>確定されました</div>
          </div>
        </div>
        ${menuFooter(true)}
      </div>
    </div>
  `;
}
