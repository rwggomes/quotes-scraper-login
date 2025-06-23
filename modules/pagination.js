import { logInfo, logError } from './logger.js';
import { retry } from './retry.js';

export const handlePagination = async (page, { baseUrl, delay, limit, maxRetries, scrapeFn }) => {
  const results = [];

  for (let i = 1; i <= limit; i++) {
    const url = `${baseUrl}${i}/`;
    logInfo(`Scraping page ${i}: ${url}`);

    try {
      const data = await retry(() => scrapeFnWithNavigation(page, url, scrapeFn), maxRetries);
      if (!data.length) break;
      results.push(...data);
    } catch (err) {
      logError(`Failed to scrape page ${i}: ${err.message}`);
    }

    await new Promise(res => setTimeout(res, delay));
  }

  return results;
};

const scrapeFnWithNavigation = async (page, url, fn) => {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  return fn(page);
};
