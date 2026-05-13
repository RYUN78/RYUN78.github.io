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
      </div>
    </div>
  `;
}

function attachTableMgmtEvents() {
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
    // 顧客IDを発行してQR生成
    const cid = String(Math.floor(Math.random() * 9999999)).padStart(7, '0');
    adminState.generatedQR = { customerId: cid, tableNo: adminState.qrTableNo || '1' };
    adminGoto('table_qr_display');
  });
}

// ===========================
// Slide 6-3: QRコード表示
// ===========================
function screenTableQrDisplay() {
  const qr = adminState.generatedQR || { customerId: 'xxxxxxx', tableNo: '1' };
  const now = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
  // QRコードはQRサーバーAPIで生成（実際はライブラリ使用）
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=table=${qr.tableNo}%26customer=${qr.customerId}`;
  return `
    <div class="screen adm-screen">
      <div class="adm-plain-header">テーブル管理</div>
      <div class="adm-qr-wrap">
        <div class="adm-qr-meta">${now}</div>
        <div class="adm-qr-meta">顧客ID：${qr.customerId}</div>
        <div class="adm-qr-box">
          <img src="${qrUrl}" alt="QRコード" width="160" height="160"
            onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
          <div class="adm-qr-fallback" style="display:none">QRコード</div>
        </div>
        <button class="adm-barcode-btn">バーコード</button>
      </div>
      <div class="adm-row-btns" style="margin-top:auto;padding:16px">
        <button class="adm-btn-secondary" id="btn-qr-display-back">戻る</button>
      </div>
    </div>
  `;
}

function attachTableQrDisplayEvents() {
  document.getElementById('btn-qr-display-back')?.addEventListener('click', () => adminGoto('table_mgmt'));
}

// ===========================
// Slide 6-3(変更): テーブル番号変更
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

// ===========================
// テーブル番号変更確認
// ===========================
function screenTableNoChangeConfirm() {
  return `
    <div class="screen adm-screen">
      <div class="adm-plain-header">テーブル管理</div>
      <div class="adm-form adm-scrollable">
        <div class="adm-field">
          <label class="adm-label">変更前：</label>
          <input class="adm-input" type="text" value="${adminState.tableNo}" disabled>
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
  document.getElementById('btn-tno-confirm-yes')?.addEventListener('click', () => adminGoto('table_mgmt'));
  document.getElementById('btn-tno-back')?.addEventListener('click', () => adminGoto('table_no_change'));
  document.getElementById('btn-tno-submit')?.addEventListener('click', () => adminGoto('table_no_change_confirm'));
}

// ===========================
// Slide 6-4: QRコード再発行
// ===========================
function screenTableReissue() {
  return `
    <div class="screen adm-screen">
      <div class="adm-plain-header">テーブル管理</div>
      <div class="adm-form adm-scrollable">
        <div class="adm-field">
          <label class="adm-label">発行するテーブル番号</label>
          <input class="adm-input" id="input-reissue-table" type="text"
            placeholder="テーブル番号">
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
    const cid = String(Math.floor(Math.random() * 9999999)).padStart(7, '0');
    adminState.generatedQR = { customerId: cid, tableNo: adminState.qrTableNo };
    adminGoto('table_qr_display');
  });
  document.getElementById('btn-reissue-back2')?.addEventListener('click', () => adminGoto('table_reissue'));
  document.getElementById('btn-reissue-submit')?.addEventListener('click', () => adminGoto('table_reissue_confirm'));
}
