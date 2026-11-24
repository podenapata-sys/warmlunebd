/* Firebase settings for customer accounts (login / registration).
 *
 * Paste the "firebaseConfig" object from:
 *   Firebase console → Project settings → General → Your apps → Web app → SDK setup and configuration → Config
 *
 * These values are not secret: every website that uses Firebase sends them to the browser.
 * What protects the data is firestore.rules (customers can only read their own profile;
 * only accounts listed in the "admins" collection can see the customer list).
 *
 * While this is null, the account page shows "Accounts are being set up" and nothing breaks.
 */
window.FIREBASE_CONFIG = null;
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
