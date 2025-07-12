// App.tsx
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { UploadWAV, TranscriptListener, MicSettingsManager, GuestRecorder } from './transcription';
import { HostSettings } from './components/HostSettings';
import type { TranscriptionResult } from '@shared/types';
import './App.css';

// Home page for generating guest invitation links
function HomePage() {
  const [meetingId, setMeetingId] = useState('');
  const [guestId, setGuestId] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  // Generates a unique guest link using a random UUID
  const generateLink = () => {
    if (!meetingId) return;
    const id = crypto.randomUUID();
    setGuestId(id);
    const link = `/guest?meetingId=${encodeURIComponent(meetingId)}&displayName=${encodeURIComponent(id)}`;
    setGeneratedLink(link);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to Audio Transcription App</h1>
      <nav style={{ margin: '20px' }}>
        <Link to="/host" style={{ marginRight: '20px' }}>Host Interface</Link>
        <Link to="/">Home</Link>
      </nav>
      <p>Enter Meeting ID to generate a unique guest invitation link:</p>
      <input
        type="text"
        placeholder="Meeting ID"
        value={meetingId}
        onChange={(e) => setMeetingId(e.target.value)}
        style={{ padding: '10px', marginRight: '10px', borderRadius: '4px' }}
      />
      <button
        onClick={generateLink}
        style={{
          padding: '10px 20px',
          fontSize: '1em',
          backgroundColor: '#28a745',
          color: 'white',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        Generate Guest Invitation Link
      </button>

      {/* Show the generated guest link and ID */}
      {generatedLink && (
        <div style={{ marginTop: '30px' }}>
          <p style={{ color: '#fff' }}>Guest ID: <code>{guestId}</code></p>
          <a href={generatedLink} target="_blank" rel="noopener noreferrer" style={{ color: '#61dafb' }}>
            {window.location.origin + generatedLink}
          </a>
        </div>
      )}
    </div>
  );
}

// Host page for uploading audio, managing mic, and viewing transcripts
function HostPage() {
  return (
    <div className="p-4 space-y-8">
      <section>
        <h1 className="text-2xl font-bold mb-4">Audio Upload</h1>
        <UploadWAV />
        <MicSettingsManager
          meetingId="meeting123"
          speaker="host"
          onTranscription={(data) => console.log("Transcription:", data)}
          onStreamEnd={() => console.log("Stream ended")}
          onError={(err) => console.error("Error:", err)}
        />
      </section>

      <section>
        <HostSettings />
      </section>

      <section>
        <TranscriptListener />
      </section>
    </div>
  );
}

// Main app component with routing and guest transcript display
function MergedApp() {
  const [guestTranscripts, setGuestTranscripts] = useState<TranscriptionResult[]>([]);

  return (
    <Router>
      <Routes>
        {/* Home route */}
        <Route path="/" element={<HomePage />} />
        {/* Host interface route */}
        <Route path="/host" element={<HostPage />} />
        {/* Guest recorder route */}
        <Route path="/guest" element={<GuestRecorder setTranscriptions={setGuestTranscripts} />} />
        {/* Fallback for unknown routes */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>

      {/* Display live guest transcriptions if available */}
      {guestTranscripts.length > 0 && (
        <div style={{ padding: '1rem', background: '#111', color: 'white' }}>
          <h2>Live Guest Transcription</h2>
          <ul>
            {guestTranscripts.map((t, i) => (
              <li key={i}>
                <strong>{t.speaker}</strong>: {t.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Router>
  );
}

export default MergedApp;
