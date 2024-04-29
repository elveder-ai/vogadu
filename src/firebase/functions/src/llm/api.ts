import { onRequest } from 'firebase-functions/v2/https';
import { parsePostData } from '../common/request';
import * as logger from '../common/logger';
import { processMessage } from './agent';

export const agent = onRequest(async (request, response) => {
  const data = parsePostData(request);
  logger.log(data);

  const result = await processMessage('7351265168322889', '2024-04-29', data.input, 2000);

  response.send(result);
});