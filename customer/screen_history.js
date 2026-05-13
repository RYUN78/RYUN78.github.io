// ===========================
// Slide 7: 注文履歴
// ===========================
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

function attachHistoryEvents() {
  document.getElementById('btn-history-back')?.addEventListener('click', () => goto('menu'));
}
