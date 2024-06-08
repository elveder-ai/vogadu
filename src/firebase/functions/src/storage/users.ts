import { getFirestore } from 'firebase-admin/firestore';
import { UserModel } from './models/user-model';

const db = getFirestore();

const USERS_COLLECTION = 'users';

export async function addUser(user: UserModel) {
  await db.collection(USERS_COLLECTION).doc(user.id).set(user.toFirestore());
}

export async function getUser(userId: string): Promise<UserModel | undefined> {
  const userRef = db.collection(USERS_COLLECTION).doc(userId);
  const user = await userRef.get();
  
  if(user.exists) {
    return user.data() as UserModel;
  } else {
    return undefined;
  }
}

export async function deleteUser(userId: string) {
  await db.collection(USERS_COLLECTION).doc(userId).delete();
}

export async function setHumanInteraction(userId: string) {
  const userRef = db.collection(USERS_COLLECTION).doc(userId);

  await userRef.update({ humanInteraction: true });
}