const { chromium } = require('playwright');
const { convert } = require('html-to-text');
const { getUrls, formatText, saveArticle } = require('../common.js');

function getTitle(url) {
  let result = url;

  result = result.substring(1);
  result = result.replaceAll('/', '-');

  return result;
}

(async () => {
  const browser = await chromium.launch();
  const browserContext = await browser.newContext();

  const baseUrl = 'https://www.whatcar.com';
  const additionalUrl = '/reliability';

  let urls = await getUrls(__dirname);

  for(const url of urls) {
    console.log(url);

    let page;

    try {
      page = await browserContext.newPage();
      await page.goto(`${baseUrl}${url}`);

      const article = await page.$eval('article', (el) => el.outerHTML);
    
      const textOptions = {
        selectors: [
          { selector: 'a', format: 'skip' },
          { selector: 'img', format: 'skip' },
          { selector: '.ReviewHero_galleryButtonsWrapper__PEM1u', format: 'skip' },
          { selector: '.ReviewHero_reviewInfo__iKzCk', format: 'skip' },
          { selector: '.ReviewHero_heroCardCol___dzLU', format: 'skip' },
          { selector: '.SideBarSticky_classSideBarStickyItem__Nr9dL', format: 'skip' },
          { selector: '.JourneyBar_JourneyBar___dNsL', format: 'skip' }
        ],
      };

      const title = getTitle(url);
      
      let text = convert(article, textOptions);
      text = formatText(text);

      let additionalPage;

      try {
        additionalPage = await browserContext.newPage();
        await additionalPage.goto(`${baseUrl}${url}${additionalUrl}`);

        const additionalArticle = await additionalPage.$eval('article', (el) => el.outerHTML);

        let additionalText = convert(additionalArticle, textOptions);
        additionalText = formatText(additionalText);

        text += `\n\n${additionalText}`;

        additionalPage.close();
      } catch(_) {
        console.log('ADDITIONAL PAGE NOT FOUND');
      } finally {
        await additionalPage.close();
      }

      await saveArticle('whatcar', title, text);
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