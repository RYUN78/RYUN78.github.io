// ===========================
// Slide 11: エラー画面
// ===========================
function screenError(code = '') {
  return `
    <div class="screen screen-error">
      <div class="error-code">${code || 'E001'}</div>
      <div class="error-title">エラーが発生しました</div>
      <button class="primary-btn" id="btn-error-back">最初に戻る</button>
    </div>
  `;
}

function attachErrorEvents() {
  document.getElementById('btn-error-back')?.addEventListener('click', () => goto('checkin'));
}
