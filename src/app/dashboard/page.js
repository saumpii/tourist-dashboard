'use client';

import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/feedback');
      const data = await res.json();
      if (data.success) {
        setFeedback(data.feedback);
      }
    }
    fetchData();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tourist Feedback Dashboard</h1>
      <table className="min-w-full text-sm border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Source</th>
            <th className="p-2 border">Content</th>
            <th className="p-2 border">City</th>
            <th className="p-2 border">Rating</th>
            <th className="p-2 border">Date</th>
          </tr>
        </thead>
        <tbody>
          {feedback.map((item, i) => (
            <tr key={i}>
              <td className="p-2 border">{item.source}</td>
              <td className="p-2 border">{item.translatedText}</td>
              <td className="p-2 border">{item.city}</td>
              <td className="p-2 border">{item.starRating}</td>
              <td className="p-2 border">{new Date(item.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
