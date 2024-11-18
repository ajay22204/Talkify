import React, { useState, useEffect } from "react";
import axios from "axios";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { HiSpeakerWave } from "react-icons/hi2";
import { FaStopCircle, FaSun, FaMoon } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import LanguagesSelect from "./LanguagesSelect";
import "../index.css";

const Talkify = () => {
  const navigate = useNavigate();
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("es");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const { transcript, listening, browserSupportsSpeechRecognition, resetTranscript } = useSpeechRecognition();


  useEffect(() => {
    if (transcript) {
      setSourceText(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/api/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(response.data.history);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchHistory();
  }, []);

  const handleTranslate = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/api/translate",
        { text: sourceText, sourceLang, targetLang },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTranslatedText(response.data.translatedText);
      setHistory((prevHistory) => [...prevHistory, response.data]);
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeechToText = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      resetTranscript();
    } else {
      SpeechRecognition.startListening();
    }
  };

  const handleTextToSpeech = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(translatedText);
      utterance.lang = targetLang;
      speechSynthesis.speak(utterance);
    } else {
      console.error("Speech synthesis not supported");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
    document.body.classList.toggle("light", theme === "light");
  }, [theme]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className={`flex flex-col py-10 justify-center items-center min-h-screen bg-gradient-to-r ${theme === "dark" ? "from-gray-800 via-purple-800 to-gray-900" : "from-gray-100 to-gray-300"} text-white`}>
      <div className="p-8 bg-gray-800/60 rounded-lg shadow-lg w-full max-w-2xl space-y-6 border-2 border-purple-500 backdrop-blur-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold glow-text">Talkify - Translate & Speak</h1>
          <div className="flex items-center space-x-4">
            <button onClick={toggleTheme} className="text-2xl text-purple-300">
              {theme === "dark" ? <FaSun /> : <FaMoon />}
            </button>
            <button onClick={handleLogout} className="text-sm font-semibold text-purple-300 underline">
              Logout
            </button>
          </div>
        </div>
        <textarea
          placeholder="Enter text to translate"
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          className={`w-full p-4 rounded bg-gray-700 text-white resize-none h-32 placeholder-gray-300 ${theme === "dark" ? "border-gray-500" : "border-gray-300"}`}
        />
        <div className="flex flex-col md:flex-row justify-between space-y-4 space-x-4 md:space-y-0">
          <select
            onChange={(e) => setSourceLang(e.target.value)}
            value={sourceLang}
            className={`w-full md:w-1/2 p-3 bg-gray-700 text-white rounded border ${theme === "dark" ? "border-purple-500" : "border-gray-500"}`}
          >
            <LanguagesSelect />
          </select>
          <select
            onChange={(e) => setTargetLang(e.target.value)}
            value={targetLang}
            className={`w-full md:w-1/2 p-3 bg-gray-700 text-white rounded border ${theme === "dark" ? "border-purple-500" : "border-gray-500"}`}
          >
            <LanguagesSelect />
          </select>
        </div>
        <button
          onClick={handleTranslate}
          className={`w-full py-2 rounded font-semibold transition transform hover:scale-105 ${theme === "dark" ? "bg-purple-600 hover:bg-purple-500" : "bg-purple-700 hover:bg-purple-600"} text-white`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3 border-t-2 border-white rounded-full" viewBox="0 0 24 24"></svg>
              Translating...
            </span>
          ) : (
            "Translate"
          )}
        </button>
        <div>
          <label className="block font-semibold mb-2 text-purple-300">Translated Text:</label>
          <textarea
            value={translatedText}
            readOnly
            className={`w-full p-4 rounded bg-gray-700 text-white resize-none h-32 placeholder-gray-300 ${theme === "dark" ? "border-gray-500" : "border-gray-300"}`}
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(translatedText).then(() => {
                alert("Copied to clipboard!");
              }).catch((err) => {
                console.error("Failed to copy text: ", err);
              });
            }}
            className={`mt-3 w-full py-2 rounded font-semibold transition transform hover:scale-105 ${theme === "dark" ? "bg-purple-600 hover:bg-purple-500" : "bg-purple-700 hover:bg-purple-600"} text-white`}
          >
            Copy to Clipboard
          </button>
        </div>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-5 justify-between">
          <button
            onClick={handleTextToSpeech}
            className={`w-full md:w-1/2 py-2 rounded font-semibold transition transform hover:scale-105 ${theme === "dark" ? "bg-purple-600 hover:bg-purple-500" : "bg-purple-700 hover:bg-purple-600"} text-white`}
          >
            Play Translated Text
          </button>
          <button
            aria-label="Toggle listening"
            onClick={handleSpeechToText}
            className={`w-full md:w-1/2 py-2 rounded font-semibold transition transform hover:scale-105 ${theme === "dark" ? "bg-purple-600 hover:bg-purple-500" : "bg-purple-700 hover:bg-purple-600"} text-white flex items-center justify-center`}
          >
            {listening ? (
              <>
                <FaStopCircle className="mr-2" />
                Stop Listening
              </>
            ) : (
              <>
                <HiSpeakerWave className="mr-2" />
                Start Listening
              </>
            )}
          </button>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-purple-300">Translation History</h2>
          <ul className="space-y-3">
            {history.map((entry, index) => (
              <li key={index} className="p-3 bg-gray-700 rounded-lg">
                <p><span className="font-semibold">Original:</span> {entry.originalText}</p>
                <p><span className="font-semibold">Translation:</span> {entry.translatedText}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Talkify;
