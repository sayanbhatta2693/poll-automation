// src/components/TeacherDashboard.tsx
import React, { useState } from "react";

interface PollOption {
  question: string;
  options: string[];
  answer: string;
}
//Replace dummyPolls with real AI-generated data from the backend later.
const generatedPolls: PollOption[] = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    answer: "Paris",
  },
  {
    question: "Who developed the theory of relativity?",
    options: ["Newton", "Tesla", "Einstein", "Curie"],
    answer: "Einstein",
  },
  {
    question: "What is the boiling point of water?",
    options: ["90°C", "95°C", "100°C", "105°C"],
    answer: "100°C",
  },
];

const TeacherDashboard = () => {
  const [selectedPollIndex, setSelectedPollIndex] = useState<number | null>(null);
  const [sentPoll, setSentPoll] = useState<PollOption | null>(null);

  const handleManualSend = () => {
    if (selectedPollIndex !== null) {
      setSentPoll(generatedPolls[selectedPollIndex]);
    }
  };

  const handleRandomSend = () => {
    const randomIndex = Math.floor(Math.random() * generatedPolls.length);
    setSentPoll(generatedPolls[randomIndex]);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Teacher Dashboard</h1>
      <p className="font-semibold mb-6">Meeting ID: <span className="text-gray-700">ABC123</span></p>

      <div className="grid gap-4 mb-8">
        {generatedPolls.map((poll, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl border cursor-pointer ${
              selectedPollIndex === index ? "border-blue-500 shadow-md" : "border-gray-200"
            }`}
            onClick={() => setSelectedPollIndex(index)}
          >
            <p className="font-semibold text-lg mb-2">{poll.question}</p>
            <ul className="list-disc list-inside">
              {poll.options.map((opt, i) => (
                <li key={i} className={opt === poll.answer ? "text-green-600 font-bold" : ""}>
                  {opt}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleManualSend}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl disabled:opacity-50"
          disabled={selectedPollIndex === null}
        >
          Send Selected Poll
        </button>
        <button
          onClick={handleRandomSend}
          className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-xl"
        >
          Send Random Poll
        </button>
      </div>

      {sentPoll && (
        <div className="mt-8 p-4 bg-green-50 border border-green-400 rounded-xl">
          <h3 className="text-green-700 font-semibold mb-2">Poll Sent:</h3>
          <p className="font-medium">{sentPoll.question}</p>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
