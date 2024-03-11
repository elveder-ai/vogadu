const { chromium } = require('playwright');
const { getCarMakers, saveUrls } = require('../common.js');

(async () => {
  const browser = await chromium.launch();
  const browserContext = await browser.newContext();

  const urls = new Set();
  
  let carMakers = await getCarMakers(__dirname);

  for(const carMaker of carMakers) {
    console.log(carMaker);

    let url = `https://car-recalls.eu/make/${carMaker}/`;

    while(url != undefined) {
      console.log(`Url: ${url}`);

      let page;
      
      try {
        page = await browserContext.newPage();
        await page.goto(url);

        const articleUrls = await page.$$eval('article .inside-article .entry-header a', links => links.map(a => a.href));
        articleUrls.forEach(url => urls.add(url));

        const nextPageUrl = await page.$eval('.nav-links a.next', next => next.href).catch(() => undefined);
        url = nextPageUrl;
      } catch(e) {
        console.log('GET URLS ERROR');
        console.error(e);
  
        url = undefined;
      } finally {
        page.close();
      }
    }
  }

  await saveUrls(__dirname, urls);
  
  browserContext.close();
  browser.close();
})();