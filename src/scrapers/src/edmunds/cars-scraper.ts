import { save } from '../common/artifacts';
import { CarModel } from '../common/car-model';
import { formatCarData } from '../common/formatters';
import { httpsGet } from './https';
import { GetCarMakersApiResponseModel } from './models/get-car-makers-api-response-model';
import { GetModelsApiReponseModel } from './models/get-models-api-reponse-mode';
import { GetYearsApiReponseModel } from './models/get-years-api-reponse-model';

async function getCarMakers(): Promise<string[]> {
  try {
    const url = 'https://www.edmunds.com/gateway/api/vehicle/v4/makes/';

    const httpsResult = await httpsGet(url);
    const json = JSON.parse(httpsResult);
    const result = Object.values<GetCarMakersApiResponseModel>(json.results).map(r => formatCarData(r.name));

    return result.sort();
  } catch (e) {
    console.log('GET CAR MAKERS ERROR');
    console.error(e);

    return [];
  }
}

async function getModels(carMaker: string): Promise<string[]> {
  try {
    const url = `https://www.edmunds.com/gateway/api/vehicle/v4/makes/${carMaker}/submodels/`;

    const httpsResult = await httpsGet(url);
    const json = JSON.parse(httpsResult);
    const result = Object.values<GetModelsApiReponseModel>(json.results).map(r => formatCarData(r.name));

    return result.sort();
  } catch (e) {
    console.log('GET MODELS ERROR');
    console.error(e);

    return [];
  }
}

async function getYears(carMaker: string, model: string): Promise<string[]> {
  try {
    const url = `https://www.edmunds.com/gateway/api/vehicle/v4/makes/${carMaker}/models/${model}/years`;

    const httpsResult = await httpsGet(url);
    const json = JSON.parse(httpsResult);

    const years = new Set<string>();

    for (const data of Object.values<GetYearsApiReponseModel>(json.results)) {
      for (const year of Object.keys(data.years || {})) {
        years.add(formatCarData(year));
      }
    }

    const result = Array.from(years).sort();

    return result;
  } catch (e) {
    console.log('GET YEARS ERROR');
    console.error(e);

    return [];
  }
}

(async () => {
  const cars: CarModel[] = [];

  const carMakers = await getCarMakers();

  for (const carMaker of carMakers) {
    const models = await getModels(carMaker);

    for (const model of models) {
      const years = await getYears(carMaker, model);

      for (const year of years) {
        const car = new CarModel(carMaker, model, Number(year));

        console.log(car);

        cars.push(car);
      }
    }
  }

  await save(__dirname, 'edmunds-cars', cars);
})();
