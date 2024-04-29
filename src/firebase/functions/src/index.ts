import { initializeApp } from 'firebase-admin/app';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import * as logger from './common/logger';
import { sendPingRequest } from './common/ping';

// Initialiaze Firebase
initializeApp();

// Ping request
export const ping = onSchedule('every 15 minutes', async (_) => {
  logger.log('Ping');

  const urls = [
    'discordchat-interactionsendpoint-b2fgjymb5a-uc.a.run.app',
    'messengerchat-callback-b2fgjymb5a-uc.a.run.app'
  ];

  for(const url of urls) {
    await sendPingRequest(url);
  }
});

// APIs
exports.llm = require('./llm/api');
exports.discordChat = require('./chat/discord/api');
exports.messengerChat = require('./chat/messenger/api');