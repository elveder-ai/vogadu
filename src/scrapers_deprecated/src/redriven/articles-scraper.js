const { chromium } = require('playwright');
const { convert } = require('html-to-text');
const { getUrls, formatText, saveArticle } = require('../common.js');

function getTitle(url) {
  const urlObj = new URL(url);

  let pathname = urlObj.pathname;
  pathname = pathname.replace(/^\/|\/$/g, '');
  
  const parts = pathname.split('/');
  const lastPart = parts.pop();

  return lastPart;
}

(async () => {
  const browser = await chromium.launch();
  const browserContext = await browser.newContext();
  
  let urls = await getUrls(__dirname);
  
  for(const url of urls) {
    console.log(url);

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

      // Simulate clicking on the See more button
      const buttons = await page.$$('button[title="See More"]');

      for (const button of buttons) {
        console.log('See more');

        await button.click();
      }

      const textOptions = {
        selectors: [
          { selector: 'a', format: 'skip' },
          { selector: 'img', format: 'skip' },
          { selector: 'button', format: 'skip' },
          { selector: '.single-gallery', format: 'skip' }
        ],
      };
      
      const title = getTitle(url);

      const articlePros = await page.$eval('.pros', (el) => el.outerHTML);
      const articleCons = await page.$eval('.cons', (el) => el.outerHTML);
      const article = await page.$eval('.information .information-wrap', (el) => el.outerHTML);
    
      let text = '';
      text += convert(articlePros, textOptions);
      text += '\n\n';
      text += convert(articleCons, textOptions);
      text += '\n\n';
      text += convert(article, textOptions);
      
      text = formatText(text);

      await saveArticle('redriven', title, text);
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