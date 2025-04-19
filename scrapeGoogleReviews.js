const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const Sentiment = require('sentiment');
const Feedback = require('./src/models/Feedback');
require('dotenv').config();

const sentiment = new Sentiment();
const MONGODB_URI = process.env.MONGODB_URI;

async function scrapeReviews(searchTerm, city) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  console.log(`🔍 Searching: ${searchTerm}`);
  await page.goto(`https://www.google.com/maps/search/${encodeURIComponent(searchTerm)}`, {
    waitUntil: 'domcontentloaded',
  });

  await page.waitForSelector('.hfpxzc');
  await page.click('.hfpxzc');
  console.log("✅ Clicked first result");

  await new Promise((resolve) => setTimeout(resolve, 5000));

  // ✅ NEW: Use CSS + JS to find and click 'Reviews' button
  const reviewButtonHandle = await page.$$eval('span', (nodes) => {
    const target = nodes.find((n) =>
      n.textContent.toLowerCase().includes('review')
    );
    return target ? target.innerText : null;
  });

  if (reviewButtonHandle) {
    await page.evaluate((text) => {
      const node = Array.from(document.querySelectorAll('span')).find(
        (n) => n.textContent === text
      );
      if (node) node.click();
    }, reviewButtonHandle);

    console.log("📝 Opened reviews section");
    await new Promise((resolve) => setTimeout(resolve, 5000));
  } else {
    console.log("❌ Could not find review button");
    await browser.close();
    return [];
  }

  // ✅ Wait and scroll the review container
  try {
    await page.waitForSelector('.m6QErb.DxyBCb.kA9KIf.dS8AEf', { timeout: 30000 });
    console.log("✅ Found scroll container");

    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => {
        const el = document.querySelector('.m6QErb.DxyBCb.kA9KIf.dS8AEf');
        if (el) el.scrollBy(0, 500);
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } catch (err) {
    console.error("❌ Couldn't scroll reviews:", err.message);
    await browser.close();
    return [];
  }

  // ✅ Extract visible review text
  const reviews = await page.$$eval('.jftiEf', (nodes) =>
    nodes.map((node) => node.querySelector('.wiI7pd')?.innerText || '').filter(Boolean)
  );

  console.log(`✅ Scraped ${reviews.length} reviews`);
  await browser.close();

  return reviews.map((content) => ({
    content,
    source: 'google',
    city,
    location: { lat: 15.5439, lng: 73.7553 }, // Calangute
  }));
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB");

  const reviews = await scrapeReviews('Calangute beach reviews', 'Calangute');

  for (const item of reviews) {
    const score = sentiment.analyze(item.content).comparative;

    const entry = new Feedback({
      ...item,
      sentimentScore: score,
      starRating:
        score >= 0.7 ? 5 :
        score >= 0.4 ? 4 :
        score >= 0.1 ? 3 :
        score >= -0.2 ? 2 : 1,
      translatedText: item.content,
      language: 'en',
    });

    await entry.save();
    console.log(`📝 Saved: ${item.content.substring(0, 50)}... → ★${entry.starRating}`);
  }

  await mongoose.disconnect();
  console.log("✅ Done and disconnected from MongoDB");
}

run();
