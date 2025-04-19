import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Feedback from '@/models/Feedback';
import classifyRating from '../../../utils/classifyRating';
import { translateToEnglish } from '../../../utils/translateText';
import Sentiment from 'sentiment';
const sentiment = new Sentiment();


/*export async function POST(req) {
  try {
    const data = await req.json();
    //const { translatedText, detectedLanguage } = await translateToEnglish(data.content);
   // data.translatedText = translatedText;
    //data.language = detectedLanguage;
    data.translatedText = data.content;
    data.language = "en";
    data.starRating = classifyRating(data.sentimentScore);
    
    const feedback = await Feedback.create(data);
    return NextResponse.json({ success: true, feedback });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
  */
export async function POST(req) {
    console.log("🔁 API HIT: /api/feedback");
    try {
      await dbConnect();
      console.log("✅ Connected to MongoDB");
  
      const data = await req.json();
      console.log("📥 Received Data:", data);
  
      // TEMP: Bypass translation & rating
    //  const data = await req.json();
    const result = sentiment.analyze(data.content);
    const { translatedText, detectedLanguage } = await translateToEnglish(data.content);
        data.translatedText = translatedText;
        data.language = detectedLanguage;
        data.sentimentScore = result.comparative; // more normalized
        data.starRating = classifyRating(result.comparative);
         //data.starRating = 3;
  
      const feedback = await Feedback.create(data);
      console.log("✅ Feedback Saved:", feedback);
  
      return NextResponse.json({ success: true, feedback });
    } catch (err) {
      console.error("❌ Error:", err.message);
      return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
  }
  


export async function GET() {
  try {
    await dbConnect();
    const feedbackList = await Feedback.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, feedback: feedbackList });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
