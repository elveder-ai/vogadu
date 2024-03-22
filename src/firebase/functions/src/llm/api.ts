import { onRequest } from 'firebase-functions/v2/https';
import { parsePostData } from '../common/request';
import * as logger from '../common/logger';
import { getCarDetails } from './get-car-details';

export const prompt = onRequest(async (request, response) => {
	const data = parsePostData(request);
	logger.log(data);

	const result = await getCarDetails(data.input, 2000);

	response.send(result);
	return;
});