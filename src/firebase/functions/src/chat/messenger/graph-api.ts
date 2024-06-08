import * as logger from '../../common/logger';
import { sendHttpsRequest } from '../../common/https';

import messengerCredentials = require('../../../../../credentials/messenger.json');

const MESSAGE_MAX_LENGHT = 2000;

export async function sendMessage(senderId: string, message: string) {
  if(message.length > MESSAGE_MAX_LENGHT) {
    message = message.substring(0, MESSAGE_MAX_LENGHT);
  }

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

export async function sendGetStartedMessage(senderId: string) {
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
      'attachment': {
        'type': 'template',
        'payload': {
          'template_type': 'button',
          'text': 'Hi there! This is Vogadu, an AI powered bot that can answer all your questions about cars. How can we help you today?\n\nHere are a few options to help you get started. Feel free to try one of these or ask anything else you want to know about cars! 🚗💬',
          'buttons': [
            {
              'title': 'Choosing my next car',
              'type': 'postback',
              'payload': 'I want to buy a car, help me choose the best one for me by asking me three questions.'
            },
            {
              'title': 'Get details about a car',
              'type': 'postback',
              'payload': 'I am buying a car and I want to know about possible issues I may have with it.'
            },
            {
              'title': 'What is a fuel pump?',
              'type': 'postback',
              'payload': 'What is a fuel pump?'
            }
          ]
        }
      }
    }
  };

  try {
    await sendHttpsRequest(options, data);
  } catch (e) {
    logger.error(['SendGetStartedMessage error: ', e]);
  }
}

export async function sendHumanMessage(senderId: string, personaId: string, message: string) {
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
    'persona_id': personaId,
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

export async function sendContactConvertionsApiEvent(senderId: string) {
  const options = {
    hostname: 'graph.facebook.com',
    path: `/v19.0/${messengerCredentials.datasetId}/events?access_token=${messengerCredentials.convertionsApiAccessToken}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  };

  const timestamp = Math.floor(Date.now() / 1000);

  const data = {
    'data': [
      {
        'event_name': 'Contact',
        'event_time': timestamp,
        'action_source': 'website',
        'user_data': {
          'page_id': messengerCredentials.pageId,
          'page_scoped_user_id': senderId,
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