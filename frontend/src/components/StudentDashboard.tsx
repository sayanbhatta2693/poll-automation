// src/components/StudentDashboard.tsx
import React, { useState } from "react";

interface Poll {
  question: string;
  options: string[];
}
//activePoll will eventually come from the backend via an API.
const activePoll: Poll = {
  question: "Who developed the theory of relativity?",
  options: ["Newton", "Tesla", "Einstein", "Curie"],
};

const StudentDashboard: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (selectedOption) {
      setSubmitted(true);
      // In future: send to backend via Axios
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
      <div className="border rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">{activePoll.question}</h2>
        <ul className="space-y-2">
          {activePoll.options.map((option) => (
            <li key={option}>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="poll"
                  value={option}
                  checked={selectedOption === option}
                  onChange={() => handleSelect(option)}
                  className="form-radio text-blue-600"
                  disabled={submitted}
                />
                <span>{option}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!selectedOption}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          Submit Answer
        </button>
      ) : (
        <div className="text-green-600 font-semibold mt-4">Answer Submitted! ✅</div>
      )}
    </div>
  );
};

export default StudentDashboard;
