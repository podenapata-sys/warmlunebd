/* Firebase settings for customer accounts (login / registration).
 *
 * Paste the "firebaseConfig" object from:
 *   Firebase console → Project settings → General → Your apps → Web app → SDK setup and configuration → Config
 *
 * These values are not secret: every website that uses Firebase sends them to the browser.
 * What protects the data is firestore.rules (customers can only read their own profile;
 * only accounts listed in the "admins" collection can see the customer list).
 *
 * Set to null to switch accounts off (the account page then shows "Accounts are being set up").
 */
window.FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBcjJY5BqU7u8rmkJ3_SvCq2G-ABap9dw4',
  authDomain: 'bakaina-com.firebaseapp.com',
  projectId: 'bakaina-com',
  storageBucket: 'bakaina-com.firebasestorage.app',
  messagingSenderId: '521138376705',
  appId: '1:521138376705:web:b284e876ba904a2e2b3000',
};
/* Example (replace with your own):
window.FIREBASE_CONFIG = {
  apiKey: 'AIza...',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project',
  storageBucket: 'your-project.appspot.com',
  messagingSenderId: '1234567890',
  appId: '1:1234567890:web:abc123'
};
*/
