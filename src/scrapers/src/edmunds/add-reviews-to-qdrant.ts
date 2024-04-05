import { get } from "../common/artifacts";
import { CarModel } from "../common/car-model";
import { getFile } from "../common/firebase";
import { splitTextIntoParagraphs } from "../common/formatters";
import { addManyToCollection } from "../common/qdrant";
import { ReviewModel } from "../common/review-model";

(async () => {
  const cars: CarModel[] = await get(__dirname, 'edmunds-cars');

  for (const car of cars) {
    console.log(car);

    const reviewsFile = getFile(`edmunds/${car.carMaker}_${car.model}_${car.year}.txt`);
    const content = await reviewsFile.download();

    const texts: string[] = [];
    const metadatas: object[] = [];

    try {
      const contentJson = content.toString();
      const reviews: ReviewModel[] = JSON.parse(contentJson);
      
      for(const review of reviews) {
        const reviewParagraphs = splitTextIntoParagraphs(review.text);

        for(const [index, paragraph] of reviewParagraphs.entries()) {
          const text = `[${car.carMaker} ${car.model} ${car.year}] ${paragraph}`;

          const json = {
            carMaker: car.carMaker,
            model: car.model,
            year: car.year,
            reviewId: review.id,
            paragraphNumber: index + 1,
            totalParagraphsCount: reviewParagraphs.length
          }

          texts.push(text);
          metadatas.push(json);
        }
      }
    } catch { }

    await addManyToCollection('reviews', texts, metadatas);
  }
})();