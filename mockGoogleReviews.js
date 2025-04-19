require('dotenv').config();

const mongoose = require('mongoose');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

const Feedback = require('./src/models/Feedback');

const MONGODB_URI = process.env.MONGODB_URI;

async function run() {
  await mongoose.connect(MONGODB_URI);

  const mockReviews = [
    {
      content: "Beautiful beach, crystal clear water, and friendly locals.",
      source: "google",
      city: "Palolem",
      location: { lat: 15.0096, lng: 74.0236 }
    },
    {
      content: "Overcrowded and not very clean. Disappointing visit.",
      source: "google",
      city: "Calangute",
      location: { lat: 15.5439, lng: 73.7553 }
    },
    {
      content: "Excellent food stalls nearby and great vibes overall!",
      source: "google",
      city: "Anjuna",
      location: { lat: 15.5800, lng: 73.7350 }
    }
  ];

  for (const item of mockReviews) {
    const score = sentiment.analyze(item.content).comparative;

    const newReview = new Feedback({
      ...item,
      sentimentScore: score,
      starRating: score >= 0.7 ? 5 : score >= 0.4 ? 4 : score >= 0.1 ? 3 : score >= -0.2 ? 2 : 1,
      translatedText: item.content,
      language: "en",
    });

    await newReview.save();
    console.log("✅ Saved:", newReview.city, newReview.starRating);
  }

  await mongoose.disconnect();
}

run();
