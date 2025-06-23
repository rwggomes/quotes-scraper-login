export const loginIfNeeded = async (page, loginUrl) => {
  await page.goto(loginUrl);
  const loginForm = await page.$('input[name="username"]');

  if (loginForm) {
    await page.type('input[name="username"]', 'admin');
    await page.type('input[name="password"]', 'admin');
    await Promise.all([
      page.click('input[type="submit"]'),
      page.waitForNavigation({ waitUntil: 'domcontentloaded' })
    ]);
  }
};
