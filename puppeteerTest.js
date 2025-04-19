const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.google.com');

  const elements = await page.$$eval('a', (nodes) =>
    nodes.filter((n) => n.textContent.includes('About'))
  );

  console.log("✅ Found elements:", elements.length);
  await browser.close();
})();
