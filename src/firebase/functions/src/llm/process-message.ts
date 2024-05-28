import { getMessagesByUser } from '../storage/messages';
import { AIMessage, BaseMessage, HumanMessage } from '@langchain/core/messages';
import { getCarsAgent } from './cars-agent';

import langsmithCredentials = require('../../../../credentials/langsmith.json');

process.env.LANGCHAIN_ENDPOINT = langsmithCredentials.endpoint;
process.env.LANGCHAIN_API_KEY = langsmithCredentials.apiKey;
process.env.LANGCHAIN_PROJECT = langsmithCredentials.project
process.env.LANGCHAIN_TRACING_V2 = langsmithCredentials.tracingV2;

export async function processMessage(userId: string, sessionId: string, input: string): Promise<string> {
  const messages = await getMessagesByUser(userId, sessionId);
  const chatHistory: BaseMessage[] = [];

  for(const message of messages) {
    chatHistory.push(new HumanMessage(message.request));
    chatHistory.push(new AIMessage(message.response));
  }

  const carsAgent = await getCarsAgent();

  const result = await carsAgent.invoke({
    input: input,
    chat_history: chatHistory
  });

  return result.output;
}