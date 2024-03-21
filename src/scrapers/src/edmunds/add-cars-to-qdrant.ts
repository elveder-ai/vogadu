import { get } from '../common/artifacts';
import { CarModel } from '../common/car-model';
import { addToCollection } from '../common/qdrant';

(async () => {
  const cars: CarModel[] = await get(__dirname, 'edmunds-cars');

  for (const car of cars) {
    let carJson = JSON.stringify(car);

    console.log(carJson);

    await addToCollection('cars', carJson);
  }
})();