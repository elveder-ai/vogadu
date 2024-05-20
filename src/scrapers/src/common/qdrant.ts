import { QdrantVectorStore } from '@langchain/qdrant';
import { OpenAIEmbeddings } from "@langchain/openai";

import openAiCredentials = require('../../../credentials/openai.json');
import qdrantCredentials from '../../../credentials/qdrant.json';

export async function addToCollection(collection: string, text: string, metadata: object) {
  const texts = [ text ];

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: openAiCredentials.apiKey,
    modelName: openAiCredentials.embedingsModel,
    dimensions: openAiCredentials.embedingsDimentions
  });

  const collectionName = `${collection}-${openAiCredentials.qdrantSuffix}`;

  const dbConfig = {
    url: qdrantCredentials.url,
    apiKey: qdrantCredentials.apiKey,
    collectionName: collectionName
  }

  await QdrantVectorStore.fromTexts(texts, metadata, embeddings, dbConfig);
}

export async function addManyToCollection(collection: string, texts: string[], metadatas: object[]) {
  if(texts.length != metadatas.length) {
    throw new Error('DIFFERENT TEXTS AND METADATA LENGTHS');
  }

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: openAiCredentials.apiKey,
    modelName: openAiCredentials.embedingsModel,
    dimensions: openAiCredentials.embedingsDimentions 
  });

  const collectionName = `${collection}-${openAiCredentials.qdrantSuffix}`;

  const dbConfig = {
    url: qdrantCredentials.url,
    apiKey: qdrantCredentials.apiKey,
    collectionName: collectionName,
  }

  const chunkSize = 25;

  for(let i=0; i<texts.length; i+=chunkSize) {
    const textsChunk = texts.slice(i, i + chunkSize);
    const metadatasChunk = metadatas.slice(i, i + chunkSize);

    await QdrantVectorStore.fromTexts(textsChunk, metadatasChunk, embeddings, dbConfig);
  }
}