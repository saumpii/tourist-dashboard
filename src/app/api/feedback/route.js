import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Feedback from '@/models/Feedback';
import classifyRating from '@/utils/classifyRating';


export async function POST(req) {
  try {
    const data = await req.json();
data.starRating = classifyRating(data.sentimentScore);
const feedback = await Feedback.create(data);
    return NextResponse.json({ success: true, feedback });
  } catch (err) {
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
