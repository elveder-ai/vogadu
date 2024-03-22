import * as logger from '../common/logger';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { MistralAIEmbeddings, ChatMistralAI } from '@langchain/mistralai';
import { QdrantVectorStore } from '@langchain/community/vectorstores/qdrant';
import { CarDataModel } from './models/car-data-model';
import mistralCredentials = require('../../../../credentials/mistral.json');
import qdrantCredentials = require('../../../../credentials/qdrant.json');
import * as admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import firebaseCredentials = require('../../../../credentials/firebase.json');
import { ReviewModel } from './models/review-model';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { Document } from '@langchain/core/documents';

admin.initializeApp({
	credential: admin.credential.cert(firebaseCredentials as any),
});

const storage = getStorage();

export async function getCarDetails(input: string, maxLength: number): Promise<string> {
	const llmResponse = await processUserInput(input);

	if (llmResponse == undefined) {
		return 'It seems there is some issue on our end, and couldn\'t  process your request. Please try again.';
	}

	if (!llmResponse.carMaker || !llmResponse.model || !llmResponse.year) {
		return 'We couldn\'t process your request because there might be an issue with the car maker, model, or year information provided. Please ensure you have mentioned all three and try again.';
	}

	const carData = await retrieveCarData(llmResponse);

	if (carData == undefined) {
		return 'It seems there is some issue on our end, and couldn\'t  process your request. Please try again.';
	}

	const reviews = await getReviews(carData);

	const reviewsResult = await processReviews(reviews, maxLength);

	const result = `**${carData.carMaker} ${carData.model} ${carData.year}**\n\n${reviewsResult}`;

	return result;
}

async function processUserInput(input: string): Promise<CarDataModel | undefined> {
	const chatModel = new ChatMistralAI({
		apiKey: mistralCredentials.apiKey,
		modelName: 'mistral-small-latest',
	});

	const prompt = ChatPromptTemplate.fromTemplate(`
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
        
        If cannot distinguish the CAR MAKER, the MODEL and the YEAR, or if the input is not related to cars, don't gues; instead use null.

        User Input: I'm seriously considering buying a 2020 Tesla Model S for its cutting-edge technology features.
        {{
            "carMaker": "Tesla",
            "model": "Model S",
            "year": "2020"
        }}

        User Input: I've always dreamed of owning a piece of American history, so I'm on the lookout to buy a 1964 Ford Mustang.
        {{
            "carMaker": "Ford",
            "model": "Mustang",
            "year": "1964"
        }}

        User Input: After reading numerous reviews about its dependability and stylish design, I've decided I want to buy a 2018 Toyota Camry.
        {{
            "carMaker": "Toyota",
            "model": "Camry",
            "year": "2018"
        }}

        User Input: I want to buy some BMW.
        {{
            "carMaker": "BMW",
            "model": null,
            "year": null
        }}

        User Input: I am thinking of getting some Mercedes-Benz S-class. But I am still researching for the year.
        {{
            "carMaker": "Mercedes-Benz",
            "model": "S-Class",
            "year": null
        }}

        User Input: I really like Porche from 2018.
        {{
            "carMaker": "Porche",
            "model": null,
            "year": "2018"
        }}

        User Input: What would the weather be like in May?
        {{
            "carMaker": null,
            "model": null,
            "year": null
        }}

        User Input: {input}
	`);

	const outputParser = new StringOutputParser();

	const chain = prompt.pipe(chatModel).pipe(outputParser);

	const result = await chain.invoke({
		input: input
	});

	logger.log(result);

	try {
		const carData = JSON.parse(result);

		return carData;
	} catch (e: any) {
		logger.error(['ProcessUserInput. ', e]);

		return undefined;
	}
}

async function retrieveCarData(llmResponse: CarDataModel): Promise<CarDataModel | undefined> {
	const embeddings = new MistralAIEmbeddings({
		apiKey: mistralCredentials.apiKey
	});

	const dbConfig = {
		url: qdrantCredentials.url,
		apiKey: qdrantCredentials.apiKey,
		collectionName: 'cars'
	}

	const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, dbConfig);

	const result = await vectorStore.similaritySearch(`${llmResponse.carMaker} ${llmResponse.model} ${llmResponse.year}`, 1);

	logger.log(result);

	try {
		const carData = JSON.parse(result[0].pageContent);

		return carData;
	} catch (e: any) {
		logger.error(['RetrieveCarData. ', e]);

		return undefined;
	}
}

async function getReviews(carData: CarDataModel): Promise<ReviewModel[]> {
	const files = await storage.bucket(firebaseCredentials.cloudStorageBucket).getFiles({
		prefix: `${carData.carMaker}/${carData.model}/${carData.year}`,
		maxResults: 50
	});
	const [filesAsArray] = files;

	const reviews: ReviewModel[] = []

	for (const file of filesAsArray) {
		const content = await file.download();

		try {
			const contentJson = content.toString();
			const review: ReviewModel = JSON.parse(contentJson);

			reviews.push(review);
		} catch { }
	}

	return reviews;
}

async function processReviews(reviews: ReviewModel[], maxLength: number): Promise<string> {
	const chatModel = new ChatMistralAI({
		apiKey: mistralCredentials.apiKey,
		modelName: 'mistral-small-latest',
	});

	const prompt = ChatPromptTemplate.fromTemplate(`
		This is a cars review summarisation agent.
		Provide information about the car based only on the reviews, provided in the context.

		Keep the less than ${maxLength} characted long and put a focus on the pottential issues, mentioned in the reviews. Also mark some of the possitive things about the car.

        <context>
		{context}
		</context>
	`);

	const outputParser = new StringOutputParser();

	const documentChain = await createStuffDocumentsChain({
	llm: chatModel,
	prompt,
	});

	const chain = documentChain.pipe(outputParser);

	const context: Document[] = reviews.map(r => new Document({
		pageContent: `${r.title}\n\n${r.text}`
	}));

	const result = await chain.invoke({
		context: context
	});

	return result;
}