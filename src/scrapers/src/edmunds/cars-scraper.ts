import { getCarMakers, getModels, getYears } from './cars'
import { addToCollection } from './qdrant'

(async () => {
  const carMakers = await getCarMakers();

  for (const carMaker of carMakers) {
    const models = await getModels(carMaker);

    for (const model of models) {
      const years = await getYears(carMaker, model);

      for (const year of years) {
        const car = {
          carMaker: carMaker,
          model: model,
          year: year
        }

        const carAsString = JSON.stringify(car)

        console.log(carAsString);

        await addToCollection('cars', carAsString);
      }
    }
  }
})();
