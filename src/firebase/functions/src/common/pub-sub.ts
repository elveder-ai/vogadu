import { PubSub } from '@google-cloud/pubsub';
import { CloudEvent } from 'firebase-functions/lib/v2/core';
import { MessagePublishedData } from 'firebase-functions/lib/v2/providers/pubsub';

const pubSubClient = new PubSub();

export async function sendPubRequest<T>(topic: string, data: T) {
	const dataJson = JSON.stringify(data);
	const buffer = Buffer.from(dataJson);

	await pubSubClient.topic(topic).publishMessage({
		data: buffer
	});
}

export function getSubData<T = any>(event: CloudEvent<MessagePublishedData<T>>): T {
	const dataJson = event.data.message.data ? Buffer.from(event.data.message.data, 'base64').toString() : undefined;

	if (dataJson == undefined) {
		throw new Error('Data is undefined');
	}

	const data: T = JSON.parse(dataJson);

	return data;
}