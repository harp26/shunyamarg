'use client';
import { useState, useEffect, useRef } from 'react';
import { Play, Square, Volume2 } from 'lucide-react';

export default function TTSPlayer({ textToRead, onFinished, activeCardId }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [lang, setLang] = useState('en-IN');
  const [supported, setSupported] = useState(true);
  const [status, setStatus] = useState('');
  const utterRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!window.speechSynthesis) {
        setSupported(false);
      } else {
        // Pre-fetch voices for mobile/Safari compatibility
        window.speechSynthesis.getVoices();
        if ('onvoiceschanged' in window.speechSynthesis) {
          window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
          };
        }
      }
    }
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Stop reading if card ID changes
  useEffect(() => {
    if (isPlaying) {
      stopSpeech();
    }
  }, [activeCardId]);

  const startSpeech = () => {
    if (!supported) return;
    stopSpeech();

    if (!textToRead) {
      setStatus('Nothing to read');
      return;
    }

    // Strip HTML tags and clean formatting
    const cleanText = textToRead
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang;
    utterance.rate = 0.92;
    utterance.pitch = 1;

    // Pick best matching voice
    const voices = window.speechSynthesis.getVoices();
    const voiceMatch = voices.find(v => v.lang === lang) || 
                       voices.find(v => v.lang.startsWith(lang.split('-')[0]));
    if (voiceMatch) {
      utterance.voice = voiceMatch;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setStatus('Narrating...');
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setStatus('');
      if (onFinished) {
        onFinished();
      }
    };

    utterance.onerror = (e) => {
      setIsPlaying(false);
      const isBrave = navigator.brave !== undefined || navigator.userAgent.includes("Brave");
      if (isBrave) {
        setStatus('Brave blocks TTS — enable in settings');
      } else {
        setStatus('TTS error — try Chrome');
      }
      console.error('SpeechSynthesis error:', e);
    };

    utterRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    setIsPlaying(false);
    setStatus('');
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const handleLangChange = (e) => {
    const newLang = e.target.value;
    setLang(newLang);
    if (isPlaying) {
      // Re-trigger speech with the new voice language
      setTimeout(() => {
        startSpeech();
      }, 150);
    }
  };

  return (
    <div className="flex items-center gap-3 bg-stone-100 dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 p-2 rounded-md max-w-xs transition-colors">
      <button
        onClick={isPlaying ? stopSpeech : startSpeech}
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          isPlaying 
            ? 'bg-rose-700 hover:bg-rose-800 text-white' 
            : 'bg-amber-600 hover:bg-amber-700 text-white'
        }`}
        title={isPlaying ? 'Stop narrating' : 'Narrate card'}
        disabled={!supported}
      >
        {isPlaying ? <Square size={13} fill="white" /> : <Play size={13} fill="white" className="translate-x-[1px]" />}
      </button>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between gap-1 leading-none mb-1">
          <span className="text-[9px] uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400">
            Audio Voice
          </span>
          {status && (
            <span className="text-[9px] text-amber-600 dark:text-amber-500 font-medium truncate max-w-[120px]">
              {status}
            </span>
          )}
        </div>
        <select
          value={lang}
          onChange={handleLangChange}
          className="bg-transparent text-stone-800 dark:text-stone-200 font-sans text-xs outline-none border-none cursor-pointer p-0"
          disabled={!supported}
        >
          <option value="en-IN" className="bg-stone-50 dark:bg-zinc-950 text-stone-800 dark:text-stone-200">English (India)</option>
          <option value="en-US" className="bg-stone-50 dark:bg-zinc-950 text-stone-800 dark:text-stone-200">English (US)</option>
          <option value="en-GB" className="bg-stone-50 dark:bg-zinc-950 text-stone-800 dark:text-stone-200">English (UK)</option>
          <option value="hi-IN" className="bg-stone-50 dark:bg-zinc-950 text-stone-800 dark:text-stone-200">Hindi Voice (reads Eng)</option>
        </select>
      </div>
    </div>
  );
}
