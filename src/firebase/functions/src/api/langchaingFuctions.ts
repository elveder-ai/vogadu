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

    const prompt =ChatPromptTemplate.fromTemplate(`
        What car is the user talking about?
        Distinguish the CAR MAKER, the MODEL and the YEAR from the User Input.

        Provide the response in the following format; do NOT include any addional details, disclaimers or notes:

        /// json
        {{
            "carMaker": {{CAR_MAKER}},
            "model": {{MODEL}},
            "year": {{YEAR}}
        }}
        ///
        
        If cannot distinguish the CAR MAKER, the MODEL and the YEAR, or if the input is not related to cars, don't gues; instead just respond with "Unknown car" and don't generate the JSON.

        User Input: I'm seriously considering buying a 2020 Tesla Model S for its cutting-edge technology features.
        {{
            "carMaker": "Tesla",
            "model: "Model S",
            "year": "2020"
        }}

        User Input: I've always dreamed of owning a piece of American history, so I'm on the lookout to buy a 1964 Ford Mustang.
        {{
            "carMaker": "Ford",
            "model: "Mustang",
            "year": "1964"
        }}

        User Input: After reading numerous reviews about its dependability and stylish design, I've decided I want to buy a 2018 Toyota Camry.
        {{
            "carMaker": "Toyota",
            "model: "Camry",
            "year": "2018"
        }}

        User Input: I want to buy some BMW.
        "Unknown car"

        User Input: I am thinking of getting some Mercedes-Benz S-class. But I am still researching for the year.
        "Unknown car"

        User Input: {input}
    `);

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