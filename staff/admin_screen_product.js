// ===========================
// 商品検索ウィジェット共通
// ===========================
function productSearchWidget(query, results, selectedIds) {
  return `
    <div class="adm-search-bar">
      <input class="adm-input" id="product-search-input" type="text"
        placeholder="名前（キーワード）を入れて検索" value="${query}">
      <button class="adm-icon-btn" id="btn-product-search">🔍</button>
    </div>
    <div class="adm-search-hint">名前（キーワード）入れて検索 → 結果が出てくる</div>
    <div class="adm-result-list" id="product-result-list">
      ${results.length === 0
        ? '<div class="adm-empty">検索結果がありません</div>'
        : results.map(p => `
          <label class="adm-result-row">
            <input type="checkbox" class="product-check" value="${p.menu_id}"
              ${selectedIds.includes(p.menu_id) ? 'checked' : ''}>
            <span class="${p.sold_out ? 'adm-soldout' : ''}">${p.name}
              <small style="color:#888"> ¥${p.unit_price}</small>
            </span>
          </label>
        `).join('')}
    </div>
  `;
}

function attachProductSearchEvent(onResults) {
  document.getElementById('btn-product-search')?.addEventListener('click', async () => {
    const q = document.getElementById('product-search-input').value.trim();
    adminState.productSearchQuery = q;
    const res = await ApiMenu.getAll(adminState.storeId);
    if (!res.ok) { showApiError('メニューの取得に失敗しました'); return; }
    adminState.productSearchResults = (res.data || []).filter(p =>
      !q || p.name.includes(q)
    );
    if (onResults) onResults();
    else adminRender();
  });
}

function syncProductCheckboxes() {
  document.querySelectorAll('.product-check').forEach(el => {
    el.addEventListener('change', () => {
      const id = parseInt(el.value);
      if (el.checked) {
        if (!adminState.selectedProducts.includes(id)) adminState.selectedProducts.push(id);
      } else {
        adminState.selectedProducts = adminState.selectedProducts.filter(x => x !== id);
      }
    });
  });
}

// ===========================
// Slide 3-1: 商品追加
// ===========================
function screenProductAdd() {
  return `
    <div class="screen adm-screen">
      ${adminHeader('商品追加')}
      <div class="adm-form adm-scrollable">
        <div class="adm-field">
          <label class="adm-label">商品名：</label>
          <input class="adm-input" id="input-product-name" type="text">
          <span class="adm-required">※ 必須</span>
        </div>
        <div class="adm-field">
          <label class="adm-label">カテゴリー：</label>
          <input class="adm-input" id="input-product-category" type="text">
          <span class="adm-required">※ 必須</span>
        </div>
        <div class="adm-field">
          <label class="adm-label">値段：</label>
          <input class="adm-input" id="input-product-price" type="number" min="0">
          <span class="adm-required">※ 必須</span>
        </div>
        <div class="adm-field">
          <label class="adm-label">写真URL：</label>
          <input class="adm-input" id="input-product-photo" type="text" placeholder="https://...">
          <span class="adm-optional">※ 任意</span>
        </div>
        <div class="adm-error" id="product-add-error"></div>
        <div class="adm-row-btns">
          <button class="adm-btn-secondary" id="btn-product-add-back">戻る</button>
          <button class="adm-btn-primary"   id="btn-product-add-next">追加</button>
        </div>
      </div>
    </div>
  `;
}

function attachProductAddEvents() {
  document.getElementById('btn-settings')?.addEventListener('click', () => adminGoto('logout_confirm'));
  document.getElementById('btn-product-add-back')?.addEventListener('click', () => adminGoto('menu_staff'));
  document.getElementById('btn-product-add-next')?.addEventListener('click', () => {
    const name  = document.getElementById('input-product-name').value.trim();
    const cat   = document.getElementById('input-product-category').value.trim();
    const price = document.getElementById('input-product-price').value.trim();
    const photo = document.getElementById('input-product-photo').value.trim();
    const err   = document.getElementById('product-add-error');
    if (!name || !cat || !price) {
      if (err) err.textContent = '必須項目を入力してください'; return;
    }
    adminState.pendingProduct = { name, category: cat, unitPrice: parseInt(price), photoUrl: photo || null };
    adminGoto('product_add_confirm');
  });
}

