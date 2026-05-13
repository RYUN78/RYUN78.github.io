// ===========================
// 売り切れ表示（API連携）
// ===========================
function screenSoldoutSearch() {
  return `
    <div class="screen adm-screen">
      ${adminHeader('売り切れ表示')}
      <div class="adm-body adm-scrollable">
        <div class="adm-search-bar">
          <input class="adm-input" id="product-search-input" type="text"
            placeholder="名前（キーワード）を入れて検索" value="${adminState.productSearchQuery}">
          <button class="adm-icon-btn" id="btn-product-search">🔍</button>
        </div>
        <div class="adm-search-hint">名前（キーワード）入れて検索→結果が出てくる</div>
        <div class="adm-result-list">
          ${adminState.productSearchResults.map(p => `
            <label class="adm-result-row">
              <input type="checkbox" class="product-check" value="${p.menu_id}"
                ${adminState.selectedProducts.includes(p.menu_id) ? 'checked' : ''}>
              <span class="${p.sold_out ? 'adm-soldout' : ''}">${p.name}${p.sold_out ? '（売り切れ）' : ''}</span>
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
  document.getElementById('btn-bell')?.addEventListener('click', () => loadAndGotoStaffCall());
  document.getElementById('btn-product-search')?.addEventListener('click', async () => {
    const q = document.getElementById('product-search-input').value.trim();
    adminState.productSearchQuery = q;
    const res = await ApiMenu.getAll(adminState.storeId);
    if (!res.ok) { showApiError('商品取得に失敗しました'); return; }
    adminState.productSearchResults = (res.data || []).filter(p => !q || p.name.includes(q));
    adminRender();
  });
  document.querySelectorAll('.product-check').forEach(el => {
    el.addEventListener('change', () => {
      const id = parseInt(el.value);
      if (el.checked) { if (!adminState.selectedProducts.includes(id)) adminState.selectedProducts.push(id); }
      else adminState.selectedProducts = adminState.selectedProducts.filter(x => x !== id);
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
  const selected = adminState.productSearchResults.filter(p => adminState.selectedProducts.includes(p.menu_id));
  return `
    <div class="screen adm-screen">
      ${adminHeader('売り切れ表示')}
      <div class="adm-body adm-scrollable">
        <div class="adm-result-list">
          ${selected.map(p => `<div class="adm-result-row"><span>${p.name}</span></div>`).join('')}
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
        </div>
      </div>
    </div>
  `;
}

function attachSoldoutConfirmEvents() {
  document.getElementById('btn-settings')?.addEventListener('click', () => adminGoto('logout_confirm'));
  document.getElementById('btn-bell')?.addEventListener('click', () => loadAndGotoStaffCall());
  document.getElementById('btn-soldout-confirm-no')?.addEventListener('click', () => adminGoto('soldout_search'));
  document.getElementById('btn-soldout-confirm-yes')?.addEventListener('click', async () => {
    const res = await ApiMenu.updateSoldOut(adminState.selectedProducts, true);
    if (!res.ok) { showApiError('売り切れ更新に失敗しました'); return; }
    adminState.selectedProducts = [];
    adminGoto('menu_parttime');
  });
  document.getElementById('btn-soldout-back2')?.addEventListener('click', () => adminGoto('soldout_search'));
}

// ===========================
// 注文（QRスキャン→手動入力）
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
  document.getElementById('btn-bell')?.addEventListener('click', () => loadAndGotoStaffCall());
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
            <option value="none" ${adminState.orderNomihoudai==='none'?'selected':''}>なし</option>
            <option value="standard" ${adminState.orderNomihoudai==='standard'?'selected':''}>スタンダード</option>
            <option value="premium" ${adminState.orderNomihoudai==='premium'?'selected':''}>プレミアム</option>
          </select>
          <span class="adm-required">※ 必須</span>
          <div class="adm-field-note">飲み放題は、なし、スタンダード、プレミアムを選ぶ</div>
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
  document.getElementById('btn-bell')?.addEventListener('click', () => loadAndGotoStaffCall());
  document.getElementById('btn-order-form-back')?.addEventListener('click', () => adminGoto('order_scan'));
  document.getElementById('btn-order-form-next')?.addEventListener('click', () => {
    adminState.orderTableNo    = document.getElementById('input-order-table').value.trim();
    adminState.orderNomihoudai = document.getElementById('input-order-nomihoudai').value;
    if (!adminState.orderTableNo || !adminState.orderNomihoudai) return;
    adminGoto('order_form_confirm');
  });
}

function screenOrderFormConfirm() {
  return `
    <div class="screen adm-screen">
      ${adminHeader('注文')}
      <div class="adm-form adm-scrollable">
        <div class="adm-field">
          <label class="adm-label">テーブル番号：</label>
          <input class="adm-input" type="text" value="${adminState.orderTableNo}" disabled>
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
        </div>
      </div>
    </div>
  `;
}

function attachOrderFormConfirmEvents() {
  document.getElementById('btn-settings')?.addEventListener('click', () => adminGoto('logout_confirm'));
  document.getElementById('btn-bell')?.addEventListener('click', () => loadAndGotoStaffCall());
  document.getElementById('btn-order-confirm-no')?.addEventListener('click', () => adminGoto('order_form'));
  document.getElementById('btn-order-confirm-yes')?.addEventListener('click', async () => {
    // テーブル番号で入店セッションを発行
    const res = await ApiCustomer.checkin(adminState.storeId, adminState.orderTableNo, 1, 0);
    if (!res.ok) { showApiError('入店処理に失敗しました'); return; }
    adminGoto('menu_parttime');
  });
  document.getElementById('btn-order-confirm-back')?.addEventListener('click', () => adminGoto('order_form'));
}

// ===========================
// 注文キャンセル（API連携）
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
  document.getElementById('btn-bell')?.addEventListener('click', () => loadAndGotoStaffCall());
  document.getElementById('btn-cancel-search-back')?.addEventListener('click', () => adminGoto('menu_parttime'));
  document.getElementById('btn-cancel-search-next')?.addEventListener('click', async () => {
    adminState.cancelTableNo = document.getElementById('input-cancel-table').value.trim();
    if (!adminState.cancelTableNo) return;
    const res = await ApiOrder.getByTable(adminState.cancelTableNo, adminState.storeId);
    if (!res.ok || !res.data?.length) { showApiError('注文が見つかりません'); return; }
    adminState.orderList     = res.data[0].items.map((item, i) => ({ id: i, ...item }));
    adminState.orderCustomerId = res.data[0].customerId;
    adminState.selectedOrders = [];
    adminGoto('cancel_list');
  });
}

function screenCancelList() {
  return `
    <div class="screen adm-screen">
      ${adminHeader('注文キャンセル')}
      <div class="adm-table-badge">卓番：${adminState.cancelTableNo}</div>
      <div class="adm-sub-header">注文履歴</div>
      <div class="adm-order-list adm-scrollable">
        ${adminState.orderList.length === 0
          ? '<div class="adm-empty">注文がありません</div>'
          : adminState.orderList.map(o => `
            <label class="adm-order-row">
              <input type="checkbox" class="order-check" value="${o.id}"
                ${adminState.selectedOrders.includes(o.id) ? 'checked' : ''}>
              <span class="adm-order-name">${o.menuName}</span>
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
  document.getElementById('btn-bell')?.addEventListener('click', () => loadAndGotoStaffCall());
  document.querySelectorAll('.order-check').forEach(el => {
    el.addEventListener('change', () => {
      const id = parseInt(el.value);
      if (el.checked) { if (!adminState.selectedOrders.includes(id)) adminState.selectedOrders.push(id); }
      else adminState.selectedOrders = adminState.selectedOrders.filter(x => x !== id);
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
      <div class="adm-order-list">
        ${selected.map(o => `
          <div class="adm-order-row-simple">
            <span>${o.menuName}</span>
            <span>${o.orderQty}点</span>
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
      </div>
    </div>
  `;
}

function attachCancelConfirmEvents() {
  document.getElementById('btn-settings')?.addEventListener('click', () => adminGoto('logout_confirm'));
  document.getElementById('btn-bell')?.addEventListener('click', () => loadAndGotoStaffCall());
  document.getElementById('btn-cancel-confirm-no')?.addEventListener('click', () => adminGoto('cancel_list'));
  document.getElementById('btn-cancel-confirm-yes')?.addEventListener('click', async () => {
    // itemIdはindexなのでAPIには実際のitem_idが必要。ここでは注文行全体を削除
    // TODO: バックエンドのitem_idを使って正確に削除する
    const res = await ApiOrder.cancel(adminState.selectedOrders);
    if (!res.ok) { showApiError('キャンセルに失敗しました'); return; }
    adminGoto('menu_parttime');
  });
  document.getElementById('btn-cancel-confirm-back')?.addEventListener('click', () => adminGoto('cancel_list'));
}

// ===========================
// 提供済み変更（API連携）
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
  document.getElementById('btn-bell')?.addEventListener('click', () => loadAndGotoStaffCall());
  document.getElementById('btn-offer-search-back')?.addEventListener('click', () => adminGoto('menu_parttime'));
  document.getElementById('btn-offer-search-next')?.addEventListener('click', async () => {
    adminState.offerTableNo = document.getElementById('input-offer-table').value.trim();
    if (!adminState.offerTableNo) return;
    const res = await ApiOrder.getByTable(adminState.offerTableNo, adminState.storeId);
    if (!res.ok || !res.data?.length) { showApiError('注文が見つかりません'); return; }
    adminState.orderList       = res.data[0].items.map((item, i) => ({ id: i, ...item }));
    adminState.orderCustomerId = res.data[0].customerId;
    adminState.selectedOrders  = [];
    adminGoto('offer_list');
  });
}

function screenOfferList() {
  return `
    <div class="screen adm-screen">
      ${adminHeader('提供済み変更')}
      <div class="adm-table-badge">卓番：${adminState.offerTableNo}</div>
      <div class="adm-sub-header">注文履歴</div>
      <div class="adm-offer-table-wrap">
        <table class="adm-offer-table">
          <thead><tr><th></th><th>商品名</th><th>注文数</th><th>配膳数</th></tr></thead>
          <tbody>
            ${adminState.orderList.map(o => `
              <tr>
                <td><input type="checkbox" class="order-check" value="${o.id}"
                  ${adminState.selectedOrders.includes(o.id) ? 'checked' : ''}></td>
                <td>${o.menuName}</td>
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
  document.getElementById('btn-bell')?.addEventListener('click', () => loadAndGotoStaffCall());
  document.querySelectorAll('.order-check').forEach(el => {
    el.addEventListener('change', () => {
      const id = parseInt(el.value);
      if (el.checked) { if (!adminState.selectedOrders.includes(id)) adminState.selectedOrders.push(id); }
      else adminState.selectedOrders = adminState.selectedOrders.filter(x => x !== id);
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
      <div class="adm-order-list">
        ${selected.map(o => `
          <div class="adm-order-row-simple">
            <span>${o.menuName}</span><span>${o.orderQty}点</span>
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
      </div>
    </div>
  `;
}

function attachOfferConfirmEvents() {
  document.getElementById('btn-settings')?.addEventListener('click', () => adminGoto('logout_confirm'));
  document.getElementById('btn-bell')?.addEventListener('click', () => loadAndGotoStaffCall());
  document.getElementById('btn-offer-confirm-no')?.addEventListener('click', () => adminGoto('offer_list'));
  document.getElementById('btn-offer-confirm-yes')?.addEventListener('click', async () => {
    const updates = adminState.selectedOrders.map(idx => {
      const o = adminState.orderList[idx];
      return { itemId: idx, offerQty: o ? o.orderQty : 0 };
    });
    const res = await ApiOrder.updateOffer(adminState.orderCustomerId, updates);
    if (!res.ok) { showApiError('提供済み更新に失敗しました'); return; }
    adminGoto('menu_parttime');
  });
  document.getElementById('btn-offer-confirm-back')?.addEventListener('click', () => adminGoto('offer_list'));
}

// ===========================
// オーダー一覧（API連携）
// ===========================
function screenOrderOverview() {
  const orders = adminState.orderList || [];
  return `
    <div class="screen adm-screen">
      <div class="adm-plain-header">オーダー一覧</div>
      <div class="adm-overview-grid">
        ${orders.map(o => `
          <div class="adm-overview-card">
            <div class="adm-overview-table">卓番：${o.tableNo || '-'}</div>
            <div class="adm-overview-items">
              ${(o.items || []).map(i => `
                <div class="adm-overview-row">${i.menuName} × ${i.orderQty}</div>
              `).join('')}
            </div>
          </div>
        `).join('')}
        ${orders.length === 0 ? '<div class="adm-empty">注文がありません</div>' : ''}
      </div>
      <div style="padding:12px">
        <button class="adm-btn-secondary wide" id="btn-overview-back">戻る</button>
      </div>
    </div>
  `;
}

function attachOrderOverviewEvents() {
  document.getElementById('btn-overview-back')?.addEventListener('click', () => adminGoto('menu_parttime'));
}

// ===========================
// 店員呼び出し一覧（API連携）
// ===========================
function screenStaffCall() {
  const calls = adminState.callList || [];
  return `
    <div class="screen adm-screen">
      ${adminHeader('メニュー管理システム 従業員用')}
      <div class="adm-call-section">
        <div class="adm-call-title">※ 店員呼び出し ※</div>
        <div class="adm-call-list">
          ${calls.length === 0
            ? '<div class="adm-empty">呼び出しはありません</div>'
            : calls.map(c => `
                <button class="adm-call-btn" data-callid="${c.call_id}">
                  ${c.table_no}卓　<span style="font-size:0.8em;font-weight:400">${c.called_at.slice(11,16)}</span>
                </button>
              `).join('')}
        </div>
      </div>
    </div>
  `;
}

function attachStaffCallEvents() {
  document.getElementById('btn-settings')?.addEventListener('click', () => adminGoto('logout_confirm'));
  document.getElementById('btn-bell')?.addEventListener('click', () => loadAndGotoStaffCall());
  document.querySelectorAll('.adm-call-btn').forEach(el => {
    el.addEventListener('click', async () => {
      const callId = parseInt(el.dataset.callid);
      const res = await ApiCall.resolve(callId);
      if (!res.ok) { showApiError('対応済み更新に失敗しました'); return; }
      // 一覧を再取得して再描画
      await loadAndGotoStaffCall();
    });
  });
}
