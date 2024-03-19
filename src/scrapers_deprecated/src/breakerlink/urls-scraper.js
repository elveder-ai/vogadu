const { chromium } = require('playwright');
const { saveUrls } = require('../common.js');

(async () => {
  const browser = await chromium.launch();
  const browserContext = await browser.newContext();

  const urls = new Set();
  
  let url = 'https://www.breakerlink.com/blog/';

  while(url != undefined) {
    console.log(`Url: ${url}`);

    let page;

    try {
      page = await browserContext.newPage();
      await page.goto(url);

      const articleUrls = await page.$$eval('article h2.entry-title a', links => links.map(a => a.href));
      articleUrls.forEach(url => urls.add(url));

      const nextPageUrl = await page.$eval('.nextpostslink', next => next.href).catch(() => undefined);
      url = nextPageUrl;
    } catch(e) {
      console.log('GET URLS ERROR');
      console.error(e);

      url = undefined;
    } finally {
      await page.close();
    }
  }

  await saveUrls(__dirname, urls);
  
  await browserContext.close();
  await browser.close();
})();