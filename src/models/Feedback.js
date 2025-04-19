import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  source: String,
  content: String,
  language: String,
  translatedText: String,
  sentimentScore: Number,
  starRating: Number,
  city: String,
  location: {
    lat: Number,
    lng: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema);
