import { QdrantVectorStore } from '@langchain/community/vectorstores/qdrant';
import { MistralAIEmbeddings } from '@langchain/mistralai';
import mistralCredentials from '../../../credentials/mistral.json';
import qdrantCredentials from '../../../credentials/qdrant.json';

export async function addToCollection(collection: string, text: string) {
  const texts = [ text ];

  const embeddings = new MistralAIEmbeddings({
    apiKey: mistralCredentials.apiKey
  });

  const dbConfig = {
    url: qdrantCredentials.url,
    apiKey: qdrantCredentials.apiKey,
    collectionName: collection
  }

  await QdrantVectorStore.fromTexts(texts, {}, embeddings, dbConfig);
}