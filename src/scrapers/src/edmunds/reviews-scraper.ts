import { getCars } from './cars';
import { httpsGet } from './https';
import { formatText } from '../common/formatters';
import { addToCollection } from '../common/firebase';
import { ReviewModel } from './models/review-model';

async function getReviews(carMaker: string, model: string, year: string): Promise<ReviewModel[]> {
  try {
    const parametersString = `{"vehicleFilter":{"makeSlug":"${carMaker}","modelSlug":"${model}","years":[${year}]},"pageRequest":{"pageNum":1,"pageSize":999999999},"sortBy":{"confidence":"DESC"},"reviewFilter":{"userRating":null}}`;
    const parameters = encodeURIComponent(parametersString);
  
    const url = `https://www.edmunds.com/gateway/graphql/federation/?variables=${parameters}&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%22359efce53e35613ca79e6ee982141cadee14a4053a0f6a4169441c6b9e55dee5%22%7D%7D`;
    
    const httpsResult = await httpsGet(url);
    const json = JSON.parse(httpsResult);
  
    const result: ReviewModel[] = json.data.vehicleReviews.reviews.map((review: any) => ({
      title: review.title,
      text: review.text,
      upvotes: review.thumbsUp,
      downvotes: review.thumbsDown
    }));
  
    return result;
  } catch (e) {
    console.log('GET REVIEWS ERROR');
    console.error(e);

    return [];
  }
}

(async () => {
  const cars = await getCars();
  
  for (const carData of cars) {
    console.log(`Car maker: ${carData.carMaker}, model: ${carData.model}, year: ${carData.year}`);

    const reviews = await getReviews(carData.carMaker, carData.model, carData.year);
    
    for (const [index, review] of reviews.entries()) {
      const json = {
        carMaker: carData.carMaker,
        model: carData.model,
        year: carData.year,
        title: formatText(review.title ?? ''),
        text: formatText(review.text ?? ''),
        upvotes: review.upvotes,
        downvotes: review.downvotes
      };

      await addToCollection(`${carData.carMaker}_${carData.model}_${carData.year}`, json);
    }
  }
})();
