// ===========================
// Slide 7: 売り切れ表示
// ===========================
function screenSoldoutSearch() {
  return `
    <div class="screen adm-screen">
      ${adminHeader('売り切れ表示')}
      <div class="adm-body adm-scrollable">
        <div class="adm-search-bar">
          <input class="adm-input" id="product-search-input" type="text"
            placeholder="名前（キーワード）を入れて検索"
            value="${adminState.productSearchQuery}">
          <button class="adm-icon-btn" id="btn-product-search">🔍</button>
        </div>
        <div class="adm-search-hint">名前（キーワード）入れて検索→結果が出てくる</div>
        <div class="adm-result-list">
          ${adminState.productSearchResults.map(p => `
            <label class="adm-result-row">
              <input type="checkbox" class="product-check" value="${p.id}"
                ${adminState.selectedProducts.includes(p.id) ? 'checked' : ''}>
              <span class="${p.soldOut ? 'adm-soldout' : ''}">${p.name}${p.soldOut ? '（売り切れ）' : ''}</span>
            </label>
          `).join('')}
        </div>
        <div class="adm-row-btns">
          <button class="adm-btn-secondary" id="btn-soldout-back">戻る</button>
          <button class="adm-btn-primary" id="btn-soldout-next">次へ</button>
        </div>
      </div>
    </div>
  `;
}

function attachSoldoutSearchEvents() {
  document.getElementById('btn-settings')?.addEventListener('click', () => adminGoto('logout_confirm'));
  document.getElementById('btn-bell')?.addEventListener('click', () => adminGoto('staff_call'));
  document.getElementById('btn-product-search')?.addEventListener('click', () => {
    const q = document.getElementById('product-search-input').value.trim();
    adminState.productSearchQuery   = q;
    adminState.productSearchResults = mockProducts.filter(p => p.name.includes(q) || !q);
    adminRender();
  });
  document.querySelectorAll('.product-check').forEach(el => {
    el.addEventListener('change', () => {
      const id = parseInt(el.value);
      if (el.checked) { if (!adminState.selectedProducts.includes(id)) adminState.selectedProducts.push(id); }
      else { adminState.selectedProducts = adminState.selectedProducts.filter(x => x !== id); }
    });
  });
  document.getElementById('btn-soldout-back')?.addEventListener('click', () => adminGoto('menu_parttime'));
  document.getElementById('btn-soldout-next')?.addEventListener('click', () => {
    const checked = [...document.querySelectorAll('.product-check:checked')].map(el => parseInt(el.value));
    adminState.selectedProducts = checked;
    if (checked.length === 0) return;
    adminGoto('soldout_confirm');
  });
}

function screenSoldoutConfirm() {
  return `
    <div class="screen adm-screen">
      ${adminHeader('売り切れ表示')}
      <div class="adm-body adm-scrollable">
        <div class="adm-result-list">
          ${adminState.productSearchResults.map(p => `
            <label class="adm-result-row">
              <input type="checkbox" disabled
                ${adminState.selectedProducts.includes(p.id) ? 'checked' : ''}>
              <span>${p.name}</span>
            </label>
          `).join('')}
        </div>
        <div class="adm-modal-wrap">
          <div class="adm-modal">
            <div class="adm-modal-msg">売り切れ表示の変更を許可しますか？</div>
            <div class="adm-modal-btns">
              <button class="adm-btn-secondary" id="btn-soldout-confirm-no">いいえ</button>
              <button class="adm-btn-primary" id="btn-soldout-confirm-yes">はい</button>
            </div>
          </div>
        </div>
        <div class="adm-row-btns">
          <button class="adm-btn-secondary" id="btn-soldout-back2">戻る</button>
          <button class="adm-btn-primary" id="btn-soldout-submit">変更</button>
        </div>
      </div>
    </div>
  `;
}

