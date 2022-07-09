
import puppeteer from 'puppeteer';
import { TABLE_EL } from '../utils/constants.js';

/**
 * 
 * @param {string} site 
 * @param {string} path 
 * @param {string} elType from constants utils
 * @returns {string[][] | undefined} array of table rows
 */
async function scrapeController(site, path, elType) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(site + path);

  const cookies = await getCookies(page, 'body > input[type=button]');
  const hasCookie = isCookiesFound(cookies, 'hasCookie', 'true');

  if(hasCookie) await page.reload();

  // internal logger for evaluation
  // page.on('console', msg => console.log(msg.text()));

  let scrapedData;
  if(elType === TABLE_EL) {
    scrapedData = await scrapeTable(page, 'tbody > tr', 'td');
  }

  await browser.close();

  return scrapedData;
}

/**
 * 
 * @param {puppeteer.Page} page 
 * @param {querySelector} selecter 
 * @returns {puppeteer.Protocol.Network.Cookie[]} all cookies on the site
 */
async function getCookies(page, selecter) {
  await page.click(selecter);
  const cookies = await page.cookies();
  return cookies;
}

/**
 * 
 * @param {puppeteer.Protocol.Network.Cookie[]} cookies 
 * @param {string} name cookies name
 * @param {string} value cookies value
 * @returns {boolean} is the cookies found
 */
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

/**
 * 
 * @param {puppeteer.Page} page 
 * @param {querySelector} trSelector 
 * @param {querySelector} tdSelector 
 * @returns {string[][] | undefined} array of table rows
 */
async function scrapeTable(page, trSelector, tdSelector) {
  const data = await page.evaluate(async ({trSelector, tdSelector}) => {
    const rows = document.querySelectorAll(trSelector);
    return Array.from(rows, row => {
      
      const columns = row.querySelectorAll(tdSelector)
      return Array.from(columns, (column, idx) => {
        // I can just log it here, but it will render these function un-reusable and hard to extense later
        // if(columns[idx].innerText === target) {
        //   console.log(columns[idx + 1].innerText);
        // }

        return column.innerText;
      });
    });
  }, {trSelector, tdSelector} );

  return data;
}


export let privateFunction = {
  getCookies,
  isCookiesFound,
  scrapeTable
}

// export private functions for testing
if(process.env.NODE_ENV !== 'test') {
  privateFunction = undefined;
}

export {
  scrapeController,
  privateFunction,
}