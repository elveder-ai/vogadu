import { onRequest, Request } from 'firebase-functions/v2/https';
import { parsePostData } from '../../common/request';
import * as logger from '../../common/logger';
import { InteractionResponseType, InteractionType, verifyKey } from 'discord-interactions';
import discordCredentials = require('../../../../../credentials/discord.json');

export const interactionsEndpoint = onRequest(async (request, response) => {
    if(!authorize(request)) {
        response.status(401).send('Bad request signature');
        throw new Error('Bad request signature');
    }

    const data = parsePostData(request);
    logger.log(data);

    if(data.type == InteractionType.PING) {
        response.send({ type: InteractionResponseType.PONG });
        return;
    }

    response.send(true);
    return;
});

function authorize(request: Request): boolean {
    const signature = request.get('X-Signature-Ed25519');
    const timestamp = request.get('X-Signature-Timestamp');

    return verifyKey(request.rawBody, signature as string, timestamp as string, discordCredentials.publicApiKey);
}