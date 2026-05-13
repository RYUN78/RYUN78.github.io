// ===========================
// 管理側 共有状態
// ===========================
const adminState = {
  screen: 'login',
  role: null,
  userId: '',
  storeId: 'AA',

  // 商品管理
  productSearchQuery: '',
  productSearchResults: [],
  selectedProducts: [],
  editTarget: null,
  pendingProduct: null,
  editAfter: '',

  // テーブル管理
  tableNo: '',
  tableNoAfter: '',
  qrTableNo: '',
  generatedQR: null,

  // 注文操作
  orderTableNo: '',
  orderNomihoudai: '',
  cancelTableNo: '',
  offerTableNo: '',
  selectedOrders: [],
  orderList: [],

  // 店員呼び出し
  callList: [],
};

// ===========================
// 画面履歴スタック
// ===========================
const adminScreenHistory = [];
const ADMIN_NO_BACK_SCREENS = new Set(['login']);

function adminGoto(screen) {
  if (
    adminState.screen &&
    !ADMIN_NO_BACK_SCREENS.has(adminState.screen) &&
    adminState.screen !== screen
  ) {
    adminScreenHistory.push(adminState.screen);
  }
  adminState.screen = screen;
  adminRender();
}

function adminGoBack() {
  if (adminScreenHistory.length === 0) return;
  adminState.screen = adminScreenHistory.pop();
  adminRender();
}

function adminCanGoBack() {
  return adminScreenHistory.length > 0;
}

// ===========================
// メインレンダラー
// ===========================
function adminRender() {
  const app = document.getElementById('app');
  switch (adminState.screen) {
    case 'login':                    app.innerHTML = screenLogin();                  break;
    case 'menu_staff':               app.innerHTML = screenMenuStaff();              break;
    case 'menu_parttime':            app.innerHTML = screenMenuParttime();           break;
    case 'logout_confirm':           app.innerHTML = screenLogoutConfirm();          break;
    case 'product_add':              app.innerHTML = screenProductAdd();             break;
    case 'product_add_confirm':      app.innerHTML = screenProductAddConfirm();      break;
    case 'product_delete':           app.innerHTML = screenProductDelete();          break;
    case 'product_delete_confirm':   app.innerHTML = screenProductDeleteConfirm();   break;
    case 'product_edit_search':      app.innerHTML = screenProductEditSearch();      break;
    case 'product_edit_form':        app.innerHTML = screenProductEditForm();        break;
    case 'product_edit_confirm':     app.innerHTML = screenProductEditConfirm();     break;
    case 'table_mgmt':               app.innerHTML = screenTableMgmt();              break;
    case 'table_qr_confirm':         app.innerHTML = screenTableQrConfirm();         break;
    case 'table_qr_display':         app.innerHTML = screenTableQrDisplay();         break;
    case 'table_no_change':          app.innerHTML = screenTableNoChange();          break;
    case 'table_no_change_confirm':  app.innerHTML = screenTableNoChangeConfirm();   break;
    case 'table_reissue':            app.innerHTML = screenTableReissue();           break;
    case 'table_reissue_confirm':    app.innerHTML = screenTableReissueConfirm();    break;
    case 'soldout_search':           app.innerHTML = screenSoldoutSearch();          break;
    case 'soldout_confirm':          app.innerHTML = screenSoldoutConfirm();         break;
    case 'order_scan':               app.innerHTML = screenOrderScan();              break;
    case 'order_form':               app.innerHTML = screenOrderForm();              break;
    case 'order_form_confirm':       app.innerHTML = screenOrderFormConfirm();       break;
    case 'cancel_search':            app.innerHTML = screenCancelSearch();           break;
    case 'cancel_list':              app.innerHTML = screenCancelList();             break;
    case 'cancel_confirm':           app.innerHTML = screenCancelConfirm();          break;
    case 'offer_search':             app.innerHTML = screenOfferSearch();            break;
    case 'offer_list':               app.innerHTML = screenOfferList();              break;
    case 'offer_confirm':            app.innerHTML = screenOfferConfirm();           break;
    case 'order_overview':           app.innerHTML = screenOrderOverview();          break;
    case 'staff_call':               app.innerHTML = screenStaffCall();              break;
    default:                         app.innerHTML = screenLogin();
  }
  adminAttachEvents();
  updateAdminBackBtn();
}

function updateAdminBackBtn() {
  const btn = document.getElementById('global-back-btn');
  if (!btn) return;
  btn.style.display = adminCanGoBack() ? 'flex' : 'none';
}
