import { getFirestore } from 'firebase-admin/firestore';
import { MessageModel } from './models/message-model';

const db = getFirestore();

const MESSAGES_COLLECTION = 'messages';

export async function addMessage(message: MessageModel) {
  await db.collection(MESSAGES_COLLECTION).doc().set(message.toFirestore());
}

export async function getMessagesByUser(userId: string, sessionId: string): Promise<MessageModel[]> {
  const messagesRef = db.collection(MESSAGES_COLLECTION);
  const messages = await messagesRef
                            .where(MessageModel.USER_ID_PROPERTY, '==', userId)
                            .where(MessageModel.SESSION_ID_PROPERTY, '==', sessionId)
                            .orderBy(MessageModel.TIMESTAMP_PROPERTY, 'asc')
                            .get();

  if(messages.empty) {
    return [];
  }

  return messages.docs.map(d => d.data() as MessageModel);
}

export async function deleteMessagesByUser(userId: string) {
  const messagesRef = db.collection(MESSAGES_COLLECTION);
  const messages = await messagesRef.where(MessageModel.USER_ID_PROPERTY, '==', userId).get();

  if(messages.empty) {
    return;
  }

  messages.forEach(doc => {
    doc.ref.delete();
  });
}