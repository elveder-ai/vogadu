import { get } from "../common/artifacts";
import { CarModel } from "../common/car-model";
import { getFilesInDirectory } from "../common/firebase";
import { splitTextIntoParagraphs } from "../common/formatters";
import { addManyToCollection } from "../common/qdrant";
import { ReviewModel } from "./models/review-model";

(async () => {
  let cars: CarModel[] = await get(__dirname, 'edmunds-cars');

  // To start from specific car maker, model and year
  const targetIndex = cars.findIndex(car => car.carMaker == 'chevrolet' && car.model == 'cobalt' && car.year == '2009');
  cars = cars.slice(targetIndex);

  for (const car of cars) {
    let carJson = JSON.stringify(car);

    console.log(carJson);

    const reviewFiles = await getFilesInDirectory(`${car.carMaker}/${car.model}/${car.year}`);

    console.log(`Reviews: ${reviewFiles.length}`);

    const texts: string[] = [];
    const metadatas: object[] = [];

    for (const file of reviewFiles) {
      const id = getReviewId(file.name);
      const content = await file.download();

      try {
        const contentJson = content.toString();
        const review: ReviewModel = JSON.parse(contentJson);
        
        const reviewParagraphs = splitTextIntoParagraphs(review.text ?? '');

        for(const [index, paragraph] of reviewParagraphs.entries()) {
          const text = `[${car.carMaker} ${car.model} ${car.year}] ${paragraph}`;

          const json = {
            carMaker: car.carMaker,
            model: car.model,
            year: car.year,
            reviewId: id,
            paragraphNumber: index + 1,
            totalParagraphsCount: reviewParagraphs.length
          }

          texts.push(text);
          metadatas.push(json);
        }
      } catch { }
    }

    //await addManyToCollection('reviews', texts, metadatas);
  }
})();

function getReviewId(reviewFileName: string) {
  const dotIndex = reviewFileName.indexOf('.');
  reviewFileName = reviewFileName.substring(0, dotIndex);

  const parts = reviewFileName.split('/');

  return parts[3];
}