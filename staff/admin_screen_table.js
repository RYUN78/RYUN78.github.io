// ===========================
// Slide 6-1: テーブル管理メニュー
// ===========================
function screenTableMgmt() {
  return `
    <div class="screen adm-screen">
      <div class="adm-plain-header">テーブル管理</div>
      <div class="adm-menu-list">
        <button class="adm-menu-btn" id="btn-qr-gen">QRコード生成</button>
        <button class="adm-menu-btn" id="btn-table-no-change">テーブル番号変更</button>
        <button class="adm-menu-btn" id="btn-qr-reissue">QRコード再発行</button>
        <button class="adm-btn-secondary wide" id="btn-table-mgmt-back">戻る</button>
      </div>
    </div>
  `;
}

function attachTableMgmtEvents() {
  document.getElementById('btn-table-mgmt-back')?.addEventListener('click', () => adminGoBack());
  document.getElementById('btn-qr-gen')?.addEventListener('click', () => adminGoto('table_qr_confirm'));
  document.getElementById('btn-table-no-change')?.addEventListener('click', () => adminGoto('table_no_change'));
  document.getElementById('btn-qr-reissue')?.addEventListener('click', () => adminGoto('table_reissue'));
}

// ===========================
// Slide 6-2: QRコード生成確認
// ===========================
function screenTableQrConfirm() {
  return `
    <div class="screen adm-screen">
      <div class="adm-plain-header">テーブル管理</div>
      <div class="adm-form" style="padding:12px 16px">
        <div class="adm-field">
          <label class="adm-label">テーブル番号：</label>
          <input class="adm-input" id="input-qr-table" type="text"
            placeholder="例：3" value="${adminState.qrTableNo}">
        </div>
      </div>
      <div class="adm-modal-wrap">
        <div class="adm-modal">
          <div class="adm-modal-msg">QRコードを生成しますか？</div>
          <div class="adm-modal-btns">
            <button class="adm-btn-secondary" id="btn-qr-confirm-no">いいえ</button>
            <button class="adm-btn-primary" id="btn-qr-confirm-yes">はい</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function attachTableQrConfirmEvents() {
  document.getElementById('btn-qr-confirm-no')?.addEventListener('click', () => adminGoto('table_mgmt'));
  document.getElementById('btn-qr-confirm-yes')?.addEventListener('click', () => {
    const tableNo = document.getElementById('input-qr-table')?.value.trim() || '1';
    adminState.qrTableNo = tableNo;
    adminState.generatedQR = _makeQR(tableNo);
    adminGoto('table_qr_display');
  });
}

// ===========================
// Slide 6-3: QRコード・バーコード表示
//
// QRコード  → 顧客用画面のURL（スキャンするとメニュー画面へ直接アクセス）
// バーコード → 顧客IDのCode128（レジ端末でスキャンして注文データを取得）
// ===========================
function screenTableQrDisplay() {
  const qr  = adminState.generatedQR || { customerId: '', tableNo: '1', storeId: 'AA', issuedAt: '' };
  const now = qr.issuedAt || new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });

  // QRコードに埋め込むURL（顧客用画面 + パラメータ）
  const baseUrl     = `${location.protocol}//${location.hostname}${location.port ? ':' + location.port : ''}/customer/index.html`;
  const customerUrl = `${baseUrl}?storeId=${encodeURIComponent(qr.storeId)}&tableNo=${encodeURIComponent(qr.tableNo)}&customerId=${encodeURIComponent(qr.customerId)}`;
  const qrApiUrl    = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&ecc=M&data=${encodeURIComponent(customerUrl)}`;

  return `
    <div class="screen adm-screen">
      <div class="adm-plain-header">テーブル管理</div>
      <div class="adm-qr-wrap">
        <div class="adm-qr-meta">${now}</div>
        <div class="adm-qr-meta" style="font-family:monospace;font-size:clamp(11px,3vw,13px)">
          卓番：${qr.tableNo}　顧客ID：${qr.customerId}
        </div>

        <!-- QRコード：顧客用画面URLを埋め込む -->
        <div class="adm-qr-section-label">📱 QRコード（お客様用）</div>
        <div class="adm-qr-box">
          <img src="${qrApiUrl}" alt="QRコード" width="200" height="200"
            onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
          <div class="adm-qr-fallback" style="display:none">
            <div style="text-align:center;padding:8px;font-size:11px;word-break:break-all">${customerUrl}</div>
          </div>
        </div>
        <div class="adm-qr-url-note">スキャンするとメニュー画面に直接アクセスできます</div>

        <!-- バーコード：顧客IDをCode128で表示（レジ端末でスキャン用） -->
        <div class="adm-qr-section-label" style="margin-top:16px">🏷️ バーコード（レジ用）</div>
        <div class="adm-barcode-wrap">
          <svg id="barcode-svg"></svg>
          <div class="adm-barcode-id">${qr.customerId}</div>
        </div>
        <div class="adm-qr-url-note">レジ端末でスキャンして注文データを取得します</div>
      </div>

      <div class="adm-row-btns" style="margin-top:auto;padding:16px">
        <button class="adm-btn-secondary" id="btn-qr-display-back">戻る</button>
        <button class="adm-btn-primary" id="btn-qr-print">印刷</button>
      </div>
    </div>
  `;
}

function attachTableQrDisplayEvents() {
  document.getElementById('btn-qr-display-back')?.addEventListener('click', () => adminGoto('table_mgmt'));
  document.getElementById('btn-qr-print')?.addEventListener('click', () => window.print());
  _drawBarcode();
}

// ===========================
// テーブル番号変更
// ===========================
function screenTableNoChange() {
  return `
    <div class="screen adm-screen">
      <div class="adm-plain-header">テーブル管理</div>
      <div class="adm-form adm-scrollable">
        <div class="adm-field">
          <label class="adm-label">変更前：</label>
          <input class="adm-input" id="input-table-before" type="text"
            placeholder="現在のテーブル番号" value="${adminState.tableNo}">
        </div>
        <div class="adm-field">
          <label class="adm-label">変更後：</label>
          <input class="adm-input" id="input-table-after" type="text"
            placeholder="新しいテーブル番号" value="${adminState.tableNoAfter}">
        </div>
        <div class="adm-row-btns">
          <button class="adm-btn-secondary" id="btn-table-change-back">戻る</button>
          <button class="adm-btn-primary" id="btn-table-change-next">変更</button>
        </div>
      </div>
    </div>
  `;
}

function attachTableNoChangeEvents() {
  document.getElementById('btn-table-change-back')?.addEventListener('click', () => adminGoto('table_mgmt'));
  document.getElementById('btn-table-change-next')?.addEventListener('click', () => {
    adminState.tableNo      = document.getElementById('input-table-before').value.trim();
    adminState.tableNoAfter = document.getElementById('input-table-after').value.trim();
    if (!adminState.tableNo || !adminState.tableNoAfter) return;
    adminGoto('table_no_change_confirm');
  });
}

function screenTableNoChangeConfirm() {
  return `
    <div class="screen adm-screen">
      <div class="adm-plain-header">テーブル管理</div>
      <div class="adm-form adm-scrollable">
        <div class="adm-field">
          <label class="adm-label">変更前：</label>
          <input class="adm-input" type="text" value="${adminState.tableNo}" disabled>
        </div>
        <div class="adm-field">
          <label class="adm-label">変更後：</label>
          <input class="adm-input" type="text" value="${adminState.tableNoAfter}" disabled>
        </div>
        <div class="adm-modal-wrap">
          <div class="adm-modal">
            <div class="adm-modal-msg">テーブル番号を変更しますか？</div>
            <div class="adm-modal-btns">
              <button class="adm-btn-secondary" id="btn-tno-confirm-no">いいえ</button>
              <button class="adm-btn-primary" id="btn-tno-confirm-yes">はい</button>
            </div>
          </div>
        </div>
        <div class="adm-row-btns">
          <button class="adm-btn-secondary" id="btn-tno-back">戻る</button>
          <button class="adm-btn-primary" id="btn-tno-submit">変更</button>
        </div>
      </div>
    </div>
  `;
}

function attachTableNoChangeConfirmEvents() {
  document.getElementById('btn-tno-confirm-no')?.addEventListener('click', () => adminGoto('table_no_change'));
  document.getElementById('btn-tno-confirm-yes')?.addEventListener('click', () => {
    // モックでテーブル番号を変更
    if (mockOrders[adminState.tableNo]) {
      mockOrders[adminState.tableNoAfter] = mockOrders[adminState.tableNo];
      delete mockOrders[adminState.tableNo];
    }
    adminGoto('table_mgmt');
  });
  document.getElementById('btn-tno-back')?.addEventListener('click', () => adminGoto('table_no_change'));
  document.getElementById('btn-tno-submit')?.addEventListener('click', () => adminGoto('table_no_change_confirm'));
}

// ===========================
// QRコード再発行
// ===========================
function screenTableReissue() {
  return `
    <div class="screen adm-screen">
      <div class="adm-plain-header">テーブル管理</div>
      <div class="adm-form adm-scrollable">
        <div class="adm-field">
          <label class="adm-label">発行するテーブル番号</label>
          <input class="adm-input" id="input-reissue-table" type="text" placeholder="テーブル番号">
        </div>
        <div class="adm-row-btns">
          <button class="adm-btn-secondary" id="btn-reissue-back">戻る</button>
          <button class="adm-btn-primary" id="btn-reissue-next">発行</button>
        </div>
      </div>
    </div>
  `;
}

function attachTableReissueEvents() {
  document.getElementById('btn-reissue-back')?.addEventListener('click', () => adminGoto('table_mgmt'));
  document.getElementById('btn-reissue-next')?.addEventListener('click', () => {
    adminState.qrTableNo = document.getElementById('input-reissue-table').value.trim();
    if (!adminState.qrTableNo) return;
    adminGoto('table_reissue_confirm');
  });
}

function screenTableReissueConfirm() {
  return `
    <div class="screen adm-screen">
      <div class="adm-plain-header">テーブル管理</div>
      <div class="adm-form adm-scrollable">
        <div class="adm-field">
          <label class="adm-label">発行するテーブル番号</label>
          <input class="adm-input" type="text" value="${adminState.qrTableNo}" disabled>
        </div>
        <div class="adm-modal-wrap">
          <div class="adm-modal">
            <div class="adm-modal-msg">QRコードを発行しますか？</div>
            <div class="adm-modal-btns">
              <button class="adm-btn-secondary" id="btn-reissue-confirm-no">いいえ</button>
              <button class="adm-btn-primary" id="btn-reissue-confirm-yes">はい</button>
            </div>
          </div>
        </div>
        <div class="adm-row-btns">
          <button class="adm-btn-secondary" id="btn-reissue-back2">戻る</button>
          <button class="adm-btn-primary" id="btn-reissue-submit">発行</button>
        </div>
      </div>
    </div>
  `;
}

function attachTableReissueConfirmEvents() {
  document.getElementById('btn-reissue-confirm-no')?.addEventListener('click', () => adminGoto('table_reissue'));
  document.getElementById('btn-reissue-confirm-yes')?.addEventListener('click', () => {
    adminState.generatedQR = _makeQR(adminState.qrTableNo);
    adminGoto('table_qr_display');
  });
  document.getElementById('btn-reissue-back2')?.addEventListener('click', () => adminGoto('table_reissue'));
  document.getElementById('btn-reissue-submit')?.addEventListener('click', () => adminGoto('table_reissue_confirm'));
}

// ===========================
// ヘルパー
// ===========================
function _makeQR(tableNo) {
  const jst  = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const date = jst.toISOString().slice(0, 10).replace(/-/g, '');
  const seq  = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
  return {
    customerId: `${date}-${seq}`,
    tableNo:    tableNo,
    storeId:    'AA',
    issuedAt:   new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
  };
}

function _drawBarcode() {
  const qr  = adminState.generatedQR;
  const svg = document.getElementById('barcode-svg');
  if (!svg || !qr?.customerId) return;

  if (typeof JsBarcode !== 'undefined') {
    try {
      JsBarcode(svg, qr.customerId, {
        format:       'CODE128',
        lineColor:    '#1a1a1a',
        background:   '#ffffff',
        width:        2,
        height:       60,
        displayValue: false,
        margin:       8,
      });
    } catch(e) {
      svg.outerHTML = `<div class="adm-barcode-fallback">${qr.customerId}</div>`;
    }
  } else {
    svg.outerHTML = `<div class="adm-barcode-fallback">${qr.customerId}</div>`;
  }
}
