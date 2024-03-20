import { onRequest } from "firebase-functions/v2/https";
import { parsePostData } from "../../common/request";
import * as logger from '../../common/logger';

export const interactionsEndpoint = onRequest(async (request, response) => {
    const data = parsePostData(request);
    logger.log(data);

    response.send(true);
});