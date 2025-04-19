const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.google.com/maps/search/Calangute+Beach');

  const elements = await page.$x("//span[contains(text(), 'reviews') or contains(text(), 'Review')]");
  console.log("✅ Found:", elements.length);
  await browser.close();
})();
