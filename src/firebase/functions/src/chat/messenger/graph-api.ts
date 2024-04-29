import * as logger from '../../common/logger';
import { sendHttpsRequest } from '../../common/https';

import messengerCredentials = require('../../../../../credentials/messenger.json');
import { number } from 'zod';

export async function sendMessage(senderId: string, message: string) {
  const options = {
    hostname: 'graph.facebook.com',
    path: `/v2.6/me/messages?access_token=${messengerCredentials.pageAccessToken}`,
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
    path: `/v2.6/me/messages?access_token=${messengerCredentials.pageAccessToken}`,
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
    logger.error(['SendTypingOn error: ', e]);
  }
}

export async function sendMarkSeen(senderId: string) {
  const options = {
    hostname: 'graph.facebook.com',
    path: `/v2.6/me/messages?access_token=${messengerCredentials.pageAccessToken}`,
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
    logger.error(['SendMarkSeen error: ', e]);
  }
}



export async function sendConvertionsApiEvent(senderId: string, value: number) {
  const options = {
    hostname: 'graph.facebook.com',
    path: `/v19.0/${messengerCredentials.datasetId}/events?access_token=${messengerCredentials.convertionsApiAccessToken}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  };

  const data = {
    'data': [
      {
        'event_name': 'Purchase',
        'event_time': Date.now(),
        'action_source': 'business_messaging',
        'messaging_channel': 'messenger',
        'user_data': {
          'page_id': messengerCredentials.pageId,
          'page_scoped_user_id': senderId,
        },
        'custom_data': {
          'currency': 'USD',
          'value': number
        }
      }
    ]
  };

  try {
    await sendHttpsRequest(options, data);
  } catch (e) {
    logger.error(['SendConvertionsApiEvent error: ', e]);
  }
}