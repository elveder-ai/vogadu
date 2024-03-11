const admin  = require('firebase-admin');
const { getFirestore, connectFirestoreEmulator } = require('irebase-admin/firestore')

const serviceAccount = require("./key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = getFirestore();
connectFirestoreEmulator(db, '127.0.0.1', 8080);

(async () => {

    

})();