// ===========================
// Slide 8: 呼び出し・会計選択
// ===========================
function screenCallCheckout() {
  return `
    <div class="screen screen-call">
      <button class="call-big-btn" id="btn-call">【呼び出す】</button>
      <button class="call-big-btn" id="btn-checkout">【会計】</button>
      <button class="secondary-btn" id="btn-call-checkout-back">メニューへ戻る</button>
    </div>
  `;
}

function attachCallCheckoutEvents() {
  document.getElementById('btn-call')?.addEventListener('click', () => {
    state.callMode = 'call';
    goto('calling');
  });
  document.getElementById('btn-checkout')?.addEventListener('click', () => {
    state.checkoutData = { tableNo: state.tableNo || '3', total: ordersTotal() };
    goto('checkout_confirm');
  });
  document.getElementById('btn-call-checkout-back')?.addEventListener('click', () => goto('menu'));
}

// ===========================
// Slide 9: 店員呼び出し中
// ===========================
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

function attachCallingEvents() {
  document.getElementById('btn-calling-cancel')?.addEventListener('click', () => goto('menu'));
}

// ===========================
// Slide 10: 会計確認
// ===========================
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

function attachCheckoutConfirmEvents() {
  document.getElementById('btn-checkout-yes')?.addEventListener('click', () => goto('menu'));
}
