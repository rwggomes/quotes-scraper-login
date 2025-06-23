import fs from 'fs';
import path from 'path';

export const scrapePage = async (page) => {
  await page.waitForSelector('.quote');

  const quotes = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.quote')).map(quote => ({
      text: quote.querySelector('.text')?.innerText.trim() || '',
      author: quote.querySelector('.author')?.innerText.trim() || '',
      tags: Array.from(quote.querySelectorAll('.tag')).map(tag => tag.innerText.trim())
    }))
  );

  // OPTIONAL: download image logic (if there are any in future)
  // await page.$$eval('img', imgs => imgs.forEach(img => console.log(img.src)));

  return quotes;
};
