import { get } from '../common/artifacts';
import { httpsGet } from './https';
import { formatText } from '../common/formatters';
import { uploadFileToStorage } from '../common/firebase';
import { ReviewModel } from '../common/review-model';
import { CarModel } from '../common/car-model';
import { v4 as uuidv4 } from 'uuid';

async function getReviews(carMaker: string, model: string, year: string): Promise<string[]> {
  try {
    const parametersString = `{"vehicleFilter":{"makeSlug":"${carMaker}","modelSlug":"${model}","years":[${year}]},"pageRequest":{"pageNum":1,"pageSize":999999999},"sortBy":{"confidence":"DESC"},"reviewFilter":{"userRating":null}}`;
    const parameters = encodeURIComponent(parametersString);
  
    const url = `https://www.edmunds.com/gateway/graphql/federation/?variables=${parameters}&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%22359efce53e35613ca79e6ee982141cadee14a4053a0f6a4169441c6b9e55dee5%22%7D%7D`;
    
    const httpsResult = await httpsGet(url);
    const json = JSON.parse(httpsResult);
  
    const result: string[] = json.data.vehicleReviews.reviews.map((review: any) => review.text ?? '');
  
    return result;
  } catch (e) {
    console.log('GET REVIEWS ERROR');
    console.error(e);

    return [];
  }
}

(async () => {
  const cars: CarModel[] = await get(__dirname, 'edmunds-cars');
  
  for (const car of cars) {
    console.log(car);

    const reviews = await getReviews(car.carMaker, car.model, car.year);

    const data: ReviewModel[] = reviews.map(review => new ReviewModel(
      uuidv4(),
      formatText(review)
    ))
    
    await uploadFileToStorage(`edmunds/${car.carMaker}_${car.model}_${car.year}.txt`, data);
  }
})();
