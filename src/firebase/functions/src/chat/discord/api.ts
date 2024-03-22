import { onRequest, Request } from 'firebase-functions/v2/https';
import { parsePostData } from '../../common/request';
import * as logger from '../../common/logger';
import { InteractionResponseType, InteractionType, verifyKey } from 'discord-interactions';
import { OptionsModel, RequestModel } from './models/request-model';
import { onMessagePublished } from 'firebase-functions/v2/pubsub';
import { PubSub } from '@google-cloud/pubsub';
import { PubSubMessageModel } from './models/pub-sub-message-model';
import { REST, Routes } from 'discord.js';
import { getCarDetails } from '../../llm/get-car-details';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import * as https from 'https';

import discordCredentials = require('../../../../../credentials/discord.json');

const DISCORD_PUB_SUB_TOPIC = 'DISCORD';

const PING_REQUEST_HEADER_KEY = 'X-Ping-Request';
const PING_REQUEST_HEADER_VALUE = 'true';

const pubSubClient = new PubSub();

export const interactionsEndpoint = onRequest(async (request, response) => {
  if(request.get(PING_REQUEST_HEADER_KEY) == PING_REQUEST_HEADER_VALUE) {
    logger.log('Ping');

    response.send(true);
    return;
  }

  if (!authorize(request)) {
    response.status(401).send('Bad request signature');
    throw new Error('Bad request signature');
  }

  const data: RequestModel = parsePostData(request);
  logger.log('InteractionsEndpoint: DATA');
  logger.log(data);

  if (data.type == InteractionType.PING) {
    response.send({ type: InteractionResponseType.PONG });
    return;
  }

  if (data.type == InteractionType.APPLICATION_COMMAND) {
    if (data.data.name == 'car') {
      logger.log('InteractionsEndpoint: OPTIONS');
      logger.log(data.data.options);

      const input = getDetailsFromOptions(data.data.options);

      if(input == undefined) {
        response.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `There was an issue while processing your command. Please try again.`
          }
        });
        return;
      }

      try {
        const pubSubMessage = new PubSubMessageModel(input!, data.token);
        const pubSubMessageJson = JSON.stringify(pubSubMessage);
        const buffer = Buffer.from(pubSubMessageJson);

        await pubSubClient.topic(DISCORD_PUB_SUB_TOPIC).publishMessage({
          data: buffer
        });

        response.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: '🔍 *Please wait, we are processing you request*'
          }
        });
        return;
      } catch(e: any) {
        logger.error(['Send Pub/Sub message: ', e]);

        response.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `There was an issue while processing your command. Please try again.`
          }
        });
        return;
      }
    }
  }
});

export const processUserInput = onMessagePublished(DISCORD_PUB_SUB_TOPIC, async (event) => {
  const dataJson = event.data.message.data ? Buffer.from(event.data.message.data, 'base64').toString() : undefined;

  if(dataJson == undefined) {
    logger.error(['ProcessUserInput: data in undefined']);

    return;
  }

  const data: PubSubMessageModel = JSON.parse(dataJson);

  logger.log('ProcessUserInput: DATA');
  logger.log(data);

  const carDetails = await getCarDetails(data.input, 2000);

  const rest = new REST({ version: '10' }).setToken(discordCredentials.token);

  const reponse = {
    content: carDetails
  }
  
  await rest.patch(Routes.webhookMessage(discordCredentials.applicationId, data.token), { body: reponse });

  return;
});

export const ping = onSchedule('every 10 minutes', async (_) => {
  logger.log('Ping');

  const headers = {
    [PING_REQUEST_HEADER_KEY]: PING_REQUEST_HEADER_VALUE
  };
  
  const options: https.RequestOptions = {
    hostname: 'discordchatinteractionsendpoint-b2fgjymb5a-uc.a.run.app',
    method: 'POST',
    headers: headers
  };

  const request = https.request(options, (_) => { });
  
  request.on('error', (e: Error) => {
    logger.error(['Ping: ', e]);
  });
  
  request.end();
  
  return;
});

function authorize(request: Request): boolean {
  const signature = request.get('X-Signature-Ed25519');
  const timestamp = request.get('X-Signature-Timestamp');

  return verifyKey(request.rawBody, signature as string, timestamp as string, discordCredentials.publicApiKey);
}

function getDetailsFromOptions(options: OptionsModel[]): string | undefined {
  try {
    return options[0].name == 'details' ? options[0].value : undefined
  } catch(e: any) {
    logger.error(['GetDetailsFromOptions: ', e]);

    return undefined;
  }
}
