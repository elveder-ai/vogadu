import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js'
import { getAnalytics, logEvent } from 'https://www.gstatic.com/firebasejs/10.11.0/firebase-analytics.js'

const firebaseConfig = {
  apiKey: "AIzaSyBp_nKItv6ebJZjUFphUQfhJENlTxJSV-A",
  authDomain: "vogadu-c03b9.firebaseapp.com",
  projectId: "vogadu-c03b9",
  storageBucket: "vogadu-c03b9.appspot.com",
  messagingSenderId: "30918377672",
  appId: "1:30918377672:web:b728cf080d34519140e5fd",
  measurementId: "G-C9MMJYPBND"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Index
export function logStartButtonClickEvent(buttonId) {
  logEvent(analytics, 'start_button_click', { buttonId: buttonId });
}