// ===========================
// Slide 3-2: 商品追加確認
// ===========================
function screenProductAddConfirm() {
  const p = adminState.pendingProduct || {};
  return `
    <div class="screen adm-screen">
      ${adminHeader('商品追加')}
      <div class="adm-form adm-scrollable">
        <div class="adm-field">
          <label class="adm-label">商品名：</label>
          <input class="adm-input" type="text" value="${p.name || ''}" disabled>
        </div>
        <div class="adm-field">
          <label class="adm-label">カテゴリー：</label>
          <input class="adm-input" type="text" value="${p.category || ''}" disabled>
        </div>
        <div class="adm-field">
          <label class="adm-label">値段：</label>
          <input class="adm-input" type="text" value="¥${p.unitPrice || 0}" disabled>
        </div>
        <div class="adm-modal-wrap">
          <div class="adm-modal">
            <div class="adm-modal-msg">商品の追加を許可しますか？</div>
            <div class="adm-modal-btns">
              <button class="adm-btn-secondary" id="btn-add-confirm-no">いいえ</button>
              <button class="adm-btn-primary"   id="btn-add-confirm-yes">はい</button>
            </div>
          </div>
        </div>
        <div class="adm-row-btns">
          <button class="adm-btn-secondary" id="btn-add-back2">戻る</button>
        </div>
      </div>
    </div>
  `;
}

function attachProductAddConfirmEvents() {
  document.getElementById('btn-settings')?.addEventListener('click', () => adminGoto('logout_confirm'));
  document.getElementById('btn-add-confirm-no')?.addEventListener('click', () => adminGoto('product_add'));
  document.getElementById('btn-add-confirm-yes')?.addEventListener('click', async () => {
    const res = await ApiMenu.add({ ...adminState.pendingProduct, storeId: adminState.storeId });
    if (!res.ok) { showApiError('商品の追加に失敗しました'); return; }
    adminGoto('menu_staff');
  });
  document.getElementById('btn-add-back2')?.addEventListener('click', () => adminGoto('product_add'));
}

// ===========================
// Slide 4-1: 商品削除（検索）
// ===========================
function screenProductDelete() {
  return `
    <div class="screen adm-screen">
      ${adminHeader('商品削除')}
      <div class="adm-body adm-scrollable">
        ${productSearchWidget(adminState.productSearchQuery, adminState.productSearchResults, adminState.selectedProducts)}
        <div class="adm-row-btns">
          <button class="adm-btn-secondary" id="btn-delete-back">戻る</button>
          <button class="adm-btn-primary"   id="btn-delete-next">削除</button>
        </div>
      </div>
    </div>
  `;
}

function attachProductDeleteEvents() {
  document.getElementById('btn-settings')?.addEventListener('click', () => adminGoto('logout_confirm'));
  attachProductSearchEvent();
  syncProductCheckboxes();
  document.getElementById('btn-delete-back')?.addEventListener('click', () => adminGoto('menu_staff'));
  document.getElementById('btn-delete-next')?.addEventListener('click', () => {
    const checked = [...document.querySelectorAll('.product-check:checked')].map(el => parseInt(el.value));
    adminState.selectedProducts = checked;
    if (checked.length === 0) { showApiError('削除する商品を選択してください'); return; }
    adminGoto('product_delete_confirm');
  });
}

// ===========================
// Slide 4-2: 商品削除確認
// ===========================
function screenProductDeleteConfirm() {
  return `
    <div class="screen adm-screen">
      ${adminHeader('商品削除')}
      <div class="adm-body adm-scrollable">
        ${productSearchWidget(adminState.productSearchQuery, adminState.productSearchResults, adminState.selectedProducts)}
        <div class="adm-modal-wrap">
          <div class="adm-modal">
            <div class="adm-modal-msg">商品の削除を許可しますか？</div>
            <div class="adm-modal-btns">
              <button class="adm-btn-secondary" id="btn-del-confirm-no">いいえ</button>
              <button class="adm-btn-primary"   id="btn-del-confirm-yes">はい</button>
            </div>
          </div>
        </div>
        <div class="adm-row-btns">
          <button class="adm-btn-secondary" id="btn-delete-back2">戻る</button>
        </div>
      </div>
    </div>
  `;
}

function attachProductDeleteConfirmEvents() {
  document.getElementById('btn-settings')?.addEventListener('click', () => adminGoto('logout_confirm'));
  document.getElementById('btn-del-confirm-no')?.addEventListener('click', () => adminGoto('product_delete'));
  document.getElementById('btn-del-confirm-yes')?.addEventListener('click', async () => {
    for (const id of adminState.selectedProducts) {
      const res = await ApiMenu.remove(id);
      if (!res.ok) { showApiError(`商品ID ${id} の削除に失敗しました`); return; }
    }
    adminState.selectedProducts = [];
    adminGoto('menu_staff');
  });
  document.getElementById('btn-delete-back2')?.addEventListener('click', () => adminGoto('product_delete'));
}

// ===========================
// Slide 5-1: 商品変更（検索）
// ===========================
function screenProductEditSearch() {
  return `
    <div class="screen adm-screen">
      ${adminHeader('商品変更')}
      <div class="adm-body adm-scrollable">
        ${productSearchWidget(adminState.productSearchQuery, adminState.productSearchResults, adminState.selectedProducts)}
        <div class="adm-row-btns">
          <button class="adm-btn-secondary" id="btn-edit-search-back">戻る</button>
          <button class="adm-btn-primary"   id="btn-edit-search-next">次へ</button>
        </div>
      </div>
    </div>
  `;
}

