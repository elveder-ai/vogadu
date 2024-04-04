import { QdrantVectorStore } from '@langchain/community/vectorstores/qdrant';
import { MistralAIEmbeddings } from '@langchain/mistralai';
import { OpenAIEmbeddings } from "@langchain/openai";

import mistralCredentials from '../../../credentials/mistral.json';
import openAiCredentials = require('../../../credentials/openai.json');
import qdrantCredentials from '../../../credentials/qdrant.json';

export async function addToCollection(collection: string, text: string, metadata: object) {
  const texts = [ text ];

  // Mistral
  const embeddings = new MistralAIEmbeddings({
    apiKey: mistralCredentials.apiKey
  });

  const collectionName = `${collection}-mistal`;

  // Open AI
  // const embeddings = new OpenAIEmbeddings({
  //   openAIApiKey: openAiCredentials.apiKey,
  //   modelName: 'text-embedding-3-small'
  // });

  // const collectionName = `${collection}-openai`;

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

  // Mistral
  // const embeddings = new MistralAIEmbeddings({
  //   apiKey: mistralCredentials.apiKey
  // });

  // const collectionName = `${collection}-${mistralCredentials.qdrantSuffix}`;

  // Open AI
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: openAiCredentials.apiKey,
    modelName: 'text-embedding-3-small'
  });

  const collectionName = `${collection}-${openAiCredentials.qdrantSuffix}`;

  const dbConfig = {
    url: qdrantCredentials.url,
    apiKey: qdrantCredentials.apiKey,
    collectionName: collectionName,
  }

  const chunkSize = 10;

  for(let i=0; i<texts.length; i+=chunkSize) {
    const textsChunk = texts.slice(i, i + chunkSize);
    const metadatasChunk = metadatas.slice(i, i + chunkSize);

    await QdrantVectorStore.fromTexts(textsChunk, metadatasChunk, embeddings, dbConfig);
  }
}