// ===========================
// イベント振り分け
// ===========================
function adminAttachEvents() {
  switch (adminState.screen) {
    case 'login':                    attachLoginEvents();                break;
    case 'menu_staff':               attachMenuStaffEvents();            break;
    case 'menu_parttime':            attachMenuParttimeEvents();         break;
    case 'logout_confirm':           attachLogoutConfirmEvents();        break;
    case 'product_add':              attachProductAddEvents();           break;
    case 'product_add_confirm':      attachProductAddConfirmEvents();    break;
    case 'product_delete':           attachProductDeleteEvents();        break;
    case 'product_delete_confirm':   attachProductDeleteConfirmEvents(); break;
    case 'product_edit_search':      attachProductEditSearchEvents();    break;
    case 'product_edit_form':        attachProductEditFormEvents();      break;
    case 'product_edit_confirm':     attachProductEditConfirmEvents();   break;
    case 'table_mgmt':               attachTableMgmtEvents();            break;
    case 'table_qr_confirm':         attachTableQrConfirmEvents();       break;
    case 'table_qr_display':         attachTableQrDisplayEvents();       break;
    case 'table_no_change':          attachTableNoChangeEvents();        break;
    case 'table_no_change_confirm':  attachTableNoChangeConfirmEvents(); break;
    case 'table_reissue':            attachTableReissueEvents();         break;
    case 'table_reissue_confirm':    attachTableReissueConfirmEvents();  break;
    case 'soldout_search':           attachSoldoutSearchEvents();        break;
    case 'soldout_confirm':          attachSoldoutConfirmEvents();       break;
    case 'order_scan':               attachOrderScanEvents();            break;
    case 'order_form':               attachOrderFormEvents();            break;
    case 'order_form_confirm':       attachOrderFormConfirmEvents();     break;
    case 'cancel_search':            attachCancelSearchEvents();         break;
    case 'cancel_list':              attachCancelListEvents();           break;
    case 'cancel_confirm':           attachCancelConfirmEvents();        break;
    case 'offer_search':             attachOfferSearchEvents();          break;
    case 'offer_list':               attachOfferListEvents();            break;
    case 'offer_confirm':            attachOfferConfirmEvents();         break;
    case 'order_overview':           attachOrderOverviewEvents();        break;
    case 'staff_call':               attachStaffCallEvents();            break;
    case 'customer_ledger':          attachCustomerLedgerEvents();       break;
  }

  // 🔔 ベルは全画面共通
  document.getElementById('btn-bell')?.addEventListener('click', () => adminGoto('staff_call'));
}
