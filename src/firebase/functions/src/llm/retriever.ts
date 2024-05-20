import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { QdrantVectorStore } from '@langchain/qdrant';
import { AttributeInfo } from 'langchain/schema/query_constructor';
import { SelfQueryRetriever } from 'langchain/retrievers/self_query';
import { QdrantTranslator } from '@langchain/community/retrievers/self_query/qdrant';

import openAiCredentials = require('../../../../credentials/openai.json');
import qdrantCredentials = require('../../../../credentials/qdrant.json');

export async function getSelfQueryRetriever(): Promise<SelfQueryRetriever<QdrantVectorStore>> {
  const chatModel: any = new ChatOpenAI({
  	openAIApiKey: openAiCredentials.apiKey,
  	modelName: 'gpt-4o',
  	temperature: 0
  });

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: openAiCredentials.apiKey,
    modelName: openAiCredentials.embedingsModel,
    dimensions: openAiCredentials.embedingsDimentions
  });

  const qdrantColletionName = `reviews-${openAiCredentials.qdrantSuffix}`;

  const dbConfig = {
    url: qdrantCredentials.url,
    apiKey: qdrantCredentials.apiKey,
    collectionName: qdrantColletionName
  }

  const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, dbConfig);

  const attributeInfo: AttributeInfo[] = [
    {
      name: 'year',
      description: 'The car\'s year',
      type: 'number',
    }
  ]

  const selfQueryRetriever = SelfQueryRetriever.fromLLM({
    llm: chatModel,
    vectorStore: vectorStore,
    documentContents: 'A car review',
    attributeInfo: attributeInfo,
    structuredQueryTranslator: new QdrantTranslator(),
    searchParams: {
      k: 50
    }
  });

  return selfQueryRetriever;
}