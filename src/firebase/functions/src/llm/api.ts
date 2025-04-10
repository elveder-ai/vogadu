import { onRequest } from 'firebase-functions/v2/https';
import { parsePostData } from '../common/request';
import * as logger from '../common/logger';
import { processMessage } from './process-message';
import { v4 as uuidv4 } from 'uuid';
import { splitMessage } from './split-message';

export const agent = onRequest(async (request, response) => {
  const data = parsePostData(request);
  logger.log(data);

  const result = await processMessage('7351265168322889', uuidv4(), data.input);

  response.send(result);
});

export const split = onRequest(async (request, response) => {
  const data = parsePostData(request);
  logger.log(data);

  const result = await splitMessage(data.message, data.parts);

  response.send(result);
});