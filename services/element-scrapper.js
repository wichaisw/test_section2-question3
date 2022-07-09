
import puppeteer from 'puppeteer';
import { TABLE_EL } from '../utils/constants.js';

async function scrapeController(site, path, elType, target) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(site + path);

  const cookies = await getCookies(page, 'body > input[type=button]');
  const hasCookie = isCookiesFound(cookies, 'hasCookie', 'true');

  if(hasCookie) await page.reload();

  // internal logger for evaluation
  page.on('console', msg => console.log(msg.text()));

  let scrapedData;
  if(elType === TABLE_EL) {
    scrapedData = await scrapeTable(page, 'tbody > tr', 'td', target);
  }

  await browser.close();

  return scrapedData;
}

async function getCookies(page, selecter) {
  await page.click(selecter);
  const cookies = await page.cookies();
  return cookies;
}

function isCookiesFound(cookies, name, value) {
  // look for the cookie in cookies array
  let hasCookie = false;

  for(let cookie of cookies) {
    if(cookie.name === name) {
      if(cookie.value === value) {
        hasCookie = true;
      };
      break;
    }
  }

  return hasCookie;
}

async function scrapeTable(page, trSelector, tdSelector, target) {
  const data = await page.evaluate(async ({trSelector, tdSelector, target}) => {
    const rows = document.querySelectorAll(trSelector);
    return Array.from(rows, row => {
      
      const columns = row.querySelectorAll(tdSelector)
      return Array.from(columns, (column, idx) => {
        // I can just log it here, but it will render these function un-reusable and hard to extense later
        if(columns[idx].innerText === target) {
          console.log(columns[idx + 1].innerText);
        }

        return column.innerText;
      });
    });
  }, {trSelector, tdSelector, target} );

  return data;
}

export {
  scrapeController,
}