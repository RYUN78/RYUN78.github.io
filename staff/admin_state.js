// ===========================
// 管理側 共有状態
// ===========================
const adminState = {
  screen: 'login',
  role: null,           // 'staff' | 'parttime'
  userId: '',

  // 商品管理
  productSearchQuery: '',
  productSearchCategory: '',
  productSearchResults: [],
  selectedProducts: [],
  editTarget: null,
  editAfter: '',
  pendingProduct: null,

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
  orderCustomerId: null,
  selectedOrders: [],
  orderList: [],

  storeId: 'AA',
};

// ===========================
// モックDB（バックエンドなし）
// ===========================
const MOCK_USERS = [
  { id: 'staff01', password: 'pass01', role: 'staff'    },
  { id: 'part01',  password: 'pass01', role: 'parttime' },
  { id: 'admin',   password: 'admin',  role: 'staff'    },
];

const mockProducts = [
  { id: 1,  name: 'かわ',              category: '焼鳥（塩）',  price: 350, soldOut: false },
  { id: 2,  name: 'もも',              category: '焼鳥（たれ）', price: 320, soldOut: false },
  { id: 3,  name: 'ポテトサラダ',      category: '一品',         price: 380, soldOut: false },
  { id: 4,  name: 'キャベツの塩だれ',  category: '一品',         price: 280, soldOut: false },
  { id: 5,  name: 'きゅうりの一本漬け',category: '一品',         price: 280, soldOut: false },
  { id: 6,  name: 'だし巻き',          category: '一品',         price: 420, soldOut: false },
  { id: 7,  name: '鶏の唐揚げ',        category: '一品',         price: 550, soldOut: false },
  { id: 8,  name: 'タコのから揚げ',    category: '一品',         price: 480, soldOut: false },
  { id: 9,  name: 'フライドポテト',    category: '一品',         price: 350, soldOut: true  },
];

const mockOrders = {
  '6': [
    { id: 1, name: 'フライドポテト',    orderQty: 1, offerQty: 1, soldOut: true  },
    { id: 2, name: 'ポテトサラダ',      orderQty: 2, offerQty: 0, soldOut: false },
    { id: 3, name: 'キャベツの塩だれ',  orderQty: 1, offerQty: 0, soldOut: false },
    { id: 4, name: 'きゅうりの一本漬け',orderQty: 1, offerQty: 0, soldOut: false },
    { id: 5, name: 'だし巻き',          orderQty: 1, offerQty: 0, soldOut: false },
    { id: 6, name: '鶏の唐揚げ',        orderQty: 1, offerQty: 1, soldOut: true  },
    { id: 7, name: 'タコのから揚げ',    orderQty: 1, offerQty: 0, soldOut: false },
  ],
  '1': [
    { id: 2, name: 'ポテトサラダ',      orderQty: 1, offerQty: 1, soldOut: false },
    { id: 3, name: 'きゅうりの一本漬け',orderQty: 1, offerQty: 0, soldOut: false },
  ],
};

const mockCalls = [
  { callId: 1, tableNo: '3',  calledAt: '19:42' },
  { callId: 2, tableNo: '7',  calledAt: '19:55' },
  { callId: 3, tableNo: '12', calledAt: '20:03' },
];

// 顧客台帳モック
const mockCustomers = [];
let mockCustomerSeq = 1;

function mockGenCustomerId() {
  const jst  = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const date = jst.toISOString().slice(0, 10).replace(/-/g, '');
  const seq  = String(mockCustomerSeq++).padStart(3, '0');
  return `${date}-${seq}`;
}

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
    case 'customer_ledger':          app.innerHTML = screenCustomerLedger();         break;
    default:                         app.innerHTML = screenLogin();
  }
  adminAttachEvents();
}