function attachSoldoutConfirmEvents() {
  document.getElementById('btn-settings')?.addEventListener('click', () => adminGoto('logout_confirm'));
  document.getElementById('btn-soldout-confirm-no')?.addEventListener('click', () => adminGoto('soldout_search'));
  document.getElementById('btn-soldout-confirm-yes')?.addEventListener('click', () => {
    adminState.selectedProducts.forEach(id => {
      const p = mockProducts.find(x => x.id === id);
      if (p) p.soldOut = !p.soldOut;
    });
    adminGoto('menu_parttime');
  });
  document.getElementById('btn-soldout-back2')?.addEventListener('click', () => adminGoto('soldout_search'));
  document.getElementById('btn-soldout-submit')?.addEventListener('click', () => adminGoto('soldout_confirm'));
}

// ===========================
// Slide 8: 注文（QRスキャン）
// ===========================
function screenOrderScan() {
  return `
    <div class="screen adm-screen">
      ${adminHeader('注文')}
      <div class="adm-body adm-center">
        <div class="adm-scan-msg">QRコードを読み込ませてください</div>
        <div class="adm-scan-area">📷</div>
        <div class="adm-row-btns" style="margin-top:24px">
          <button class="adm-btn-secondary" id="btn-order-scan-back">戻る</button>
          <button class="adm-btn-primary" id="btn-order-scan-manual">手動入力</button>
        </div>
      </div>
    </div>
  `;
}

function attachOrderScanEvents() {
  document.getElementById('btn-settings')?.addEventListener('click', () => adminGoto('logout_confirm'));
  document.getElementById('btn-bell')?.addEventListener('click', () => adminGoto('staff_call'));
  document.getElementById('btn-order-scan-back')?.addEventListener('click', () => adminGoto('menu_parttime'));
  document.getElementById('btn-order-scan-manual')?.addEventListener('click', () => adminGoto('order_form'));
}

function screenOrderForm() {
  return `
    <div class="screen adm-screen">
      ${adminHeader('注文')}
      <div class="adm-form adm-scrollable">
        <div class="adm-field">
          <label class="adm-label">テーブル番号：</label>
          <input class="adm-input" id="input-order-table" type="text" value="${adminState.orderTableNo}">
          <span class="adm-required">※ 必須</span>
        </div>
        <div class="adm-field">
          <label class="adm-label">飲み放題：</label>
          <select class="adm-input" id="input-order-nomihoudai">
            <option value="">選択してください</option>
            <option value="none"     ${adminState.orderNomihoudai==='none'?'selected':''}>なし</option>
            <option value="standard" ${adminState.orderNomihoudai==='standard'?'selected':''}>スタンダード</option>
            <option value="premium"  ${adminState.orderNomihoudai==='premium'?'selected':''}>プレミアム</option>
          </select>
          <span class="adm-required">※ 必須</span>
        </div>
        <div class="adm-row-btns">
          <button class="adm-btn-secondary" id="btn-order-form-back">戻る</button>
          <button class="adm-btn-primary" id="btn-order-form-next">決定</button>
        </div>
      </div>
    </div>
  `;
}

function attachOrderFormEvents() {
  document.getElementById('btn-settings')?.addEventListener('click', () => adminGoto('logout_confirm'));
  document.getElementById('btn-order-form-back')?.addEventListener('click', () => adminGoto('order_scan'));
  document.getElementById('btn-order-form-next')?.addEventListener('click', () => {
    adminState.orderTableNo    = document.getElementById('input-order-table').value.trim();
    adminState.orderNomihoudai = document.getElementById('input-order-nomihoudai').value;
    if (!adminState.orderTableNo || !adminState.orderNomihoudai) return;
    adminGoto('order_form_confirm');
  });
}

function screenOrderFormConfirm() {
  const label = { none:'なし', standard:'スタンダード', premium:'プレミアム' };
  return `
    <div class="screen adm-screen">
      ${adminHeader('注文')}
      <div class="adm-form adm-scrollable">
        <div class="adm-field">
          <label class="adm-label">テーブル番号：</label>
          <input class="adm-input" type="text" value="${adminState.orderTableNo}" disabled>
        </div>
        <div class="adm-field">
          <label class="adm-label">飲み放題：</label>
          <input class="adm-input" type="text" value="${label[adminState.orderNomihoudai] || ''}" disabled>
        </div>
        <div class="adm-modal-wrap">
          <div class="adm-modal">
            <div class="adm-modal-msg">確定しますか？</div>
            <div class="adm-modal-btns">
              <button class="adm-btn-secondary" id="btn-order-confirm-no">いいえ</button>
              <button class="adm-btn-primary" id="btn-order-confirm-yes">はい</button>
            </div>
          </div>
        </div>
        <div class="adm-row-btns">
          <button class="adm-btn-secondary" id="btn-order-confirm-back">戻る</button>
          <button class="adm-btn-primary" id="btn-order-confirm-submit">確定</button>
        </div>
      </div>
    </div>
  `;
}

