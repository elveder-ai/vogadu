import { sendHttpsRequest } from "./https";
import * as logger from './logger';

export const PING_REQUEST_HEADER_KEY = 'X-Ping-Request';
export const PING_REQUEST_HEADER_VALUE = 'true';

export async function sendPingRequest(url: string) {
  const headers = {
    [PING_REQUEST_HEADER_KEY]: PING_REQUEST_HEADER_VALUE
  };
  
  const options = {
    hostname: url,
    method: 'POST',
    headers: headers
  };

  try {
    await sendHttpsRequest(options);
  } catch (e) {
    logger.error(['SendPingRequest error: ', e]);
  }
}