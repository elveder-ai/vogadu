import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = require("../../../firebase/key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

//process.env['FIRESTORE_EMULATOR_HOST'] = '127.0.0.1:5002';
const db = getFirestore();

export async function addToCollection(collection: string, data: any) {
    await db.collection(collection).doc().set(data);
}