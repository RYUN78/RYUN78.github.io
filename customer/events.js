// ===========================
// イベント振り分け
// render() の後に呼ばれ、現在の画面に応じた
// attach関数を呼び出す
// ===========================
function attachEvents() {
  switch (state.screen) {
    case 'checkin':          attachCheckinEvents();         break;
    case 'menu':             attachMenuEvents();            break;
    case 'qty_select':       attachQtyEvents();
                             attachMenuEvents();            break;
    case 'item_added':       attachMenuEvents();            break;
    case 'cart':             attachCartEvents();
                             attachMenuEvents();            break;
    case 'order_confirmed':  attachMenuEvents();            break;
    case 'history':          attachHistoryEvents();         break;
    case 'call_checkout':    attachCallCheckoutEvents();    break;
    case 'calling':          attachCallingEvents();         break;
    case 'checkout_confirm': attachCheckoutConfirmEvents(); break;
    case 'error':            attachErrorEvents();           break;
  }
}
