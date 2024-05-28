import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import * as logger from '../common/logger';

import openAiCredentials = require('../../../../credentials/openai.json');

export async function splitMessage(message: string, parts: number): Promise<string[] | undefined> {
  const chatModel: any = new ChatOpenAI({
    openAIApiKey: openAiCredentials.apiKey,
    modelName: 'gpt-4o',
    temperature: 0
  });

  const systemMessage = `
    Split this message into ${parts} parts.
    Each part should make sense on its own and maintain the context of the message. Ensure that the split points are chosen carefully to avoid breaking the flow of the content.
    Ensure to keep the formating of the original message including all the new lines "\\n"
    Output the result as a JSON array of ${parts} strings, for example:

    [ "Message part 1", "Part two of the message", "Part three", "Part 4" ]
  `;

  const prompt = ChatPromptTemplate.fromMessages([
    ['system', systemMessage],
    ['user', '{message}'],
  ]);

  const outputParser = new StringOutputParser();

  const llmChain = prompt.pipe(chatModel).pipe(outputParser);

  const response = await llmChain.invoke({
    message: message
  })

  try {
    const result: string[] = JSON.parse(response);

    return result;
  } catch (e: any) {
    logger.error(['SplitMessage error: ', e]);

    return undefined;
  }
}