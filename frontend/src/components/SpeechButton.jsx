import React, { useState, useEffect } from 'react';
import AudioIcon from "../assets/icons/audio-fill.svg";
import AudioCurrentIcon from "../assets/icons/audio.svg";


const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'en-US';
  recognition.interimResults = false;
}

const SpeechButton = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (!recognition) return;

    const handleResult = (event) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript); // Call the callback function with the transcript
      setIsListening(false);
    };

    recognition.onresult = handleResult;

    if (isListening) {
      recognition.start();
    }

    return () => {
      recognition.stop();
    };
  }, [isListening, onTranscript]);

  const toggleListen = () => setIsListening(prevState => !prevState);

  if (!SpeechRecognition) {
    return <p>Your browser does not support Speech Recognition.</p>;
  }

  return (
      <button onClick={toggleListen}>
        {isListening ? 
            <img src={AudioCurrentIcon} alt="click button for audio input"></img> : <img src={AudioIcon} alt="click button for audio input"></img>
        }
        </button>
  );
};

export default SpeechButton;
