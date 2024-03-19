const { chromium } = require('playwright');
const { convert } = require('html-to-text');
const { getCars } = require('./cars.js');
const { formatText, saveArticle } = require('../common.js');

(async () => {
  const browser = await chromium.launch();
  const browserContext = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  });

  const cars = await getCars();
  
  for(const car of cars) {
    const carData = car.split(',');

    if(carData.length != 3) {
      console.log('CAR DATA ERROR');

      continue;
    }

    console.log(`Car maker: ${carData[0]}, model: ${carData[1]}, year: ${carData[2]}`);

    url = `https://www.edmunds.com/${carData[0]}/${carData[1]}/${carData[2]}/review/`;

    console.log(url);

    let page;
    
    try {
      page = await browserContext.newPage();
      await page.goto(url);

      // Simulate clicking on the Read more button
      const buttons = await page.$$('.editorial-review-full-container .content-collapse-button');

      for (const button of buttons) {
        console.log('Read more');

        await button.click();
      }
    
      const textOptions = {
        selectors: [
          { selector: 'a', format: 'skip' },
          { selector: 'img', format: 'skip' },
          { selector: '.article-author', format: 'skip' },
          { selector: '.range-and-cost', format: 'skip' },
          { selector: '.content-collapse-button', format: 'skip' },
          { selector: '.intro-content', format: 'skip' }
        ],
      };

      const title = `${carData[0]}-${carData[1]}-${carData[2]}`;

      const articleTitle = await page.$eval('.used-core-intro', (el) => el.outerHTML);
      const article = await page.$eval('.editorial-review-full-container', (el) => el.outerHTML);
      
      let text = '';
      text += convert(articleTitle, textOptions);
      text += '\n\n';
      text += convert(article, textOptions);

      text = formatText(text);

      await saveArticle('edmunds', title, text);
    } catch(e) {
      console.log('GET ARTICLE ERROR');
      console.error(e);
    } finally {
      await page.close();
    }
  }
  
  await browserContext.close();
  await browser.close();
})();