import { app } from './firebase-init.js'
import { getAnalytics, logEvent } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js'

const analytics = getAnalytics(app);

// Index
export function logStartButtonClickEvent(buttonId) {
  const START_BUTTON_CLICK_EVENT = 'start_button_click';

  logEvent(analytics, START_BUTTON_CLICK_EVENT, { buttonId: buttonId });
  fbq('trackCustom', START_BUTTON_CLICK_EVENT, { buttonId: buttonId });
}

export function logReadMoreButtonClickEvent() {
  const READ_MORE_BUTTON_CLICK_EVENT = 'read_more_button_click';
  
  logEvent(analytics, READ_MORE_BUTTON_CLICK_EVENT);
  fbq('trackCustom', READ_MORE_BUTTON_CLICK_EVENT);
}
