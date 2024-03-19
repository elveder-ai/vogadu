import { getCarMakers, getModels, getYears } from './cars'

(async () => {
  const cars = new Set<string>();

  const carMakers = await getCarMakers();

  for (const carMaker of carMakers) {
    console.log(`Car maker: ${carMaker}`);

    const models = await getModels(carMaker);

    for (const model of models) {
      console.log(`Model: ${model}`);

      const years = await getYears(carMaker, model);

      for (const year of years) {
        const car = `${carMaker},${model},${year}`;

        console.log(car);

        cars.add(car);
      }
    }
  }
})();