function attachOrderFormConfirmEvents() {
  document.getElementById('btn-settings')?.addEventListener('click', () => adminGoto('logout_confirm'));
  document.getElementById('btn-order-confirm-no')?.addEventListener('click', () => adminGoto('order_form'));
  document.getElementById('btn-order-confirm-yes')?.addEventListener('click', () => {
    // モックで注文追加
    const t = adminState.orderTableNo;
    if (!mockOrders[t]) mockOrders[t] = [];
    adminGoto('menu_parttime');
  });
  document.getElementById('btn-order-confirm-back')?.addEventListener('click', () => adminGoto('order_form'));
  document.getElementById('btn-order-confirm-submit')?.addEventListener('click', () => adminGoto('order_form_confirm'));
}

// ===========================
// Slide 9: 注文キャンセル
// ===========================
function screenCancelSearch() {
  return `
    <div class="screen adm-screen">
      ${adminHeader('注文キャンセル')}
      <div class="adm-body">
        <div class="adm-field-note" style="padding:12px 16px">テーブル番号を入れて確定したら、そのテーブルの注文履歴を呼び出す</div>
        <div class="adm-form">
          <div class="adm-field">
            <label class="adm-label">テーブル番号：</label>
            <input class="adm-input" id="input-cancel-table" type="text" value="${adminState.cancelTableNo}">
            <span class="adm-required">※ 必須</span>
          </div>
          <div class="adm-row-btns">
            <button class="adm-btn-secondary" id="btn-cancel-search-back">戻る</button>
            <button class="adm-btn-primary" id="btn-cancel-search-next">決定</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function attachCancelSearchEvents() {
  document.getElementById('btn-settings')?.addEventListener('click', () => adminGoto('logout_confirm'));
  document.getElementById('btn-bell')?.addEventListener('click', () => adminGoto('staff_call'));
  document.getElementById('btn-cancel-search-back')?.addEventListener('click', () => adminGoto('menu_parttime'));
  document.getElementById('btn-cancel-search-next')?.addEventListener('click', () => {
    adminState.cancelTableNo = document.getElementById('input-cancel-table').value.trim();
    if (!adminState.cancelTableNo) return;
    adminState.orderList     = mockOrders[adminState.cancelTableNo] || [];
    adminState.selectedOrders = [];
    adminGoto('cancel_list');
  });
}

function screenCancelList() {
  const orders = adminState.orderList;
  return `
    <div class="screen adm-screen">
      ${adminHeader('注文キャンセル')}
      <div class="adm-table-badge">卓番：${adminState.cancelTableNo}</div>
      <div class="adm-sub-header">注文履歴</div>
      <div class="adm-order-list adm-scrollable">
        ${orders.length === 0
          ? '<div class="adm-empty">注文がありません</div>'
          : orders.map(o => `
            <label class="adm-order-row">
              <input type="checkbox" class="order-check" value="${o.id}"
                ${adminState.selectedOrders.includes(o.id) ? 'checked' : ''}>
              ${o.soldOut ? '<span class="adm-soldout-badge">🔴</span>' : ''}
              <span class="adm-order-name">${o.name}</span>
              <span class="adm-order-qty">${o.orderQty}点</span>
            </label>
          `).join('')}
      </div>
      <div class="adm-row-btns">
        <button class="adm-btn-secondary" id="btn-cancel-list-back">戻る</button>
        <button class="adm-btn-primary" id="btn-cancel-list-next">次へ</button>
      </div>
    </div>
  `;
}

function attachCancelListEvents() {
  document.getElementById('btn-settings')?.addEventListener('click', () => adminGoto('logout_confirm'));
  document.querySelectorAll('.order-check').forEach(el => {
    el.addEventListener('change', () => {
      const id = parseInt(el.value);
      if (el.checked) { if (!adminState.selectedOrders.includes(id)) adminState.selectedOrders.push(id); }
      else { adminState.selectedOrders = adminState.selectedOrders.filter(x => x !== id); }
    });
  });
  document.getElementById('btn-cancel-list-back')?.addEventListener('click', () => adminGoto('cancel_search'));
  document.getElementById('btn-cancel-list-next')?.addEventListener('click', () => {
    const checked = [...document.querySelectorAll('.order-check:checked')].map(el => parseInt(el.value));
    adminState.selectedOrders = checked;
    if (checked.length === 0) return;
    adminGoto('cancel_confirm');
  });
}

function screenCancelConfirm() {
  const selected = adminState.orderList.filter(o => adminState.selectedOrders.includes(o.id));
  return `
    <div class="screen adm-screen">
      ${adminHeader('注文キャンセル')}
      <div class="adm-table-badge">卓番：${adminState.cancelTableNo}</div>
      <div class="adm-order-list adm-scrollable">
        ${selected.map(o => `
          <div class="adm-order-row-simple">
            <span>${o.name}</span>
            <div class="adm-qty-ctrl"><span>⊕ ${o.orderQty}</span><span>⊖</span></div>
          </div>
        `).join('')}
      </div>
      <div class="adm-modal-wrap">
        <div class="adm-modal">
          <div class="adm-modal-msg">キャンセルしますか？</div>
          <div class="adm-modal-btns">
            <button class="adm-btn-secondary" id="btn-cancel-confirm-no">いいえ</button>
            <button class="adm-btn-primary" id="btn-cancel-confirm-yes">はい</button>
          </div>
        </div>
      </div>
      <div class="adm-row-btns">
        <button class="adm-btn-secondary" id="btn-cancel-confirm-back">戻る</button>
        <button class="adm-btn-primary" id="btn-cancel-confirm-submit">確定</button>
      </div>
    </div>
  `;
}

function attachCancelConfirmEvents() {
  document.getElementById('btn-settings')?.addEventListener('click', () => adminGoto('logout_confirm'));
  document.getElementById('btn-cancel-confirm-no')?.addEventListener('click', () => adminGoto('cancel_list'));
  document.getElementById('btn-cancel-confirm-yes')?.addEventListener('click', () => {
    if (mockOrders[adminState.cancelTableNo]) {
      mockOrders[adminState.cancelTableNo] =
        mockOrders[adminState.cancelTableNo].filter(o => !adminState.selectedOrders.includes(o.id));
    }
    adminGoto('menu_parttime');
  });
  document.getElementById('btn-cancel-confirm-back')?.addEventListener('click', () => adminGoto('cancel_list'));
  document.getElementById('btn-cancel-confirm-submit')?.addEventListener('click', () => adminGoto('cancel_confirm'));
}

// ===========================
// Slide 10: 提供済み変更
// ===========================
function screenOfferSearch() {
  return `
    <div class="screen adm-screen">
      ${adminHeader('提供済み変更')}
      <div class="adm-body">
        <div class="adm-field-note" style="padding:12px 16px">テーブル番号を入れて確定したら、そのテーブルの注文履歴を呼び出す</div>
        <div class="adm-form">
          <div class="adm-field">
            <label class="adm-label">テーブル番号：</label>
            <input class="adm-input" id="input-offer-table" type="text" value="${adminState.offerTableNo}">
          </div>
          <div class="adm-row-btns">
            <button class="adm-btn-secondary" id="btn-offer-search-back">戻る</button>
            <button class="adm-btn-primary" id="btn-offer-search-next">決定</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function attachOfferSearchEvents() {
  document.getElementById('btn-settings')?.addEventListener('click', () => adminGoto('logout_confirm'));
  document.getElementById('btn-bell')?.addEventListener('click', () => adminGoto('staff_call'));
  document.getElementById('btn-offer-search-back')?.addEventListener('click', () => adminGoto('menu_parttime'));
  document.getElementById('btn-offer-search-next')?.addEventListener('click', () => {
    adminState.offerTableNo  = document.getElementById('input-offer-table').value.trim();
    if (!adminState.offerTableNo) return;
    adminState.orderList     = mockOrders[adminState.offerTableNo] || [];
    adminState.selectedOrders = [];
    adminGoto('offer_list');
  });
}

function screenOfferList() {
  const orders = adminState.orderList;
  return `
    <div class="screen adm-screen">
      ${adminHeader('提供済み変更')}
      <div class="adm-table-badge">卓番：${adminState.offerTableNo}</div>
      <div class="adm-sub-header">注文履歴</div>
      <div class="adm-offer-table-wrap">
        <table class="adm-offer-table">
          <thead>
            <tr><th></th><th>商品名</th><th>注文数</th><th>配膳数</th></tr>
          </thead>
          <tbody>
            ${orders.map(o => `
              <tr>
                <td><input type="checkbox" class="order-check" value="${o.id}"
                  ${adminState.selectedOrders.includes(o.id) ? 'checked' : ''}></td>
                <td class="${o.soldOut ? 'adm-soldout' : ''}">${o.soldOut ? '🔴 ' : ''}${o.name}</td>
                <td>${o.orderQty}</td>
                <td>${o.offerQty}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div class="adm-row-btns">
        <button class="adm-btn-secondary" id="btn-offer-list-back">戻る</button>
        <button class="adm-btn-primary" id="btn-offer-list-next">次へ</button>
      </div>
    </div>
  `;
}

function attachOfferListEvents() {
  document.getElementById('btn-settings')?.addEventListener('click', () => adminGoto('logout_confirm'));
  document.querySelectorAll('.order-check').forEach(el => {
    el.addEventListener('change', () => {
      const id = parseInt(el.value);
      if (el.checked) { if (!adminState.selectedOrders.includes(id)) adminState.selectedOrders.push(id); }
      else { adminState.selectedOrders = adminState.selectedOrders.filter(x => x !== id); }
    });
  });
  document.getElementById('btn-offer-list-back')?.addEventListener('click', () => adminGoto('offer_search'));
  document.getElementById('btn-offer-list-next')?.addEventListener('click', () => {
    const checked = [...document.querySelectorAll('.order-check:checked')].map(el => parseInt(el.value));
    adminState.selectedOrders = checked;
    if (checked.length === 0) return;
    adminGoto('offer_confirm');
  });
}

function screenOfferConfirm() {
  const selected = adminState.orderList.filter(o => adminState.selectedOrders.includes(o.id));
  return `
    <div class="screen adm-screen">
      ${adminHeader('提供済み変更')}
      <div class="adm-table-badge">卓番：${adminState.offerTableNo}</div>
      <div class="adm-order-list adm-scrollable">
        ${selected.map(o => `
          <div class="adm-order-row-simple">
            <span>${o.name}</span>
            <div class="adm-qty-ctrl"><span>⊕ ${o.orderQty}</span><span>⊖</span></div>
          </div>
        `).join('')}
      </div>
      <div class="adm-modal-wrap">
        <div class="adm-modal">
          <div class="adm-modal-msg">提供済みに変更しますか？</div>
          <div class="adm-modal-btns">
            <button class="adm-btn-secondary" id="btn-offer-confirm-no">いいえ</button>
            <button class="adm-btn-primary" id="btn-offer-confirm-yes">はい</button>
          </div>
        </div>
      </div>
      <div class="adm-row-btns">
        <button class="adm-btn-secondary" id="btn-offer-confirm-back">戻る</button>
        <button class="adm-btn-primary" id="btn-offer-confirm-submit">確定</button>
      </div>
    </div>
  `;
}

function attachOfferConfirmEvents() {
  document.getElementById('btn-settings')?.addEventListener('click', () => adminGoto('logout_confirm'));
  document.getElementById('btn-offer-confirm-no')?.addEventListener('click', () => adminGoto('offer_list'));
  document.getElementById('btn-offer-confirm-yes')?.addEventListener('click', () => {
    adminState.selectedOrders.forEach(id => {
      const o = (mockOrders[adminState.offerTableNo] || []).find(x => x.id === id);
      if (o) o.offerQty = o.orderQty;
    });
    adminGoto('menu_parttime');
  });
  document.getElementById('btn-offer-confirm-back')?.addEventListener('click', () => adminGoto('offer_list'));
  document.getElementById('btn-offer-confirm-submit')?.addEventListener('click', () => adminGoto('offer_confirm'));
}

// ===========================
// Slide 11: オーダー一覧
// ===========================
function screenOrderOverview() {
  const tables = Object.keys(mockOrders);
  return `
    <div class="screen adm-screen">
      <div class="adm-plain-header">オーダー一覧</div>
      <div class="adm-overview-grid">
        ${tables.map(t => `
          <div class="adm-overview-card">
            <div class="adm-overview-table">卓番：${t}</div>
            <div class="adm-overview-items">
              ${(mockOrders[t] || []).map(o => `
                <div class="adm-overview-row ${o.soldOut ? 'soldout' : ''}">
                  ${o.soldOut ? '🔴 ' : ''}${o.name}
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
      <div style="padding:12px;flex-shrink:0">
        <button class="adm-btn-secondary wide" id="btn-overview-back">戻る</button>
      </div>
    </div>
  `;
}

function attachOrderOverviewEvents() {
  document.getElementById('btn-overview-back')?.addEventListener('click', () => adminGoto('menu_parttime'));
}

// ===========================
// Slide 12: 店員呼び出し一覧
// ===========================
function screenStaffCall() {
  return `
    <div class="screen adm-screen">
      ${adminHeader('メニュー管理システム 従業員用')}
      <div class="adm-call-section">
        <div class="adm-call-title">※ 店員呼び出し ※</div>
        ${mockCalls.length === 0
          ? '<div class="adm-empty">現在呼び出しはありません</div>'
          : `<div class="adm-call-list">
              ${mockCalls.map(c => `
                <button class="adm-call-btn" data-call-id="${c.callId}">
                  ${c.tableNo}卓　${c.calledAt}
                </button>
              `).join('')}
            </div>`}
      </div>
    </div>
  `;
}

function attachStaffCallEvents() {
  document.getElementById('btn-settings')?.addEventListener('click', () => adminGoto('logout_confirm'));
  document.querySelectorAll('.adm-call-btn').forEach(el => {
    el.addEventListener('click', () => {
      const callId = parseInt(el.dataset.callId);
      const idx    = mockCalls.findIndex(c => c.callId === callId);
      if (idx !== -1) mockCalls.splice(idx, 1);
      adminRender();
    });
  });
}

// ===========================
// 顧客台帳（モックデータ）
// ===========================
function screenCustomerLedger() {
  const jst   = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const today = jst.toISOString().slice(0, 10).replace(/-/g, '');
  const todayCnt = mockCustomers.filter(c => c.customerId.startsWith(today)).length;

  return `
    <div class="screen adm-screen">
      ${adminHeader('顧客台帳')}
      <div class="adm-ledger-stats">
        <div class="adm-stat"><span class="adm-stat-val">${mockCustomers.length}</span><span class="adm-stat-lbl">累計顧客数</span></div>
        <div class="adm-stat"><span class="adm-stat-val">${todayCnt}</span><span class="adm-stat-lbl">本日発行数</span></div>
        <div class="adm-stat"><span class="adm-stat-val">${today}</span><span class="adm-stat-lbl">今日の日付</span></div>
      </div>

      ${ledgerState.lastId ? `
        <div id="ledger-banner" class="adm-id-banner">
          <div class="adm-id-banner-lbl">最新発行番号</div>
          <div class="adm-id-banner-val">
            <span>${ledgerState.lastId}</span>
            <button class="adm-copy-btn" id="btn-copy-id">COPY</button>
          </div>
        </div>` : ''}

      <div class="adm-body adm-scrollable" style="padding:12px;gap:12px;display:flex;flex-direction:column">

        <!-- 発行フォーム -->
        <div style="background:#fff;border-radius:10px;border:1px solid #d8dde3;overflow:hidden">
          <div style="padding:10px 14px;border-bottom:1px solid #d8dde3;font-weight:600;font-size:clamp(13px,3.8vw,15px)">新規顧客番号の発行</div>
          <div class="adm-form" style="padding:12px 14px;gap:10px">
            <div class="adm-field">
              <label class="adm-label">氏名</label>
              <input class="adm-input" id="ledger-name" type="text" placeholder="山田 太郎">
            </div>
            <div class="adm-field">
              <label class="adm-label">卓番</label>
              <input class="adm-input" id="ledger-table" type="text" placeholder="3">
              <span class="adm-required">※ 必須</span>
            </div>
            <div class="adm-field">
              <label class="adm-label">備考</label>
              <textarea class="adm-textarea" id="ledger-note" rows="2" placeholder="メモ（任意）"></textarea>
            </div>
            <div class="adm-error" id="ledger-error"></div>
            <button class="adm-btn-primary wide" id="btn-ledger-generate">番号を発行する</button>
          </div>
        </div>

        <!-- 顧客一覧 -->
        <div style="background:#fff;border-radius:10px;border:1px solid #d8dde3;overflow:hidden">
          <div style="padding:10px 14px;border-bottom:1px solid #d8dde3;font-weight:600;font-size:clamp(13px,3.8vw,15px)">顧客一覧</div>
          <div style="overflow-x:auto">
            <table class="adm-ledger-table">
              <thead><tr><th>顧客番号</th><th>氏名</th><th>卓番</th><th>備考</th><th></th></tr></thead>
              <tbody>
                ${mockCustomers.length === 0
                  ? '<tr><td colspan="5" class="adm-empty">顧客データがありません</td></tr>'
                  : [...mockCustomers].reverse().map(c => `
                    <tr>
                      <td class="adm-ledger-id">${c.customerId}</td>
                      <td>${c.name || '—'}</td>
                      <td>${c.tableNo || '—'}</td>
                      <td style="font-size:clamp(10px,2.5vw,12px)">${c.note || ''}</td>
                      <td><button class="adm-ledger-del" data-cid="${c.customerId}">✕</button></td>
                    </tr>
                  `).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      <div style="padding:12px;flex-shrink:0">
        <button class="adm-btn-secondary wide" id="btn-ledger-back">戻る</button>
      </div>
    </div>
  `;
}

const ledgerState = { lastId: '' };

function attachCustomerLedgerEvents() {
  document.getElementById('btn-settings')?.addEventListener('click', () => adminGoto('logout_confirm'));
  document.getElementById('btn-bell')?.addEventListener('click', () => adminGoto('staff_call'));
  document.getElementById('btn-ledger-back')?.addEventListener('click', () => adminGoBack());

  document.getElementById('btn-copy-id')?.addEventListener('click', () => {
    navigator.clipboard?.writeText(ledgerState.lastId).then(() => {
      const btn = document.getElementById('btn-copy-id');
      if (btn) { btn.textContent = 'COPIED!'; setTimeout(() => btn.textContent = 'COPY', 1600); }
    });
  });

  document.getElementById('btn-ledger-generate')?.addEventListener('click', () => {
    const name  = document.getElementById('ledger-name').value.trim();
    const table = document.getElementById('ledger-table').value.trim();
    const note  = document.getElementById('ledger-note').value.trim();
    const errEl = document.getElementById('ledger-error');
    errEl.textContent = '';
    if (!table) { errEl.textContent = '卓番を入力してください'; return; }

    const cid = mockGenCustomerId();
    mockCustomers.push({ customerId: cid, name, tableNo: table, note });
    ledgerState.lastId = cid;
    adminRender();
  });

  document.querySelectorAll('.adm-ledger-del').forEach(btn => {
    btn.addEventListener('click', () => {
      const cid = btn.dataset.cid;
      const idx = mockCustomers.findIndex(c => c.customerId === cid);
      if (idx !== -1) mockCustomers.splice(idx, 1);
      if (ledgerState.lastId === cid) ledgerState.lastId = '';
      adminRender();
    });
  });
}
