import React, { useState, useRef } from 'react';

const TextToSpeechWithMic = () => {
  const [recording, setRecording] = useState(false);
  const [apiResponse, setApiResponse] = useState('');
  const mediaRecorderRef = useRef(null); // Reference to the media recorder
  const API_TOKEN = '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'; // Replace with your actual API token
  const apiUrl = 'https://api-inference.huggingface.co/models/m3hrdadfi/wav2vec2-large-xlsr-georgian'; // Replace with your API endpoint

  const handleStartRecording = () => {
    setRecording(true);
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder; // Store the media recorder in the ref

        const audioChunks = [];
        mediaRecorder.addEventListener('dataavailable', (event) => {
          audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener('stop', () => {
          const audioBlob = new Blob(audioChunks);
          sendAudioToApi(audioBlob);
        });

        mediaRecorder.start();
      })
      .catch((error) => {
        console.error('Error accessing the microphone:', error);
      });
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const sendAudioToApi = (audioBlob) => {
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
      body: audioBlob,
    })
      .then((response) => response.json())
      .then((result) => {
        setApiResponse(JSON.stringify(result));
      })
      .catch((error) => {
        console.error('Error sending audio to API:', error);
      });
  };

  return (
    <div>
      <button onClick={handleStartRecording} disabled={recording}>
        {recording ? 'Recording...' : 'Start Recording'}
      </button>
      <button onClick={handleStopRecording} disabled={!recording}>
        Stop Recording
      </button>
      <div>{apiResponse}</div>
    </div>
  );
};

export default TextToSpeechWithMic;
