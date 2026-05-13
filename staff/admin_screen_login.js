// ===========================
// 共通ヘッダー
// ===========================
function adminHeader(title, showSettings = true) {
  return `
    <div class="adm-header">
      <div class="adm-header-title">
        <span class="adm-store">みどり亭</span>
        <span class="adm-subtitle">${title}</span>
      </div>
      <div class="adm-header-icons">
        ${showSettings ? `<button class="adm-icon-btn" id="btn-settings">⚙️</button>` : ''}
        <button class="adm-icon-btn" id="btn-bell">🔔</button>
      </div>
    </div>
  `;
}

// ===========================
// Slide 1: ログイン
// ===========================
function screenLogin() {
  return `
    <div class="screen adm-screen adm-login">
      <div class="adm-login-title">
        <div class="adm-store-lg">みどり亭</div>
        <div class="adm-sys-name">メニュー管理システム</div>
      </div>
      <div class="adm-form">
        <div class="adm-field">
          <label class="adm-label">ユーザーID：</label>
          <input class="adm-input" id="input-userid" type="text" value="${adminState.userId}">
          <span class="adm-required">※ 必須</span>
        </div>
        <div class="adm-field">
          <label class="adm-label">パスワード：</label>
          <input class="adm-input" id="input-password" type="password">
          <span class="adm-required">※ 必須</span>
        </div>
        <div class="adm-error" id="login-error"></div>
        <button class="adm-btn-primary wide" id="btn-login">ログイン</button>
        <div class="adm-login-note">ユーザIDとパスワードで社員かアルバイトか判断する</div>
      </div>
    </div>
  `;
}

function attachLoginEvents() {
  document.getElementById('btn-login')?.addEventListener('click', async () => {
    const uid = document.getElementById('input-userid').value.trim();
    const pw  = document.getElementById('input-password').value;
    if (!uid || !pw) {
      document.getElementById('login-error').textContent = 'IDとパスワードを入力してください';
      return;
    }

    const res = await ApiAuth.login(uid, pw);
    if (!res.ok) {
      document.getElementById('login-error').textContent = 'IDまたはパスワードが正しくありません';
      return;
    }

    Auth.setToken(res.data.token);
    Auth.setRole(res.data.role);
    adminState.role   = res.data.role;
    adminState.userId = res.data.userId;

    adminGoto(res.data.role === 'staff' ? 'menu_staff' : 'menu_parttime');
  });
}

// ===========================
// Slide 2-1: 社員メニュー
// ===========================
function screenMenuStaff() {
  return `
    <div class="screen adm-screen">
      ${adminHeader('メニュー管理システム 社員用')}
      <div class="adm-menu-list">
        <button class="adm-menu-btn" id="btn-product-add">商品追加</button>
        <button class="adm-menu-btn" id="btn-product-delete">商品削除</button>
        <button class="adm-menu-btn" id="btn-product-edit">商品変更</button>
        <button class="adm-menu-btn accent" id="btn-to-parttime">アルバイト用</button>
      </div>
    </div>
  `;
}

function attachMenuStaffEvents() {
  document.getElementById('btn-settings')?.addEventListener('click', () => adminGoto('logout_confirm'));
  document.getElementById('btn-bell')?.addEventListener('click', () => loadAndGotoStaffCall());
  document.getElementById('btn-product-add')?.addEventListener('click', () => adminGoto('product_add'));
  document.getElementById('btn-product-delete')?.addEventListener('click', async () => {
    adminState.productSearchQuery   = '';
    adminState.productSearchResults = [];
    adminState.selectedProducts     = [];
    adminGoto('product_delete');
  });
  document.getElementById('btn-product-edit')?.addEventListener('click', () => {
    adminState.productSearchQuery   = '';
    adminState.productSearchResults = [];
    adminGoto('product_edit_search');
  });
  document.getElementById('btn-to-parttime')?.addEventListener('click', () => adminGoto('menu_parttime'));
}

// ===========================
// Slide 2-2: アルバイトメニュー
// ===========================
function screenMenuParttime() {
  return `
    <div class="screen adm-screen">
      ${adminHeader('メニュー管理システム アルバイト用')}
      <div class="adm-menu-list">
        <button class="adm-menu-btn" id="btn-table-mgmt">テーブル管理</button>
        <button class="adm-menu-btn" id="btn-soldout">売り切れ表示</button>
        <button class="adm-menu-btn" id="btn-order">注文</button>
        <button class="adm-menu-btn" id="btn-cancel">注文キャンセル</button>
        <button class="adm-menu-btn" id="btn-offer">提供済み変更</button>
        <button class="adm-menu-btn" id="btn-overview">オーダー一覧</button>
      </div>
    </div>
  `;
}

function attachMenuParttimeEvents() {
  document.getElementById('btn-settings')?.addEventListener('click', () => adminGoto('logout_confirm'));
  document.getElementById('btn-bell')?.addEventListener('click', () => loadAndGotoStaffCall());
  document.getElementById('btn-table-mgmt')?.addEventListener('click', () => adminGoto('table_mgmt'));
  document.getElementById('btn-soldout')?.addEventListener('click', () => {
    adminState.productSearchQuery   = '';
    adminState.productSearchResults = [];
    adminState.selectedProducts     = [];
    adminGoto('soldout_search');
  });
  document.getElementById('btn-order')?.addEventListener('click', () => adminGoto('order_scan'));
  document.getElementById('btn-cancel')?.addEventListener('click', () => {
    adminState.cancelTableNo = '';
    adminGoto('cancel_search');
  });
  document.getElementById('btn-offer')?.addEventListener('click', () => {
    adminState.offerTableNo = '';
    adminGoto('offer_search');
  });
  document.getElementById('btn-overview')?.addEventListener('click', async () => {
    const res = await ApiOrder.getActive(adminState.storeId);
    if (!res.ok) { showApiError('注文一覧の取得に失敗しました'); return; }
    adminState.orderList = res.data || [];
    adminGoto('order_overview');
  });
}

// ===========================
// Slide 2-3: ログアウト確認
// ===========================
function screenLogoutConfirm() {
  return `
    <div class="screen adm-screen">
      ${adminHeader('メニュー管理システム')}
      <div class="adm-modal-wrap" style="flex:1;align-items:center">
        <div class="adm-modal">
          <div class="adm-modal-msg">ログアウトしますか？</div>
          <div class="adm-modal-btns">
            <button class="adm-btn-secondary" id="btn-logout-no">いいえ</button>
            <button class="adm-btn-primary" id="btn-logout-yes">はい</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function attachLogoutConfirmEvents() {
  document.getElementById('btn-logout-no')?.addEventListener('click', () => {
    adminGoto(adminState.role === 'staff' ? 'menu_staff' : 'menu_parttime');
  });
  document.getElementById('btn-logout-yes')?.addEventListener('click', () => {
    Auth.removeToken();
    adminState.role   = null;
    adminState.userId = '';
    adminScreenHistory.length = 0;
    adminGoto('login');
  });
}

// ===========================
// 店員呼び出し画面への遷移（API取得付き）
// ===========================
async function loadAndGotoStaffCall() {
  const res = await ApiCall.getAll(adminState.storeId);
  if (!res.ok) { showApiError('呼び出し一覧の取得に失敗しました'); return; }
  adminState.callList = res.data || [];
  adminGoto('staff_call');
}
