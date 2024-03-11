const { httpsGet } = require('./https.js');
const { saveCars } = require('./cars.js');

async function getCarMakers() {
  try {
    const url = 'https://www.edmunds.com/gateway/api/vehicle/v4/makes/';

    const httpsResult = await httpsGet(url);
    const json = JSON.parse(httpsResult);
    const result = Object.values(json.results).map(r => r.name.toLowerCase().replaceAll(' ', '-').replaceAll('_', '-').replaceAll(',', ''));

    return result.sort();
  } catch(e) {
    console.log('GET CAR MAKERS ERROR');
    console.error(e);

    return [];
  }
}

async function getModels(carMaker) {
  try {
    const url = `https://www.edmunds.com/gateway/api/vehicle/v4/makes/${carMaker}/submodels/`;

    const httpsResult = await httpsGet(url);
    const json = JSON.parse(httpsResult);
    const result = Object.values(json.results).map(r => r.name.toLowerCase().replaceAll(' ', '-').replaceAll('_', '-').replaceAll('/', '').replaceAll(',', ''));

    return result.sort();
  } catch(e) {
    console.log('GET MODELS ERROR');
    console.error(e);

    return [];
  }
}

async function getYears(carMaker, model) {
  try {
    const url = `https://www.edmunds.com/gateway/api/vehicle/v4/makes/${carMaker}/models/${model}/years`;

    const httpsResult = await httpsGet(url);
    const json = JSON.parse(httpsResult);

    const years = new Set();

    for (const data of Object.values(json.results)) {
        for (const year of Object.keys(data.years || {})) {
          years.add(year.replaceAll(',', ''));
        }
    }

    const result = Array.from(years).sort();

    return result;
  } catch(e) {
    console.log('GET YEARS ERROR');
    console.error(e);

    return [];
  }
}

(async () => {
  const cars = new Set();

  const carMakers = await getCarMakers();

  for(const carMaker of carMakers) {
    console.log(`Car maker: ${carMaker}`);

    const models = await getModels(carMaker);

    for(const model of models) {
      console.log(`Model: ${model}`);

      const years = await getYears(carMaker, model);

      for(const year of years) {
        const car = `${carMaker},${model},${year}`;
        
        console.log(car);

        cars.add(car);
      }
    }
  }

  await saveCars(cars);
})();