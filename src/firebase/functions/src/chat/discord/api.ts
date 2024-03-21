import { onRequest, Request } from 'firebase-functions/v2/https';
import { parsePostData } from '../../common/request';
import * as logger from '../../common/logger';
import { InteractionResponseType, InteractionType, verifyKey } from 'discord-interactions';
import discordCredentials = require('../../../../../credentials/discord.json');
import { OptionsModel, RequestModel } from './models/request-model';

export const interactionsEndpoint = onRequest(async (request, response) => {
  if (!authorize(request)) {
    response.status(401).send('Bad request signature');
    throw new Error('Bad request signature');
  }

  const data: RequestModel = parsePostData(request);
  logger.log("DATA");
  logger.log(data);

  if (data.type == InteractionType.PING) {
    response.send({ type: InteractionResponseType.PONG });
    return;
  }

  if (data.type == InteractionType.APPLICATION_COMMAND) {
    if (data.data.name == 'car') {
      logger.log("OPTIONS");
      logger.log(data.data.options);

      const details = getDetailsFromOptions(data.data.options);

      if(details == undefined) {
        response.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `There was an issue while processing your command. Please try again.`
          }
        });
  
        return;
      }

      response.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `User input: ${details}`
        }
      });

      return;
    }
  }
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
    logger.error(e);

    return undefined;
  }
} 