function attachProductEditSearchEvents() {
  document.getElementById('btn-settings')?.addEventListener('click', () => adminGoto('logout_confirm'));
  attachProductSearchEvent();
  syncProductCheckboxes();
  document.getElementById('btn-edit-search-back')?.addEventListener('click', () => adminGoto('menu_staff'));
  document.getElementById('btn-edit-search-next')?.addEventListener('click', () => {
    const checked = [...document.querySelectorAll('.product-check:checked')].map(el => parseInt(el.value));
    if (checked.length === 0) { showApiError('変更する商品を選択してください'); return; }
    adminState.editTarget = adminState.productSearchResults.find(p => p.menu_id === checked[0]);
    adminGoto('product_edit_form');
  });
}

// ===========================
// Slide 5-2: 商品変更フォーム
// ===========================
function screenProductEditForm() {
  const t = adminState.editTarget || {};
  return `
    <div class="screen adm-screen">
      ${adminHeader('商品変更')}
      <div class="adm-body adm-scrollable">
        <div class="adm-change-section">
          <div class="adm-change-label">変更前</div>
          <div class="adm-change-tag">${t.name || ''} ¥${t.unit_price || ''}</div>
        </div>
        <div class="adm-form">
          <div class="adm-field">
            <label class="adm-label">商品名：</label>
            <input class="adm-input" id="input-edit-name" type="text" value="${t.name || ''}">
          </div>
          <div class="adm-field">
            <label class="adm-label">値段：</label>
            <input class="adm-input" id="input-edit-price" type="number" value="${t.unit_price || ''}">
          </div>
        </div>
        <div class="adm-row-btns">
          <button class="adm-btn-secondary" id="btn-edit-form-back">戻る</button>
          <button class="adm-btn-primary"   id="btn-edit-form-next">変更</button>
        </div>
      </div>
    </div>
  `;
}

function attachProductEditFormEvents() {
  document.getElementById('btn-settings')?.addEventListener('click', () => adminGoto('logout_confirm'));
  document.getElementById('btn-edit-form-back')?.addEventListener('click', () => adminGoto('product_edit_search'));
  document.getElementById('btn-edit-form-next')?.addEventListener('click', () => {
    adminState.editAfterName  = document.getElementById('input-edit-name').value.trim();
    adminState.editAfterPrice = parseInt(document.getElementById('input-edit-price').value);
    if (!adminState.editAfterName) { showApiError('商品名を入力してください'); return; }
    adminGoto('product_edit_confirm');
  });
}

// ===========================
// Slide 5-3: 商品変更確認
// ===========================
function screenProductEditConfirm() {
  const t = adminState.editTarget || {};
  return `
    <div class="screen adm-screen">
      ${adminHeader('商品変更')}
      <div class="adm-body adm-scrollable">
        <div class="adm-change-section">
          <div class="adm-change-label">変更前</div>
          <div class="adm-change-tag">${t.name || ''}</div>
        </div>
        <div class="adm-change-section" style="margin-top:12px">
          <div class="adm-change-label">変更後</div>
          <div class="adm-change-tag" style="background:#2e7d32">${adminState.editAfterName || ''} ¥${adminState.editAfterPrice || ''}</div>
        </div>
        <div class="adm-modal-wrap">
          <div class="adm-modal">
            <div class="adm-modal-msg">商品の変更を許可しますか？</div>
            <div class="adm-modal-btns">
              <button class="adm-btn-secondary" id="btn-edit-confirm-no">いいえ</button>
              <button class="adm-btn-primary"   id="btn-edit-confirm-yes">はい</button>
            </div>
          </div>
        </div>
        <div class="adm-row-btns">
          <button class="adm-btn-secondary" id="btn-edit-confirm-back">戻る</button>
        </div>
      </div>
    </div>
  `;
}

function attachProductEditConfirmEvents() {
  document.getElementById('btn-settings')?.addEventListener('click', () => adminGoto('logout_confirm'));
  document.getElementById('btn-edit-confirm-no')?.addEventListener('click', () => adminGoto('product_edit_form'));
  document.getElementById('btn-edit-confirm-yes')?.addEventListener('click', async () => {
    const res = await ApiMenu.update(adminState.editTarget.menu_id, {
      name: adminState.editAfterName,
      unitPrice: adminState.editAfterPrice,
    });
    if (!res.ok) { showApiError('商品の変更に失敗しました'); return; }
    adminGoto('menu_staff');
  });
  document.getElementById('btn-edit-confirm-back')?.addEventListener('click', () => adminGoto('product_edit_form'));
}
