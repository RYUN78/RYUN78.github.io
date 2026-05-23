// ===========================
// カテゴリ選択肢
// ===========================
const PRODUCT_CATEGORIES = [
  '焼鳥（たれ）',
  '焼鳥（塩）',
  '一品',
  'デザート',
  'シメ',
  'ソフトドリンク',
  'アルコール',
  '飲み放題',
  'その他',
];

// ===========================
// 商品検索ウィジェット共通
// ===========================
function productSearchWidget(query, results, selectedIds) {
  return `
    <div class="adm-search-bar">
      <input class="adm-input" id="product-search-input" ...>
      <button class="adm-icon-btn" id="btn-product-search">🔍</button>
    </div>
    <div style="padding:6px 0 0;background:#4a7fc1">
      <select class="adm-input" id="product-search-category" ...>   // ← 追加
        <option value="">すべてのカテゴリー</option>
        ${PRODUCT_CATEGORIES.map(cat => `<option ...>${cat}</option>`).join('')}
      </select>
    </div>
    <div class="adm-search-hint">カテゴリーで絞り込み＋名前で検索できます</div>
    <div class="adm-result-list" id="product-result-list">
      ${results.map(p => `
        <label class="adm-result-row">
          <input type="checkbox" class="product-check" value="${p.id}"
            ${selectedIds.includes(p.id) ? 'checked' : ''}>
          <span class="${p.soldOut ? 'adm-soldout' : ''}">${p.name}</span>
        </label>
      `).join('')}
    </div>
  `;
}

function attachProductSearchEvent() {
  document.getElementById('btn-product-search')?.addEventListener('click', () => {
    _runProductSearch();
  });
  // ↓ カテゴリー変更で即検索（追加）
  document.getElementById('product-search-category')?.addEventListener('change', (e) => {
    adminState.productSearchCategory = e.target.value;
    _runProductSearch();
  });
  // ↓ Enterキーでも検索（追加）
  document.getElementById('product-search-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') _runProductSearch();
  });
}

// ↓ 検索ロジックを関数として切り出し（追加）
function _runProductSearch() {
  const q   = document.getElementById('product-search-input')?.value.trim() || '';
  const cat = document.getElementById('product-search-category')?.value || '';
  adminState.productSearchQuery    = q;
  adminState.productSearchCategory = cat;
  adminState.productSearchResults  = mockProducts.filter(p => {
    const matchName = !q   || p.name.includes(q);
    const matchCat  = !cat || p.category === cat;
    return matchName && matchCat;
  });
  adminRender();
}

