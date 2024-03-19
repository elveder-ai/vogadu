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

      const article = await page.$eval('article .entry-content', (el) => el.outerHTML);
    
      const textOptions = {
        selectors: [
          { selector: 'a', format: 'skip' },
          { selector: 'img', format: 'skip' },
          { selector: '.crp_related', format: 'skip' }
        ],
      };

      const title = getTitle(url);
      
      let text = convert(article, textOptions);
      text = formatText(text);

      await saveArticle('breakerlink', title, text);
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