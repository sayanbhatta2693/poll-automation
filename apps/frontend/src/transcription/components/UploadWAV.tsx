import React, { useState, useRef } from "react";
import { MicrophoneStreamer } from "../utils/microphoneStream";
import type { TranscriptionResult } from "@shared/types";

// Main component for live transcription using the host's microphone
const LiveTranscriptionComponent: React.FC = () => {
  // State to store all transcribed text segments
  const [transcriptions, setTranscriptions] = useState<string[]>([]);
  // State to track if recording is active
  const [isRecording, setIsRecording] = useState(false);
  // State to display current status (Idle, Connecting, Error, etc.)
  const [status, setStatus] = useState("Idle");
  // Ref to hold the MicrophoneStreamer instance
  const streamerRef = useRef<MicrophoneStreamer | null>(null);

  // Meeting and speaker identifiers (replace with dynamic values as needed)
  const meetingId = "live_meeting_123";
  const speaker = "Host";

  // Handler for receiving transcription results from the backend
  const handleTranscription = (data: TranscriptionResult) => {
    console.log("Received transcription:", data.text);
    setTranscriptions((prev) => [...prev, data.text]);
    // You can also trigger poll generation based on keywords here
  };

  // Handler for when the audio stream ends
  const handleStreamEnd = () => {
    console.log("Live stream ended.");
    setIsRecording(false);
    setStatus("Idle");
  };

  // Handler for errors during streaming
  const handleError = (error: Error | Event | unknown) => {
    console.error("Streaming error:", error);
    setIsRecording(false);
    setStatus("Error");
  };

  // Starts the microphone stream and connects to the backend WebSocket
  const startRecording = async () => {
    setTranscriptions([]);
    setStatus("Connecting...");
    streamerRef.current = new MicrophoneStreamer({
      websocketUrl: "ws://localhost:3000", // Backend WebSocket URL
      meetingId: meetingId,
      proposedSpeakerName: speaker,
      onTranscription: handleTranscription,
      onStatus: (msg) => {
        console.log("Status:", msg);
        setStatus(msg); // Update live status
      },
      onError: (err) => handleError(err),
      onStreamEnd: handleStreamEnd,
    });

    await streamerRef.current.start();
    setIsRecording(true);
  };

  // Stops the microphone stream and updates UI state
  const stopRecording = () => {
    streamerRef.current?.stop();
    setIsRecording(false);
    setStatus("Stopped");
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "600px", margin: "auto" }}>
      <h1>🎙️ Live Host Transcription</h1>
      {/* Display current status */}
      <p>Status: <strong>{status}</strong></p>
      {/* Start/Stop buttons */}
      <button onClick={startRecording} disabled={isRecording}>
        Start Speaking
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Speaking
      </button>
      <div>
        <h2>Transcriptions:</h2>
        {/* Show message if no transcriptions yet */}
        {transcriptions.length === 0 && (
          <p>No speech detected yet or recording not started.</p>
        )}
        {/* Render each transcribed text */}
        {transcriptions.map((text, index) => (
          <p key={index}>{text}</p>
        ))}
      </div>
    </div>
  );
};

export default LiveTranscriptionComponent;
