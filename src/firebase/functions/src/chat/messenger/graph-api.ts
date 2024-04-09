import * as logger from '../../common/logger';
import { sendHttpsRequest } from '../../common/https';

import messengerCredentials = require('../../../../../credentials/messenger.json');

export async function sendMessage(senderId: string, message: string) {
  const options = {
    hostname: 'graph.facebook.com',
    path: '/v2.6/me/messages?access_token=' + messengerCredentials.pageAccessToken,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  };

  const data = {
    'recipient': {
      'id': senderId
    },
    'message': {
      'text': message
    }
  };

  try {
    await sendHttpsRequest(options, data);
  } catch (e) {
    logger.error(['SendMessage error: ', e]);
  }
}

export async function sendTypingOn(senderId: string) {
  const options = {
    hostname: 'graph.facebook.com',
    path: '/v2.6/me/messages?access_token=' + messengerCredentials.pageAccessToken,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  };

  const data = {
    'recipient': {
      'id': senderId
    },
    'sender_action': 'typing_on',
  };

  try {
    await sendHttpsRequest(options, data);
  } catch (e) {
    logger.error(['SendMessage error: ', e]);
  }
}

export async function sendMarkSeen(senderId: string) {
  const options = {
    hostname: 'graph.facebook.com',
    path: '/v2.6/me/messages?access_token=' + messengerCredentials.pageAccessToken,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  };

  const data = {
    'recipient': {
      'id': senderId
    },
    'sender_action': 'mark_seen',
  };

  try {
    await sendHttpsRequest(options, data);
  } catch (e) {
    logger.error(['SendMessage error: ', e]);
  }
}