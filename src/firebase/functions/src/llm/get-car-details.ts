import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { ChatMistralAI, MistralAIEmbeddings } from '@langchain/mistralai';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { AgentExecutor, createOpenAIToolsAgent } from 'langchain/agents';
import { QdrantVectorStore } from '@langchain/community/vectorstores/qdrant';
import { createRetrieverTool } from 'langchain/tools/retriever';

import mistralCredentials = require('../../../../credentials/mistral.json');
import openAiCredentials = require('../../../../credentials/openai.json');
import qdrantCredentials = require('../../../../credentials/qdrant.json');
import langsmithCredentials = require('../../../../credentials/langsmith.json');

process.env.LANGCHAIN_ENDPOINT = langsmithCredentials.endpoint;
process.env.LANGCHAIN_API_KEY = langsmithCredentials.apiKey;
process.env.LANGCHAIN_PROJECT = langsmithCredentials.project
process.env.LANGCHAIN_TRACING_V2 = langsmithCredentials.tracingV2;

export async function getCarDetails(input: string, maxLength: number): Promise<string> {
  // Mistal
  // const chatModel: any = new ChatMistralAI({
  //   apiKey: mistralCredentials.apiKey,
  //   modelName: 'mistral-large-latest',
  //   temperature: 0
  // });

  // const embeddings = new MistralAIEmbeddings({
  //   apiKey: mistralCredentials.apiKey
  // });

  // const qdrantColletionName = `reviews-${mistralCredentials.qdrantSuffix}`;

  // OpenAI
  const chatModel: any = new ChatOpenAI({
  	openAIApiKey: openAiCredentials.apiKey,
  	modelName: 'gpt-3.5-turbo-0125',
  	temperature: 0
  });

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: openAiCredentials.apiKey,
    modelName: 'text-embedding-3-large',
    dimensions: 256
  });

  const qdrantColletionName = `reviews-${openAiCredentials.qdrantSuffix}`;

  const systemMessage = `
    This is an agent that is a car specialist with years of experience.

    Answer only to questions related to cars.

    Respond to the user's question in a professional, yet friendly and undestandable manner.
    The response shouldn't sound like information summarization; make is like the one's oppinion, experience and knowedge.
    Don't start with 'Based on <some information>'; directly answer the queion instead.
    Include a bullet lists where appropriate.
    
    Don't mention the word 'reviews' in the response; use 'information' or 'data' instead.

    The response should be about 5-6 sentences and not more than ${maxLength} characters.
  `;

  const prompt = ChatPromptTemplate.fromMessages([
    ['system', systemMessage],
    ['human', '{input}'],
    new MessagesPlaceholder('agent_scratchpad'),
  ]);

  const dbConfig = {
    url: qdrantCredentials.url,
    apiKey: qdrantCredentials.apiKey,
    collectionName: qdrantColletionName
  }

  const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, dbConfig);

  const carReviewsTool = await createRetrieverTool(vectorStore.asRetriever(50), {
    name: 'retrieve_car_reviews',
    description:
      'Retrieves reviews about specific car model. Use this tool for anything cars related.',
  });

  const tools = [carReviewsTool];

  const agent = await createOpenAIToolsAgent({
    llm: chatModel,
    tools: tools,
    prompt: prompt,
  });

  const agentExecutor = new AgentExecutor({
    agent: agent,
    tools: tools,
  });

  const result = await agentExecutor.invoke({
    input: input
  });

  return result.output;
}