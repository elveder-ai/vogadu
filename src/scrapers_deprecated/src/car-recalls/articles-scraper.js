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

      const articleTitle = await page.$eval('article .entry-header h1', (el) => el.outerHTML);
      const articlePart1 = await page.$eval('article .entry-content > p:nth-of-type(1)', (el) => el.outerHTML);
      const articlePart2 = await page.$eval('article .entry-content > p:nth-of-type(2)', (el) => el.outerHTML);
      const articlePart3 = await page.$eval('article .entry-content > p:nth-of-type(3)', (el) => el.outerHTML);
    
      const textOptions = {
        selectors: [
          { selector: 'a', format: 'skip' },
          { selector: 'img', format: 'skip' }
        ],
      };

      const title = getTitle(url);
      
      let text = '';
      text += convert(articleTitle, textOptions);
      text += '\n\n';
      text += convert(articlePart1, textOptions);
      text += '\n\n';
      text += convert(articlePart2, textOptions);
      text += '\n\n';
      text += convert(articlePart3, textOptions);
      
      text = formatText(text);

      await saveArticle('car-recalls', title, text);
    } catch(e) {
      console.log('GET ARTICLE ERROR');
      console.error(e);
    } finally {
      await page.close();

      // A delay, because otherwise we will be blocked
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  await browserContext.close();
  await browser.close();
})();