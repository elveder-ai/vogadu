const { chromium } = require('playwright');
const { getCarMakers, saveUrls } = require('../common.js');

(async () => {
  const browser = await chromium.launch();
  const browserContext = await browser.newContext();

  const urls = new Set();
  
  let carMakers = await getCarMakers(__dirname);

  for(const carMaker of carMakers) {  
    console.log(carMaker);

    const url = `https://www.whatcar.com/used-reviews/make/${carMaker}`;

    console.log(url);
    
    let page;
    
    try {
      page = await browserContext.newPage();
      await page.goto(url);

      // Simulate scrolling to bottom to load all the content
      let previousHeight = 0;
      let currentHeight = await page.evaluate('document.body.scrollHeight');

      while (previousHeight !== currentHeight) {
        previousHeight = currentHeight;
        
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        await page.waitForFunction(`document.body.scrollHeight >= ${currentHeight}`);
        
        currentHeight = await page.evaluate('document.body.scrollHeight');
      }

      // Get the articles urls
      const articleUrls = await page.$$eval('article article', links => links.map(a => a.innerHTML));

      if(articleUrls.length == 0) {
        console.log('NO ARTICLES FOUND');
      }

      for(let url of articleUrls) {
        url = url.substring(url.indexOf('\"') + 1);
        url = url.substring(0, url.indexOf('\"'));

        urls.add(url);
      }
    } catch(e) {
      console.log('GET URLS ERROR');
      console.error(e);
    } finally {
      await page.close();
    }
  }

  await saveUrls(__dirname, urls);
  
  await browserContext.close();
  await browser.close();
})();