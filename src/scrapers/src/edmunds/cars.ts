import { httpsGet } from './https';

interface CarMakeResult {
  name: string;
}

export async function getCarMakers(): Promise<string[]> {
  try {
    const url = 'https://www.edmunds.com/gateway/api/vehicle/v4/makes/';

    const httpsResult = await httpsGet(url);
    const json = JSON.parse(httpsResult);
    const result = Object.values<CarMakeResult>(json.results).map(r => r.name.toLowerCase().replaceAll(' ', '-').replaceAll('_', '-').replaceAll(',', ''));

    return result.sort();
  } catch (e) {
    console.log('GET CAR MAKERS ERROR');
    console.error(e);

    return [];
  }
}

interface CarModelResult {
  name: string;
}

export async function getModels(carMaker: string): Promise<string[]> {
  try {
    const url = `https://www.edmunds.com/gateway/api/vehicle/v4/makes/${carMaker}/submodels/`;

    const httpsResult = await httpsGet(url);
    const json = JSON.parse(httpsResult);
    const result = Object.values<CarModelResult>(json.results).map(r => r.name.toLowerCase().replaceAll(' ', '-').replaceAll('_', '-').replaceAll('/', '').replaceAll(',', ''));

    return result.sort();
  } catch (e) {
    console.log('GET MODELS ERROR');
    console.error(e);

    return [];
  }
}

interface CarYearResult {
  years: { [year: string]: any };
}

export async function getYears(carMaker: string, model: string): Promise<string[]> {
  try {
    const url = `https://www.edmunds.com/gateway/api/vehicle/v4/makes/${carMaker}/models/${model}/years`;

    const httpsResult = await httpsGet(url);
    const json = JSON.parse(httpsResult);

    const years = new Set<string>();

    for (const data of Object.values<CarYearResult>(json.results)) {
      for (const year of Object.keys(data.years || {})) {
        years.add(year.replaceAll(',', ''));
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