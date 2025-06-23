export const scrapeAuthors = async (page) => {
  await page.waitForSelector('.quote');

  const authors = await page.evaluate(() => {
    const names = Array.from(document.querySelectorAll('.quote .author'))
      .map(el => el.innerText.trim());

    // Remove duplicates
    return Array.from(new Set(names)).map(name => ({ author: name }));
  });

  return authors;
};
