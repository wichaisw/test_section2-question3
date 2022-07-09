import { argv } from 'process';
import { TABLE_EL } from './utils/constants.js';
import { scrapeController } from './services/element-scrapper.js';
import { extractNavFromSymbol } from './services/data-cleaner.js';

let scriptArg = argv[2];
if(!scriptArg) {
  console.log('please insert a fund name')
  process.exit();
}

// node support top-level await since v14
const data = await scrapeController('https://codequiz.azurewebsites.net/', '', TABLE_EL, scriptArg);

const res = extractNavFromSymbol(data, scriptArg);
console.log(res);