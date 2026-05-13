// ===========================
// 時計・ラストオーダー・飲み放題タイマー
// ===========================

// ラストオーダー時刻（HH:MM形式で設定）
const LAST_ORDER_TIME = '22:00';

function getJSTNow() {
  const now = new Date();
  return new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
}

function parseLastOrderDate(jst) {
  const [loHour, loMin] = LAST_ORDER_TIME.split(':').map(Number);
  const lo = new Date(jst);
  lo.setHours(loHour, loMin, 0, 0);
  if (lo <= jst) lo.setDate(lo.getDate() + 1);
  return lo;
}

function formatTime(date) {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function formatCountdown(ms, prefix = '') {
  if (ms <= 0) return prefix ? `${prefix}終了` : '終了';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const time = h > 0
    ? `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
    : `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  return `${prefix}${time}`;
}

function updateClock() {
  const jst  = getJSTNow();
  const now  = Date.now();
  const lo   = parseLastOrderDate(jst);
  const loDiff = lo - jst;

  const timeEl = document.getElementById('clock-time');
  const loEl   = document.getElementById('clock-lo');
  const nhEl   = document.getElementById('clock-nh');
  if (!timeEl || !loEl) return;

  // 現在時刻
  timeEl.textContent = formatTime(jst);

  // ラストオーダー
  loEl.textContent = formatCountdown(loDiff, 'LO まで ');
  if (loDiff <= 30 * 60 * 1000 && loDiff > 0) {
    loEl.classList.add('lo-warning');
  } else {
    loEl.classList.remove('lo-warning');
  }

  // 飲み放題タイマー
  if (nhEl) {
    if (state.nomihodaiEndsAt) {
      const nhDiff = state.nomihodaiEndsAt - now;
      if (nhDiff > 0) {
        nhEl.textContent = formatCountdown(nhDiff, '🍻 ');
        nhEl.style.display = 'inline';
        // 残り10分以内で警告
        if (nhDiff <= 10 * 60 * 1000) {
          nhEl.classList.add('nh-warning');
        } else {
          nhEl.classList.remove('nh-warning');
        }
      } else {
        nhEl.textContent = '🍻 終了';
        nhEl.classList.remove('nh-warning');
        nhEl.classList.add('nh-ended');
      }
    } else {
      nhEl.style.display = 'none';
    }
  }
}

// 1秒ごとに更新
updateClock();
setInterval(updateClock, 1000);
