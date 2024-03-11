const { getCars } = require('./cars.js');
const { httpsGet } = require('./https.js');
const { formatText, saveReview } = require('../common.js');

async function getReviews(carMaker, model, year) {
  try {
    const parametersString = `{"vehicleFilter":{"makeSlug":"${carMaker}","modelSlug":"${model}","years":[${year}]},"pageRequest":{"pageNum":1,"pageSize":999999999},"sortBy":{"confidence":"DESC"},"reviewFilter":{"userRating":null}}`;
    const parameters = encodeURIComponent(parametersString);
  
    const url = `https://www.edmunds.com/gateway/graphql/federation/?variables=${parameters}&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%22359efce53e35613ca79e6ee982141cadee14a4053a0f6a4169441c6b9e55dee5%22%7D%7D`;
    
    const httpsResult = await httpsGet(url);
    const json = JSON.parse(httpsResult);
  
    const result = json.data.vehicleReviews.reviews.map(review => ({
      title: review.title,
      text: review.text,
      upvotes: review.thumbsUp,
      downvotes: review.thumbsDown
    }));
  
    return result;
  } catch(e) {
    console.log('GET REVIEWS ERROR');
    console.error(e);

    return [];
  }
}

(async () => {
  const cars = await getCars();
  
  for(const car of cars) {
    const carData = car.split(',');

    if(carData.length != 3) {
      console.log('CAR DATA ERROR');

      continue;
    }

    console.log(`Car maker: ${carData[0]}, model: ${carData[1]}, year: ${carData[2]}`);

    const reviews = await getReviews(carData[0], carData[1], carData[2]);
    
    for (const [index, review] of reviews.entries()) {
      const title = `${carData[0]}_${carData[1]}_${carData[2]}_review-${index}`;

      let text = '';
      text += `CAR MAKER: ${carData[0]}\n`;
      text += `MODEL: ${carData[1]}\n`;
      text += `YEAR: ${carData[2]}\n`;
      text += '\n\n';
      text += `TITLE: ${review.title}`;
      text += '\n\n';
      text += `TEXT: ${review.text}`;
      text += '\n\n';
      text += `UPVOTES: ${review.upvotes}`;
      text += '\n';
      text += `DOWNVOTES: ${review.downvotes}`;

      text = formatText(text);

      await saveReview('edmunds', title, text);
    }
  }
})();