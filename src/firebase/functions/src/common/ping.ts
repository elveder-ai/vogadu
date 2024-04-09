import { sendHttpsRequest } from "./https";
import * as logger from './logger';

export async function sendPingRequest(url: string, pingRequestHeaderKey: string, pingRequestHeaderValue: string) {
  const headers = {
    [pingRequestHeaderKey]: pingRequestHeaderValue
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