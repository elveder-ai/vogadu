import { QdrantVectorStore } from "@langchain/community/vectorstores/qdrant";
import { MistralAIEmbeddings } from '@langchain/mistralai';

const MISTRAL_API_KEY = '5XikMZrBKsmEv218407LqvLL3FapuuDg';

const QDRANT_URL = 'https://fad86663-a2dc-4852-91da-a3cbfa76f130.us-east4-0.gcp.cloud.qdrant.io';
const QDRANT_API_KEY = 'M2s39zNtibfQ9G4JP2pHKyvqsLwJlR8P7k19tw2TKcVTZg7xJ3lYzA';

export async function addToCollection(collection: string, text: string) {
  const texts = [ text ];

  const embeddings = new MistralAIEmbeddings({
    apiKey: MISTRAL_API_KEY
  });

  const dbConfig = {
    url: QDRANT_URL,
    apiKey: QDRANT_API_KEY,
    collectionName: collection
  }

  await QdrantVectorStore.fromTexts(texts, {}, embeddings, dbConfig);
}