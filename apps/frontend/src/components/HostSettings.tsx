import React, { useState } from "react";
import "./HostSettings.css"; 

type HostSettingsType = {
  meeting_id: string;
  questionSource: "gemini" | "llama";
  numQuestions: number;
  type: "MCQ" | "True/False" | "Opinion Poll";
  difficulty: "easy" | "medium" | "hard";
};

const defaultSettings: HostSettingsType = {
  meeting_id: "",
  questionSource: "gemini",
  numQuestions: 3,
  type: "MCQ",
  difficulty: "medium",
};

export const HostSettings = () => {
  // State to hold the current settings for the host
  const [settings, setSettings] = useState<HostSettingsType>(defaultSettings);

  // Handle changes to any input/select field and update the settings state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  // Save the current settings to the backend server
  const saveSettings = async () => {
    try {
      const response = await fetch("http://localhost:5001/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        alert("Settings saved successfully!");
      } else {
        alert("Failed to save settings.");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Network error occurred.");
    }
  };

  return (
    <div className="host-settings-container">
      <h2>Host Question Settings</h2>

      {/* Input for Meeting ID */}
      <input
        type="text"
        name="meeting_id"
        value={settings.meeting_id}
        onChange={handleChange}
        placeholder="Meeting ID"
      />

      {/* Dropdown to select question source */}
      <select name="questionSource" value={settings.questionSource} onChange={handleChange}>
        <option value="gemini">Gemini API</option>
        <option value="llama">LLaMA 3.2</option>
      </select>

      {/* Input for number of questions */}
      <input
        type="number"
        name="numQuestions"
        value={settings.numQuestions}
        onChange={handleChange}
        placeholder="Number of Questions"
        min={1}
      />

      {/* Dropdown to select question type */}
      <select name="type" value={settings.type} onChange={handleChange}>
        <option value="MCQ">MCQ</option>
        <option value="True/False">True/False</option>
        <option value="Opinion Poll">Opinion Poll</option>
      </select>

      {/* Dropdown to select difficulty */}
      <select name="difficulty" value={settings.difficulty} onChange={handleChange}>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      {/* Button to save settings */}
      <button onClick={saveSettings}>Save Settings</button>
    </div>
  );
};
