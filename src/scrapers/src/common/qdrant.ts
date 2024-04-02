import { QdrantVectorStore } from '@langchain/community/vectorstores/qdrant';
import { MistralAIEmbeddings } from '@langchain/mistralai';
import mistralCredentials from '../../../credentials/mistral.json';
import qdrantCredentials from '../../../credentials/qdrant.json';

export async function addToCollection(collection: string, text: string, metadata: object) {
  const texts = [ text ];

  const embeddings = new MistralAIEmbeddings({
    apiKey: mistralCredentials.apiKey
  });

  const dbConfig = {
    url: qdrantCredentials.url,
    apiKey: qdrantCredentials.apiKey,
    collectionName: collection
  }

  await QdrantVectorStore.fromTexts(texts, metadata, embeddings, dbConfig);
}

export async function addManyToCollection(collection: string, texts: string[], metadatas: object[]) {
  if(texts.length != metadatas.length) {
    throw new Error('DIFFERENT TEXTS AND METADATA LENGTHS');
  }

  const embeddings = new MistralAIEmbeddings({
    apiKey: mistralCredentials.apiKey
  });

  const dbConfig = {
    url: qdrantCredentials.url,
    apiKey: qdrantCredentials.apiKey,
    collectionName: collection,
  }

  const chunkSize = 10;

  for(let i=0; i<texts.length; i+=chunkSize) {
    const textsChunk = texts.slice(i, i + chunkSize);
    const metadatasChunk = metadatas.slice(i, i + chunkSize);

    await QdrantVectorStore.fromTexts(textsChunk, metadatasChunk, embeddings, dbConfig);
  }
}