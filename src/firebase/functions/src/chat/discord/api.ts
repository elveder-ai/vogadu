import { onRequest, Request } from 'firebase-functions/v2/https';
import { parsePostData } from '../../common/request';
import * as logger from '../../common/logger';
import { InteractionResponseType, InteractionType, verifyKey } from 'discord-interactions';
import { OptionsModel, RequestModel } from './models/request-model';
import { onMessagePublished } from 'firebase-functions/v2/pubsub';
import { PubSubMessageModel } from './models/pub-sub-message-model';
import { REST, Routes } from 'discord.js';
import { getCarDetails } from '../../llm/get-car-details';
import { getSubData, sendPubRequest } from '../../common/pub-sub';
import { PING_REQUEST_HEADER_KEY, PING_REQUEST_HEADER_VALUE } from '../../common/ping';

import discordCredentials = require('../../../../../credentials/discord.json');

const DISCORD_PUB_SUB_TOPIC = 'DISCORD';

const DISCORD_MESSAGE_MAX_LENGTH = 2000;

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
        let userId: string = '';

        if(data.user) {
          userId = data.user.id;
        } else if(data.member) {
          userId = data.member.user.id;
        }

        const pubSubMessage = new PubSubMessageModel(input!, data.token, userId);
        await sendPubRequest(DISCORD_PUB_SUB_TOPIC, pubSubMessage);

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
  let data: PubSubMessageModel;

  try {
    data = getSubData(event);
  } catch(e) {
    logger.error(['ProcessUserInput error: ', e]);
    return;
  }

  logger.log('ProcessUserInput: DATA');
  logger.log(data);

  const carDetails = await getCarDetails(data.input, DISCORD_MESSAGE_MAX_LENGTH);

  let result = `<@${data.userId}>\n**${data.input}**\n\n${carDetails} `;

  if(result.length > DISCORD_MESSAGE_MAX_LENGTH) {
    result = result.substring(0, DISCORD_MESSAGE_MAX_LENGTH);
  }

  const rest = new REST({ version: '10' }).setToken(discordCredentials.token);

  const reponse = {
    content: result
  }
  
  await rest.patch(Routes.webhookMessage(discordCredentials.applicationId, data.token), { body: reponse });

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
