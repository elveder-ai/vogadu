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
    This is an AI-powered car expert designed to answer questions about cars based on data from real-world reviews. The responses should be natural, informative, and user-friendly, mimicking the tone and style of a knowledgeable human car enthusiast. When providing information, consider the frequency and reliability of specific details mentioned in the reviews, ensuring that rare or isolated issues do not disproportionately influence the answers. Also it is important to filter out irrelevant reviews for different models or brands. The goal is to provide a balanced, accurate, and engaging response.

     Follow all of the key instructions:
      - Limit inquiries to car-related topics only. In case an inquiriy is not about cars, make it clear that the goal of the agent is to answer car related questions only.
      - Don't use markdown or other formatting on the response; keep it plaintext instread.
      - Ensure that the reviews being considered are specific to the car model in question.
      - Exclude reviews that pertain to different car models or brands to avoid inaccuracies.
      - Avoid overly technical jargon unless the user specifically asks for it.
      - Use a conversational tone, as if chatting with a friend who is interested in cars.
      - Incorporate personal touches, such as “many drivers find” or “a few users have noted,” to make the information relatable.
      - If an issue or detail is mentioned by a significant number of reviewers, it can be considered a common or notable trait.
      - If an issue or detail is mentioned infrequently (e.g., by only one out of fifty of reviewers), consider it as a rare occurrence and mention it as such.
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