function syncCheckedProducts() {
  document.querySelectorAll('.product-check').forEach(el => {
    el.addEventListener('change', () => {
      const id = parseInt(el.value);
      if (el.checked) { if (!adminState.selectedProducts.includes(id)) adminState.selectedProducts.push(id); }
      else { adminState.selectedProducts = adminState.selectedProducts.filter(x => x !== id); }
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
          <select class="adm-input" id="input-product-category">
            <option value="">選択してください</option>
            ${PRODUCT_CATEGORIES.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
          </select>
          <span class="adm-required">※ 必須</span>
          <div id="input-product-category-other-wrap" style="display:none;margin-top:4px">
            <input class="adm-input" id="input-product-category-other" type="text" placeholder="カテゴリー名を入力">
          </div>
        </div>
        <div class="adm-field">
          <label class="adm-label">値段：</label>
          <input class="adm-input" id="input-product-price" type="number">
          <span class="adm-required">※ 必須</span>
        </div>
        <div class="adm-field">
          <label class="adm-label">写真：</label>
          <input class="adm-input" id="input-product-photo" type="text" placeholder="URL">
          <span class="adm-optional">※ 任意</span>
        </div>
        <div class="adm-field">
          <label class="adm-label">追記事項：</label>
          <textarea class="adm-textarea" id="input-product-note" rows="3"
            placeholder="アレルギー情報・説明文など（任意）"></textarea>
          <span class="adm-optional">※ 任意</span>
        </div>
        <div class="adm-error" id="product-add-error"></div>
        <div class="adm-row-btns">
          <button class="adm-btn-secondary" id="btn-product-add-back">戻る</button>
          <button class="adm-btn-primary" id="btn-product-add-next">追加</button>
        </div>
      </div>
    </div>
  `;
}

function attachProductAddEvents() {
  document.getElementById('btn-settings')?.addEventListener('click', () => adminGoto('logout_confirm'));
  document.getElementById('btn-bell')?.addEventListener('click', () => adminGoto('staff_call'));
  document.getElementById('btn-product-add-back')?.addEventListener('click', () => adminGoto('menu_staff'));
  document.getElementById('btn-product-add-next')?.addEventListener('click', () => {
    const name  = document.getElementById('input-product-name').value.trim();
    const cat   = document.getElementById('input-product-category').value.trim();
    const price = document.getElementById('input-product-price').value.trim();
    const err   = document.getElementById('product-add-error');
    if (!name || !cat || !price) { if (err) err.textContent = '必須項目を入力してください'; return; }
    const note = document.getElementById('input-product-note').value.trim();
    adminState.pendingProduct = { name, category: cat, price: parseInt(price), note };
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
          <input class="adm-input" type="number" value="${p.price || ''}" disabled>
        </div>
        <div class="adm-field">
          <label class="adm-label">追記事項：</label>
          <textarea class="adm-textarea" rows="3" disabled>${p.note || ''}</textarea>
        </div>
        <div class="adm-modal-wrap">
          <div class="adm-modal">
            <div class="adm-modal-msg">商品の追加を許可しますか？</div>
            <div class="adm-modal-btns">
              <button class="adm-btn-secondary" id="btn-add-confirm-no">いいえ</button>
              <button class="adm-btn-primary" id="btn-add-confirm-yes">はい</button>
            </div>
          </div>
        </div>
        <div class="adm-row-btns">
          <button class="adm-btn-secondary" id="btn-add-back2">戻る</button>
          <button class="adm-btn-primary" id="btn-add-submit">追加</button>
        </div>
      </div>
    </div>
  `;
}

function attachProductAddConfirmEvents() {
  document.getElementById('btn-settings')?.addEventListener('click', () => adminGoto('logout_confirm'));
  document.getElementById('btn-add-confirm-no')?.addEventListener('click', () => adminGoto('product_add'));
  document.getElementById('btn-add-confirm-yes')?.addEventListener('click', () => {
    const p   = adminState.pendingProduct;
    const newId = Math.max(...mockProducts.map(x => x.id)) + 1;
    if (p) mockProducts.push({ id: newId, name: p.name, category: p.category, price: p.price, note: p.note || '', soldOut: false });
    adminGoto('menu_staff');
  });
  document.getElementById('btn-add-back2')?.addEventListener('click', () => adminGoto('product_add'));
  document.getElementById('btn-add-submit')?.addEventListener('click', () => adminGoto('product_add_confirm'));
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
          <button class="adm-btn-primary" id="btn-delete-next">削除</button>
        </div>
      </div>
    </div>
  `;
}

function attachProductDeleteEvents() {
  document.getElementById('btn-settings')?.addEventListener('click', () => adminGoto('logout_confirm'));
  attachProductSearchEvent();
  syncCheckedProducts();
  document.getElementById('btn-delete-back')?.addEventListener('click', () => adminGoto('menu_staff'));
  document.getElementById('btn-delete-next')?.addEventListener('click', () => {
    const checked = [...document.querySelectorAll('.product-check:checked')].map(el => parseInt(el.value));
    adminState.selectedProducts = checked;
    if (checked.length === 0) return;
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
              <button class="adm-btn-primary" id="btn-del-confirm-yes">はい</button>
            </div>
          </div>
        </div>
        <div class="adm-row-btns">
          <button class="adm-btn-secondary" id="btn-delete-back2">戻る</button>
          <button class="adm-btn-primary" id="btn-delete-submit">削除</button>
        </div>
      </div>
    </div>
  `;
}

function attachProductDeleteConfirmEvents() {
  document.getElementById('btn-settings')?.addEventListener('click', () => adminGoto('logout_confirm'));
  document.getElementById('btn-del-confirm-no')?.addEventListener('click', () => adminGoto('product_delete'));
  document.getElementById('btn-del-confirm-yes')?.addEventListener('click', () => {
    adminState.selectedProducts.forEach(id => {
      const idx = mockProducts.findIndex(p => p.id === id);
      if (idx !== -1) mockProducts.splice(idx, 1);
    });
    adminState.selectedProducts = [];
    adminGoto('menu_staff');
  });
  document.getElementById('btn-delete-back2')?.addEventListener('click', () => adminGoto('product_delete'));
  document.getElementById('btn-delete-submit')?.addEventListener('click', () => adminGoto('product_delete_confirm'));
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
          <button class="adm-btn-primary" id="btn-edit-search-next">次へ</button>
        </div>
      </div>
    </div>
  `;
}

function attachProductEditSearchEvents() {
  document.getElementById('btn-settings')?.addEventListener('click', () => adminGoto('logout_confirm'));
  attachProductSearchEvent();
  syncCheckedProducts();
  document.getElementById('btn-edit-search-back')?.addEventListener('click', () => adminGoto('menu_staff'));
  document.getElementById('btn-edit-search-next')?.addEventListener('click', () => {
    const checked = [...document.querySelectorAll('.product-check:checked')].map(el => parseInt(el.value));
    if (checked.length === 0) return;
    adminState.editTarget = mockProducts.find(p => p.id === checked[0]);
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
          <div class="adm-change-tag">${t.name || ''}</div>
        </div>
        <div class="adm-change-section" style="margin-top:12px">
          <div class="adm-change-label">変更後</div>
          <textarea class="adm-textarea" id="input-edit-after" rows="3"
            placeholder="変更後の内容を入力"></textarea>
        </div>
        <div class="adm-row-btns">
          <button class="adm-btn-secondary" id="btn-edit-form-back">戻る</button>
          <button class="adm-btn-primary" id="btn-edit-form-next">変更</button>
        </div>
      </div>
    </div>
  `;
}

function attachProductEditFormEvents() {
  document.getElementById('btn-settings')?.addEventListener('click', () => adminGoto('logout_confirm'));
  document.getElementById('btn-edit-form-back')?.addEventListener('click', () => adminGoto('product_edit_search'));
  document.getElementById('btn-edit-form-next')?.addEventListener('click', () => {
    adminState.editAfter = document.getElementById('input-edit-after').value.trim();
    if (!adminState.editAfter) return;
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
        <div class="adm-modal-wrap">
          <div class="adm-modal">
            <div class="adm-modal-msg">商品の変更を許可しますか？</div>
            <div class="adm-modal-btns">
              <button class="adm-btn-secondary" id="btn-edit-confirm-no">いいえ</button>
              <button class="adm-btn-primary" id="btn-edit-confirm-yes">はい</button>
            </div>
          </div>
        </div>
        <div class="adm-row-btns">
          <button class="adm-btn-secondary" id="btn-edit-confirm-back">戻る</button>
          <button class="adm-btn-primary" id="btn-edit-confirm-submit">変更</button>
        </div>
      </div>
    </div>
  `;
}

function attachProductEditConfirmEvents() {
  document.getElementById('btn-settings')?.addEventListener('click', () => adminGoto('logout_confirm'));
  document.getElementById('btn-edit-confirm-no')?.addEventListener('click', () => adminGoto('product_edit_form'));
  document.getElementById('btn-edit-confirm-yes')?.addEventListener('click', () => {
    if (adminState.editTarget) adminState.editTarget.name = adminState.editAfter;
    adminGoto('menu_staff');
  });
  document.getElementById('btn-edit-confirm-back')?.addEventListener('click', () => adminGoto('product_edit_form'));
  document.getElementById('btn-edit-confirm-submit')?.addEventListener('click', () => adminGoto('product_edit_confirm'));
}
