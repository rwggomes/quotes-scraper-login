import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs';
import path from 'path';

import { loginIfNeeded } from './modules/login.js';
import { scrapePage } from './modules/scrapePage.js';
import { scrapeAuthors } from './modules/extractors/authors.js';
import { handlePagination } from './modules/pagination.js';
import { saveResults } from './modules/save.js';
import { setupLogger, logStart, logEnd, logInfo, logError } from './modules/logger.js';

puppeteer.use(StealthPlugin());

const argv = yargs(hideBin(process.argv))
  .option('target', {
    alias: 't',
    describe: 'Scraping target: quotes or authors',
    choices: ['quotes', 'authors'],
    default: 'quotes'
  })
  .option('limit', { alias: 'l', describe: 'Max pages to scrape', type: 'number', default: 3 })
  .option('delay', { alias: 'd', describe: 'Delay between pages (ms)', type: 'number', default: 1000 })
  .option('headless', { describe: 'Run browser in headless mode', type: 'boolean', default: true })
  .option('output', { describe: 'Path to output file', type: 'string' })
  .option('log', { describe: 'Log file', type: 'string', default: 'scraper.log' })
  .option('max-retries', { describe: 'Retry attempts per page', type: 'number', default: 2 })
  .option('assets', { describe: 'Folder to download images/assets (if any)', type: 'string', default: 'assets/' })
  .help()
  .argv;

// Setup output file and folders
if (!argv.output) {
  argv.output = `output/${argv.target}.json`;
}

fs.mkdirSync(argv.assets, { recursive: true });
fs.mkdirSync(path.dirname(argv.output), { recursive: true });

setupLogger(argv.log);

const run = async () => {
  const start = logStart();
  const baseUrl = 'https://quotes.toscrape.com/page/';
  let pagesScraped = 0;

  logInfo(`Starting to scrape "${argv.target}"`);
  logInfo(`Base URL: ${baseUrl}`);
  logInfo(`Output path: ${argv.output}`);

  const browser = await puppeteer.launch({ headless: argv.headless });
  const page = await browser.newPage();

  try {
    await loginIfNeeded(page, 'https://quotes.toscrape.com/login');

    const scrapeFn = argv.target === 'authors' ? scrapeAuthors : scrapePage;

    const results = await handlePagination(page, {
      baseUrl,
      delay: argv.delay,
      limit: argv.limit,
      maxRetries: argv['max-retries'],
      scrapeFn,
      onPageScraped: (i) => logInfo(`Finished loading page ${i}`)
    });

    await saveResults(results, 'json', '', argv.target, argv);


    logInfo(`Scraping complete. Total records: ${results.length}`);
  } catch (err) {
    logError(`Fatal error: ${err.message}`);
  } finally {
    await browser.close();
    logEnd(start);
  }
};

run();
