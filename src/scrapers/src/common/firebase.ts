import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import firebaseCredentials from "../../../credentials/firebase.json";

admin.initializeApp({
  credential: admin.credential.cert(firebaseCredentials as any),
});

//process.env['FIRESTORE_EMULATOR_HOST'] = '127.0.0.1:5002';
const db = getFirestore();

export async function addToCollection(collection: string, data: any) {
    await db.collection(collection).doc().set(data);
}