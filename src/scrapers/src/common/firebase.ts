import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import firebaseCredentials from '../../../credentials/firebase.json';

admin.initializeApp({
  credential: admin.credential.cert(firebaseCredentials as any),
});

// Used to connect to the Firestore Emulator
//process.env['FIRESTORE_EMULATOR_HOST'] = '127.0.0.1:5002';
const db = getFirestore();

const storage = getStorage();

export async function addToCollection(collection: string, data: any) {
  await db.collection(collection).doc().set(data);
}

export async function uploadFileToStorage<T>(bucketFilePath: string, data: T) {
  const file = storage.bucket(firebaseCredentials.cloudStorageBucket).file(bucketFilePath, { })

  const dataJson = JSON.stringify(data);
  const buffer = Buffer.from(dataJson, 'utf-8');

  try {
    await file.save(buffer);

    console.log(`UPLOADED FILE: ${bucketFilePath}`);
  } catch(e) {
    console.error('ERROR UPLOADING FILE TO STORAGE', e);
  }
}

export function getFile(filePath: string) {
  const file = storage.bucket(firebaseCredentials.cloudStorageBucket).file(filePath);

  return file;
}

export async function getFilesInDirectory(directoryPath: string) {
  const files = await storage.bucket(firebaseCredentials.cloudStorageBucket).getFiles({
		prefix: directoryPath
	});
	const [filesAsArray] = files;

  return filesAsArray;
}

export async function deleteFile(filePath: string) {
  await storage.bucket(firebaseCredentials.cloudStorageBucket).file(filePath).delete();
}

export async function deleteDirectoryFromStorage(directoryPath: string | undefined) {
  if(directoryPath == undefined) {
    await storage.bucket(firebaseCredentials.cloudStorageBucket).deleteFiles();
  } else {
    await storage.bucket(firebaseCredentials.cloudStorageBucket).deleteFiles({
      prefix: directoryPath
    });
  }
}