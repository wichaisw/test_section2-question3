const { argv } = require('process');
const { TABLE_EL } = require('./utils/constants.js');
const { scrapeController } = require('./services/element-scrapper.js');
const { extractNavFromSymbol } = require('./services/data-cleaner.js');


let scriptArg = argv[2];
if(!scriptArg) {
  console.log('please insert a fund name')
  process.exit();
}

(async function waitForScraper() {
  // node support top-level await since v14
  const data = await scrapeController('https://codequiz.azurewebsites.net/', '', TABLE_EL);
  const res = extractNavFromSymbol(data, scriptArg);
  console.log(res);
})();
