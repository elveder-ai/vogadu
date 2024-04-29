import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { ChatMistralAI, MistralAIEmbeddings } from '@langchain/mistralai';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { AgentExecutor, createOpenAIToolsAgent } from 'langchain/agents';
import { QdrantVectorStore } from '@langchain/community/vectorstores/qdrant';
import { createRetrieverTool } from 'langchain/tools/retriever';
import { getMessagesByUser } from '../storage/messages';
import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";

import mistralCredentials = require('../../../../credentials/mistral.json');
import openAiCredentials = require('../../../../credentials/openai.json');
import qdrantCredentials = require('../../../../credentials/qdrant.json');
import langsmithCredentials = require('../../../../credentials/langsmith.json');

process.env.LANGCHAIN_ENDPOINT = langsmithCredentials.endpoint;
process.env.LANGCHAIN_API_KEY = langsmithCredentials.apiKey;
process.env.LANGCHAIN_PROJECT = langsmithCredentials.project
process.env.LANGCHAIN_TRACING_V2 = langsmithCredentials.tracingV2;

const CHAT_HISTORY_KEY = "chat_history";

export async function processMessage(userId: string, sessionId: string, input: string, maxLength: number): Promise<string> {
  const messages = await getMessagesByUser(userId, sessionId);
  const chatHistory: BaseMessage[] = [];

  for(const message of messages) {
    chatHistory.push(new HumanMessage(message.request));
    chatHistory.push(new AIMessage(message.response));
  }

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
    This agent is an experienced car specialist.

    Scope: Limit inquiries to car-related topics only.
    Response style:
      - Maintain a professional yet friendly tone.
      - Respond with insights as if sharing from personal experience and knowledge.
      - Use present tense to keep responses engaging and direct.
    Direct Answers: Avoid prefacing answers with "Based on the data gathered" or similar. Begin responses directly with the facts or opinions.
    Formatting:
      - Use simple, plaintext formatting suitable for chat interfaces.
      - Use bullet points to neatly organize lists.
    Language: Avoid the term "reviews"; use "information" or "data" instead.
    Length: Aim for responses that are 5-6 sentences and fit within ${maxLength} characters to maintain user engagement.

    Example Response:
    "With a 2017 Mercedes C Class, you might encounter a few issues:
      - Electrical Problems: There can be electrical issues, like radio malfunctions, keyless go problems, and computer failures.
      - Transmission Concerns: Some owners report transmission problems, including rough shifts and delays in gear changes.
      - Infotainment System: The system may feel non-intuitive, with a cumbersome touchpad and subpar navigation.
      - Mechanical Problems: Watch out for engine noise, brake issues, and door handle malfunctions.
      - Noise and Comfort: There could be wind noise and rattling from the dash and doors, alongside uncomfortable seats.
      - Tire and Suspension: Issues may include quickly wearing run-flat tires and uncomfortable suspension.
      - Quality Control: Be aware of possible poor quality control, like easily chipped paint and substandard interior components.
      - Safety Features: Blind spots and some overly aggressive safety features like lane-keeping assist might be bothersome.
      - Gas Mileage: Fuel efficiency might not meet expectations, leading to higher fuel consumption.

    It's wise to inspect any specific vehicle closely to ensure it meets your expectations for a satisfying ownership experience."
  `;

  const prompt = ChatPromptTemplate.fromMessages([
    ['system', systemMessage],
    new MessagesPlaceholder(CHAT_HISTORY_KEY),
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

  const result = await agentExecutor.invoke({
    input: input,
    chat_history: chatHistory
  });

  return result.output;
}