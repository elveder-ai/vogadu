import { onRequest, Request } from 'firebase-functions/v2/https';
import * as logger from '../../common/logger';
import { parseGetParameters, parsePostData } from '../../common/request';
import crypto from 'crypto';
import { RequestModel } from './models/request-model';
import { sendGetStartedMessage, sendMarkSeen, sendMessage, sendTypingOn } from './graph-api';
import { PING_REQUEST_HEADER_KEY, PING_REQUEST_HEADER_VALUE } from '../../common/ping';
import { onMessagePublished } from 'firebase-functions/v2/pubsub';
import { getSubData, sendPubRequest } from '../../common/pub-sub';
import { PubSubMessageModel } from './models/pub-sub-message-model';
import { processMessage } from '../../llm/process-message';
import { addUser, getUser, deleteUser } from '../../storage/users';
import { UserModel } from '../../storage/models/user-model';
import { addMessage, deleteMessagesByUser } from '../../storage/messages';
import { MessageModel } from '../../storage/models/message-model';

import messengerCredentials = require('../../../../../credentials/messenger.json');

const MESSENGER_PUB_SUB_TOPIC = 'MESSENGER';

export const callback = onRequest(async (request, response) => {
  // Ping
  if(request.get(PING_REQUEST_HEADER_KEY) == PING_REQUEST_HEADER_VALUE) {
    logger.log('Ping');

    response.send(true);
    return;
  }

  // Verification Request
  try {
    const parameters = parseGetParameters(request);

    logger.log('Callback: PARAMETERS');
    logger.log(parameters);

    const mode = parameters['hub.mode'];
    const token = parameters['hub.verify_token'];
    const result = parameters['hub.challenge'];

    if (mode == 'subscribe' && token == messengerCredentials.verifyToken) {
      response.send(result);
    } else {
      response.status(403).send('Authorization error');
    }

    return;
  } catch { }

  if(!verifyRequestSignature(request)) {
    throw new Error('Request Signature verification error!');
  }

  // Event Notifications
  const data: RequestModel = parsePostData(request);
  logger.log(JSON.stringify(data));

  if(data.object != 'page') {
    response.status(404).send('Event not from a page subscription');
    return;
  }
  
  const senderId = data.entry[0].messaging[0].sender.id;

  await sendMarkSeen(senderId);
  await sendTypingOn(senderId);

  const user = await getUser(senderId);

  if(user == undefined) {
    await addUser(new UserModel(
      senderId,
      false
    ));
  } else if(user.humanInteraction == true) {
    logger.log('HUMAN_INTERACTION');

    response.send(true);
    return;
  }

  if(data.entry[0].messaging[0].message != undefined) {
    if(data.entry[0].messaging[0].message.commands != undefined) {
      await deleteMessagesByUser(senderId);
      await deleteUser(senderId);

      await sendMessage(senderId, 'We have deleted all the data we have collected from you.');
    } else {
      if(user == undefined) {
        await sendInitialMessages(senderId);
      }

      const input = data.entry[0].messaging[0].message.text;

      if(input == 'Get started!') {
        await sendGetStartedMessage(senderId);
      } else {
        await sendTypingOn(senderId);

        const pubSubMessage = new PubSubMessageModel(senderId, getSessionId(), input);
        await sendPubRequest(MESSENGER_PUB_SUB_TOPIC, pubSubMessage);
      }
    }
  } else if(data.entry[0].messaging[0].postback != undefined) {
    if(data.entry[0].messaging[0].postback.payload == 'get_started') {
      await sendInitialMessages(senderId);
      await sendGetStartedMessage(senderId);
    } else {
      if(user == undefined) {
        await sendInitialMessages(senderId);
        await sendTypingOn(senderId);
      }

      const input = data.entry[0].messaging[0].postback.payload;
      const pubSubMessage = new PubSubMessageModel(senderId, getSessionId(), input);
      await sendPubRequest(MESSENGER_PUB_SUB_TOPIC, pubSubMessage);
    }
  }

  response.send(true);
});

async function sendInitialMessages(senderId: string) {
  await sendMessage(senderId, 'Just a heads up, while we strive to provide accurate and up-to-date information, there can be mistakes. Please consider consulting a professional for critical issues or decisions.');
  await sendMessage(senderId, 'Also, please send your messages one at a time, so we can provide you the most accurate and detailed response for each of your questions.')
}

export const processUserInput = onMessagePublished(MESSENGER_PUB_SUB_TOPIC, async (event) => {
  let data: PubSubMessageModel;

  try {
    data = getSubData(event);
  } catch(e) {
    logger.error(['ProcessUserInput error: ', e]);
    return;
  }

  logger.log('ProcessUserInput: DATA');
  logger.log(data);

  const response = await processMessage(data.senderId, data.sessionId, data.input);

  await sendMessage(data.senderId, response);

  await addMessage(new MessageModel(
    data.senderId,
    data.sessionId,
    new Date(),
    data.input,
    response
  ));

  return;
});

function verifyRequestSignature(request: Request): boolean {
  var signature = request.get('x-hub-signature-256');

  if (!signature) {
    throw new Error('The \'x-hub-signature-256\' header not found!');
  }

  var elements = signature.split('=');
  var signatureHash = elements[1];

  var expectedHash = crypto
    .createHmac('sha256', messengerCredentials.appSecret)
    .update(request.rawBody)
    .digest('hex');

  return signatureHash == expectedHash;
}

function getSessionId(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}