'use client';

import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [feedback, setFeedback] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [cityFilter, setCityFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('/api/feedback');
      const data = await res.json();
      if (data.success) {
        setFeedback(data.feedback);
        setFiltered(data.feedback);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const filteredData = feedback.filter((item) => {
      const matchCity = cityFilter ? item.city?.toLowerCase().includes(cityFilter.toLowerCase()) : true;
      const matchStart = startDate ? new Date(item.createdAt) >= new Date(startDate) : true;
      const matchEnd = endDate ? new Date(item.createdAt) <= new Date(endDate) : true;
      return matchCity && matchStart && matchEnd;
    });
    setFiltered(filteredData);
  }, [cityFilter, startDate, endDate, feedback]);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tourist Feedback Dashboard</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Filter by city"
          className="p-2 border rounded"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
        />
        <input
          type="date"
          className="p-2 border rounded"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="p-2 border rounded"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {/* Table */}
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
          {filtered.map((item, i) => (
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
