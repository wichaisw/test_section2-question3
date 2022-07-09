const { privateFunction: test, scrapeController } = require('../../services/element-scrapper')
// const puppeteer = require('puppeteer');
const puppeteer = require('expect-puppeteer');
// import 'expect-puppeteer'
describe('element-scrapper module', () => {
  beforeAll( async() => {
    await page.goto('https://codequiz.azurewebsites.net/');
  });

  describe('accept and check cookies', () => {
    let cookies;
    it('should return cookies', async() => {
      cookies = await test.getCookies(page, 'body > input[type=button]');
      expect(cookies.length).toBeGreaterThan(0);
    });

    it('should have property hasCookie with value true as a string', () => {
      expect(test.isCookiesFound(cookies, 'hasCookie', 'true')).toEqual(true);
    });
  });

  describe('scrape data from table', () => {
    beforeAll(async() => {
      await page.reload();
    });
  
    it('should return array of string arrays', async() => {
      const table = await test.scrapeTable(page, 'tbody > tr', 'td');
      expect(table.length).toBeGreaterThan(0);
      expect(table[1].length).toBeGreaterThan(1);
      expect(table[1][0]).toEqual(expect.any(String));
    });
  });

  describe('scrapeController', () => {
    it('should return array of string arrays', async() => {
      const res = await scrapeController('https://codequiz.azurewebsites.net/', '', 'table');
      expect(res.length).toBeGreaterThan(0);
      expect(res[1].length).toBeGreaterThan(1);
      expect(res[1][0]).toEqual(expect.any(String));
    });
  });
});