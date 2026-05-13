// ===========================
// Slide 1: 入店画面
// ===========================
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
      <div class="checkin-error" id="checkin-error"></div>
      <button class="primary-btn" id="btn-checkin">確定する</button>
    </div>
  `;
}

function showCheckinError(msg) {
  const el = document.getElementById('checkin-error');
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}

function hideCheckinError() {
  const el = document.getElementById('checkin-error');
  if (el) { el.textContent = ''; el.style.display = 'none'; }
}

function attachCheckinEvents() {
  document.getElementById('btn-adults-plus')?.addEventListener('click', () => {
    state.adults++;
    updateCheckinCount();
  });
  document.getElementById('btn-adults-minus')?.addEventListener('click', () => {
    state.adults = Math.max(0, state.adults - 1);
    updateCheckinCount();
  });
  document.getElementById('btn-children-plus')?.addEventListener('click', () => {
    state.children++;
    updateCheckinCount();
  });
  document.getElementById('btn-children-minus')?.addEventListener('click', () => {
    state.children = Math.max(0, state.children - 1);
    updateCheckinCount();
  });
  document.getElementById('btn-checkin')?.addEventListener('click', () => {
    if (state.adults === 0 && state.children === 0) {
      showCheckinError('人数を入力してください');
      return;
    }
    if (state.adults === 0 && state.children > 0) {
      showCheckinError('大人が1名以上必要です');
      return;
    }
    hideCheckinError();
    state.customerId = String(Math.floor(Math.random() * 9999999)).padStart(7, '0');
    state.tableNo = '3';
    goto('menu');
  });
}

function updateCheckinCount() {
  const a = document.getElementById('adults-count');
  const c = document.getElementById('children-count');
  if (a) a.textContent = state.adults;
  if (c) c.textContent = state.children;
}
