import { onRequest, Request } from 'firebase-functions/v2/https';
import * as logger from '../../common/logger';
import { parseGetParameters, parsePostData } from '../../common/request';
import crypto from 'crypto';
import { RequestModel } from './models/request-model';
import { sendMarkSeen, sendMessage, sendTypingOn } from './graph-api';
import { PING_REQUEST_HEADER_KEY, PING_REQUEST_HEADER_VALUE } from '../../common/ping';
import { onMessagePublished } from 'firebase-functions/v2/pubsub';
import { getSubData, sendPubRequest } from '../../common/pub-sub';
import { PubSubMessageModel } from './models/pub-sub-message-model';
import { getCarDetails } from '../../llm/get-car-details';

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
    //throw new Error('Request Signature verification error!');
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

  if(data.entry[0].messaging[0].message != undefined) {
    const input = data.entry[0].messaging[0].message.text;
  
    const pubSubMessage = new PubSubMessageModel(senderId, input);
    await sendPubRequest(MESSENGER_PUB_SUB_TOPIC, pubSubMessage);
  } else if(data.entry[0].messaging[0].postback != undefined) {
    await sendMessage(senderId, 'Hi there! This is Vogadu, an AI powered bot for answering all your car related questions.');
    await sendMessage(senderId, 'Just a heads up, while we strive to provide accurate and up-to-date information, there can be mistakes. Please consider consulting a professional for critical issues or decisions.');
    await sendMessage(senderId, 'Now, what\'s on your mind?');
  }

  response.send(true);
});

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

  const carDetails = await getCarDetails(data.input, 2000);

  await sendMessage(data.senderId, carDetails);

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