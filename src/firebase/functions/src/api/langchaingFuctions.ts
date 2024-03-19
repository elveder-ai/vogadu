import { onRequest } from 'firebase-functions/v2/https';
import { parsePostData } from '../common/request';
import * as logger from '../common/logger';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { MistralAIEmbeddings, ChatMistralAI } from '@langchain/mistralai';
import { QdrantVectorStore } from "@langchain/community/vectorstores/qdrant";

const MISTRAL_API_KEY = '5XikMZrBKsmEv218407LqvLL3FapuuDg';

const QDRANT_URL = 'https://fad86663-a2dc-4852-91da-a3cbfa76f130.us-east4-0.gcp.cloud.qdrant.io';
const QDRANT_API_KEY = 'M2s39zNtibfQ9G4JP2pHKyvqsLwJlR8P7k19tw2TKcVTZg7xJ3lYzA';

export const prompt = onRequest(async (request, response) => {
    const data = parsePostData(request);
    logger.log(data);

    const chatModel = new ChatMistralAI({
        apiKey: MISTRAL_API_KEY,
        modelName: 'mistral-small-latest',
    });

    const prompt = ChatPromptTemplate.fromMessages([
        ['system', 'This is a sentense completion agent. Complete the sentence based on the input, provided by the user. The comleted sentence should be between 6 and 15 words. Generate only one sentence, do not generate additional text and do not include the words count.'],
        ['human', '{input}'],
    ]);

    const outputParser = new StringOutputParser();

    const chain = prompt.pipe(chatModel).pipe(outputParser);

    const result = await chain.invoke({
        input: data.input
    });

    response.send(result);
});

export const embeddings = onRequest(async (request, response) => {
    const data = parsePostData(request);
    logger.log(data);

    const embeddings = new MistralAIEmbeddings({
        apiKey: MISTRAL_API_KEY
    });

    const result = await embeddings.embedQuery(data.input);

    response.send(result);
});

export const retrieve = onRequest(async (request, response) => {
    const data = parsePostData(request);

    const embeddings = new MistralAIEmbeddings({
        apiKey: MISTRAL_API_KEY
      });
    
      const dbConfig = {
        url: QDRANT_URL,
        apiKey: QDRANT_API_KEY,
        collectionName: 'cars'
      }
    
      const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, dbConfig);
    
      const result = await vectorStore.similaritySearch(data.query, data.resultsNumber);
    
      response.send(result);
});