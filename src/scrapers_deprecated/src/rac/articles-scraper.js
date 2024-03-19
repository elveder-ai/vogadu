const { chromium } = require('playwright');
const { convert } = require('html-to-text');
const { getUrls, formatText, saveArticle } = require('../common.js');

function getTitle(url) {
  const urlPrefix = 'https://www.rac.co.uk/drive/car-reviews/';

  let result = url;
  result = result.substring(urlPrefix.length);
  result = result.replaceAll('/', '-');

  return result;
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

      const article = await page.$eval('#content .inner .row .col-sm-8', (el) => el.outerHTML);
    
      const textOptions = {
        selectors: [
          { selector: 'a', format: 'skip' },
          { selector: 'img', format: 'skip' },
          { selector: '.section__social-sharing', format: 'skip' },
          { selector: '.gallery-container', format: 'skip' },
          { selector: '.date', format: 'skip' },
          { selector: '.section__cross-sell', format: 'skip' },
          { selector: '.section__category-tags', format: 'skip' },
          { selector: '.section__social-sharing', format: 'skip' },
          { selector: '.disclaimers-container', format: 'skip' }
        ],
      };

      const title = getTitle(url);
      
      let text = convert(article, textOptions);
      text = formatText(text);

      await saveArticle('rac', title, text);
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