import { getCars } from './cars'
import { addToCollection } from '../common/qdrant'

(async () => {
  const cars =  await getCars();

  for(const car of cars) {
    const carAsString = JSON.stringify(car)

    console.log(carAsString);

    await addToCollection('cars', carAsString);
  }
})();
