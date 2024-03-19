const { chromium } = require('playwright');
const { saveUrls } = require('../common.js');

(async () => {
  const browser = await chromium.launch();
  const browserContext = await browser.newContext();

  const urls = new Set();

  let url = 'https://redriven.com/cheat-sheets/';

  let page;

  try {
    page = await browserContext.newPage();
    await page.goto(url);

    // A delay, so we can load the entire page
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Simulate clicking on the Cookies consent button
    let cookiesConsentButton = await page.$('.fc-cta-consent');

    if(cookiesConsentButton != null) {
      await cookiesConsentButton.click();
    }

    // Simulate clicking on the Load more button to load all the articles
    const buttonSelector = 'button[title="Load More"]';
    let button = await page.$(buttonSelector);

    while(button != null) {
      console.log('Load more');

      await button.click();
      
      // A delay, so we can load the new articles
      await new Promise(resolve => setTimeout(resolve, 1000));

      button = await page.$(buttonSelector);
    }

    // A delay, so we can load the last articles
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Get the articles urls
    const articleUrls = await page.$$eval('.post-grid-section .grid > div > div > div > a', links => links.map(a => a.href));
    articleUrls.forEach(url => urls.add(url));
  } catch(e) {
    console.error(e);
  } finally {
    page.close();
  }

  await saveUrls(__dirname, urls);
  
  browserContext.close();
  browser.close();
})();