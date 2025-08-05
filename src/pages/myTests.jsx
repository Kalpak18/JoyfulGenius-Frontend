// src/pages/MyTests.jsx
import { useEffect, useState } from "react";
import api from "../utils/axios";
import Header from "../components/Header";

const MyTests = () => {
  const [tests, setTests] = useState([]);
  const [error, setError] = useState("");

  const fetchTests = async () => {
    try {
      const res = await api.get("/test-results/my");
      setTests(res.data);
    } catch (err) {
      console.error("Failed to fetch test history", err);
      setError("Failed to load test history. Please try again later.");
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto p-4">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">📊 My Test History</h2>
        {error && <p className="text-center text-red-600">{error}</p>}

        {tests.length === 0 ? (
          <p className="text-center text-gray-600">No tests attempted yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tests.map((test, index) => (
              <div key={index} className="bg-white shadow-md p-4 rounded">
                <h3 className="text-lg font-bold text-blue-600">{test.testName || `${test.subject} - ${test.chapter}`}</h3>
                <p><strong>Score:</strong> {test.score} / {test.totalQuestions}</p>
                <p><strong>Date:</strong> {new Date(test.attemptedAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </main>
      <footer className="bg-gray-800 text-white text-center p-4 mt-8">
        <p>&copy; 2024 NMMS Prep. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MyTests;
