import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { AgentExecutor, createOpenAIToolsAgent } from 'langchain/agents';
import { createRetrieverTool } from 'langchain/tools/retriever';
import { getSelfQueryRetriever } from './retriever';

import openAiCredentials = require('../../../../credentials/openai.json');

export async function getCarsAgent(): Promise<AgentExecutor> {
  const chatModel: any = new ChatOpenAI({
  	openAIApiKey: openAiCredentials.apiKey,
  	modelName: 'gpt-4o',
  	temperature: 0
  });

  const systemMessage = `
  Answer to the user's inquiries about cars based on data from real-world reviews. Use a conversational tone, as if chatting with a friend who is interested in cars. Avoid overly technical jargon unless the user specifically asks for it. The responses should be natural, informative, and user-friendly, mimicking the tone and style of a knowledgeable human car enthusiast.

  When providing information, consider the frequency and reliability of specific details mentioned in the reviews, ensuring that rare or isolated issues do not disproportionately influence the answers. The goal is to provide a balanced, accurate, and engaging response. Ensure that the reviews being considered are specific to the car model in the question. If an issue or detail is mentioned by a significant number of reviewers, it can be considered a common or notable trait. If an issue or detail is mentioned infrequently (e.g., by only one out of fifty of reviewers), consider it as a rare occurrence and mention it as such. Exclude reviews that pertain to different car models or brands to avoid inaccuracies.
  
  Limit inquiries to car-related topics only. In case an inquiry is not about cars, make it clear that the goal of the agent is to answer car related questions only.
  
  Make sure that the responses are less than 250 words. This is important to keep the user interested in the conversation.

  Use only plain text. Do not use any markdown, including bold, italic, or other special characters. The only allowed formatting is lists without any special characters.
  `;

  const prompt = ChatPromptTemplate.fromMessages([
    ['system', systemMessage],
    new MessagesPlaceholder('chat_history'),
    ['human', '{input}'],
    new MessagesPlaceholder('agent_scratchpad'),
  ]);

  const selfQueryRetriever = await getSelfQueryRetriever();

  const carReviewsTool = createRetrieverTool(selfQueryRetriever, {
    name: 'retrieve_car_reviews',
    description:
      'Retrieves cars reviews.',
  });

  const tools = [ carReviewsTool ];

  const agent = await createOpenAIToolsAgent({
    llm: chatModel,
    tools: tools,
    prompt: prompt,
  });

  const agentExecutor = new AgentExecutor({
    agent: agent,
    tools: tools,
  });

  return agentExecutor;
}