// apps/frontend/src/components/GuestRecorder.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MicrophoneStreamer } from '../utils/microphoneStream';
import type { TranscriptionResult } from '@shared/types';
import '../../App.css'; // Assuming you have some basic CSS in App.css

interface GuestRecorderProps {
  setTranscriptions?: (results: TranscriptionResult[]) => void;
}

// WebSocket URL for guest transcription (update as needed for deployment)
const GUEST_WEBSOCKET_URL = 'ws://localhost:3000';

const GuestRecorder: React.FC<GuestRecorderProps> = ({ setTranscriptions }) => {
    // Get meetingId and displayName from URL query parameters
    const [searchParams] = useSearchParams();
    const meetingId = searchParams.get('meetingId') || 'default-meeting';
    const displayName = searchParams.get('displayName') || 'GuestSpeaker'; // Use displayName for user-friendly name
    
    // State for recording status, UI, and transcriptions
    const [isRecording, setIsRecording] = useState(false);
    const [status, setStatus] = useState('Idle');
    const [lastTranscription, setLastTranscription] = useState('');
    const streamerRef = useRef<MicrophoneStreamer | null>(null);

    // Cleanup streamer on component unmount
    useEffect(() => {
        return () => {
            if (streamerRef.current) {
                streamerRef.current.stop();
            }
        };
    }, []);

    // State to store all transcription results
    const [transcripts, setTranscripts] = useState<TranscriptionResult[]>([]);

    // Handler for receiving new transcription results
    const handleTranscription = (result: TranscriptionResult) => {
      setLastTranscription(result.text);
      setTranscripts(prev => {
        const updated = [...prev, result];
        setTranscriptions?.(updated); // Send up to parent if provided
        return updated;
      });

      console.log(`[Guest] Transcription: ${result.speaker}: ${result.text}`);
    };

    // Handler for status updates from the streamer
    const handleStatus = (message: string) => {
        setStatus(message);
    };

    // Handler for errors during streaming
    const handleError = (error: string) => {
        setStatus(`Error: ${error}`);
        console.error('[Guest] Streamer Error:', error);
        setIsRecording(false);
    };

    // Handler for when the audio stream ends
    const handleStreamEnd = () => {
        setIsRecording(false);
        setStatus('Recording stopped.');
        console.log('[Guest] Stream ended.');
    };

    // Start recording and streaming audio to backend
    const startRecording = async () => {
        if (isRecording) return;

        setStatus('Starting...');
        setLastTranscription('');

        // Ensure cleanup if previous streamer instance exists
        if (streamerRef.current) {
            streamerRef.current.stop(); // This will also call cleanup
            streamerRef.current = null;
        }

        // Create a new MicrophoneStreamer instance
        streamerRef.current = new MicrophoneStreamer({
            websocketUrl: GUEST_WEBSOCKET_URL,
            meetingId: meetingId,
            proposedSpeakerName: displayName, // Send display name to backend
            onTranscription: handleTranscription,
            onStatus: handleStatus,
            onError: handleError,
            onStreamEnd: handleStreamEnd,
        });

        try {
            await streamerRef.current.start();
            setIsRecording(true);
            setStatus('Recording...');
        } catch (err) {
            console.error('Failed to start recording:', err);
            setStatus(`Failed to start: ${err instanceof Error ? err.message : String(err)}`);
            setIsRecording(false);
        }
    };

    // Stop recording and streaming
    const stopRecording = () => {
        if (!isRecording) return;
        if (streamerRef.current) {
            streamerRef.current.stop();
            streamerRef.current = null;
        }
        setIsRecording(false);
        setStatus('Stopping...');
    };

    return (
        <div className="guest-recorder-container">
            <h1>Guest Voice Input</h1>
            <p>Meeting ID: <strong>{meetingId}</strong></p>
            <p>Your Display Name: <strong>{displayName}</strong></p>
            <p>Status: <span className={isRecording ? 'status-active' : 'status-idle'}>{status}</span></p>
            
            <div className="button-group">
                {/* Start/Stop recording buttons */}
                <button onClick={startRecording} disabled={isRecording}>
                    Start Recording
                </button>
                <button onClick={stopRecording} disabled={!isRecording}>
                    Stop Recording
                </button>
            </div>
            
            {/* Display the last transcription result */}
            {lastTranscription && (
                <div className="transcription-display">
                    <h3>Last Spoken:</h3>
                    <p>{lastTranscription}</p>
                </div>
            )}
            
            <p className="note">
                Ensure microphone access is granted in your browser. Audio is streamed live for transcription.
            </p>
        </div>
    );
};

export default GuestRecorder;