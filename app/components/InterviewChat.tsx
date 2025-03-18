'use client';
import { useState, useRef, useEffect } from 'react';
import { useInterview } from '../context/InterviewContext';

interface InterviewChatProps {
  onComplete: () => void;
}

export default function InterviewChat({ onComplete }: InterviewChatProps) {
  const { interviewState, sendMessage, completeInterview } = useInterview();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showQuestions, setShowQuestions] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const mainVideoContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionStartedRef = useRef<boolean>(false);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const lastSpeechTimeRef = useRef<number>(Date.now());
  const speechStartTimeRef = useRef<number>(0);

  // Silence threshold in milliseconds - increased for more natural conversation
  const SILENCE_THRESHOLD = 2500;
  // Punctuation threshold - increased to allow for natural pauses
  const PUNCTUATION_THRESHOLD = 1500;
  // Minimum speech duration before considering processing
  const MIN_SPEECH_DURATION = 1000;

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [interviewState.messages]);

  // Initialize video stream and speech recognition
  useEffect(() => {
    startVideoStream();
    initializeSpeechRecognition();

    // Initialize voices when component mounts
    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };

    loadVoices();
    // Some browsers need this event to load voices
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      stopVideoStream();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.onvoiceschanged = null;
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, []);

  // Speak the AI message when it's received
  useEffect(() => {
    const messages = interviewState.messages;
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant' && !isAISpeaking) {
        speakMessage(lastMessage.content);
      }
    }
  }, [interviewState.messages]);

  // Handle interview completion
  useEffect(() => {
    if (interviewState.isInterviewComplete) {
      // Stop speech recognition and video when interview completes
      if (recognitionRef.current && recognitionStartedRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.log('❌ Error stopping recognition:', error);
        }
      }

      // Re-enable all keyboard inputs
      // const inputs = document.querySelectorAll('input, textarea, button');
      // inputs.forEach((element: HTMLElement) => {
      //   element.removeAttribute('disabled');
      // });


      const inputs = document.querySelectorAll('input, textarea, button');
      inputs.forEach((element) => {
        (element as HTMLElement).removeAttribute('disabled');
      });


      // Delay before showing results
      setTimeout(() => {
        onComplete();
      }, 3000);
    }
  }, [interviewState.isInterviewComplete, onComplete]);

  // Add tab switching prevention
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && interviewState.isInterviewStarted && !interviewState.isInterviewComplete) {
        // Show warning when user tries to switch tabs
        alert('Please do not switch tabs during the interview!');
      }
    };

    // Only add the event listener if the interview is active
    if (interviewState.isInterviewStarted && !interviewState.isInterviewComplete) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      // Clean up the event listener
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [interviewState.isInterviewStarted, interviewState.isInterviewComplete]);

  // Add keyboard prevention
  useEffect(() => {
    const preventKeyboardInput = (e: KeyboardEvent) => {
      if (interviewState.isInterviewStarted && !interviewState.isInterviewComplete) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Disable keyboard inputs when interview is active
    if (interviewState.isInterviewStarted && !interviewState.isInterviewComplete) {
      window.addEventListener('keydown', preventKeyboardInput, true);
      window.addEventListener('keyup', preventKeyboardInput, true);
      window.addEventListener('keypress', preventKeyboardInput, true);
    }

    return () => {
      // Remove keyboard prevention when component unmounts or interview ends
      window.removeEventListener('keydown', preventKeyboardInput, true);
      window.removeEventListener('keyup', preventKeyboardInput, true);
      window.removeEventListener('keypress', preventKeyboardInput, true);
    };
  }, [interviewState.isInterviewStarted, interviewState.isInterviewComplete]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeSpeechRecognition = () => {
    // @ts-ignore - SpeechRecognition is not in the TypeScript types
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US'; // Ensure English recognition for better accuracy

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        recognitionStartedRef.current = true;
        console.log('🎤 Listening for your response...');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        recognitionStartedRef.current = false;
        // Only restart if we're not speaking
        if (!isAISpeaking) {
          try {
            recognitionRef.current.start();
          } catch (error) {
            console.log('❌ Recognition error:', error);
          }
        }
      };

      let currentTranscript = '';

      recognitionRef.current.onresult = (event: any) => {
        const now = Date.now();
        lastSpeechTimeRef.current = now;

        // If this is the first result, record the start time
        if (speechStartTimeRef.current === 0) {
          speechStartTimeRef.current = now;
        }

        // Get the transcript
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');

        // Update input value with transcript
        setInputValue(transcript);
        currentTranscript = transcript;

        // Clear any existing silence timeout
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }

        // Check if the transcript ends with a period, question mark, or exclamation
        const endsWithPunctuation = /[.?!]$/.test(transcript.trim());

        // Check if transcript contains a complete thought (has subject and verb)
        const hasCompleteThought = /\b(I|we|they|he|she|it|you)\b.*\b(am|is|are|was|were|have|has|had|do|does|did|can|could|will|would|should|may|might)\b/i.test(transcript);

        // Calculate speech duration
        const speechDuration = now - speechStartTimeRef.current;

        // Set new silence timeout - longer to allow for natural pauses
        silenceTimeoutRef.current = setTimeout(() => {
          // Only process if enough time has passed since speech started
          if (speechDuration >= MIN_SPEECH_DURATION) {
            if (Date.now() - lastSpeechTimeRef.current >= (endsWithPunctuation ? PUNCTUATION_THRESHOLD : hasCompleteThought ? 2000 : SILENCE_THRESHOLD)) {
              console.log('⏸️ Silence detected, sending message...');
              if (currentTranscript.trim()) {
                sendMessage(currentTranscript.trim());
                setInputValue('');
                // Reset speech start time
                speechStartTimeRef.current = 0;
                currentTranscript = '';
              }
            }
          }
        }, endsWithPunctuation ? PUNCTUATION_THRESHOLD : hasCompleteThought ? 2000 : SILENCE_THRESHOLD);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.log('❌ Recognition error:', event.error);
        recognitionStartedRef.current = false;
        // Only restart on errors that aren't 'no-speech' and if we're not speaking
        if (event.error !== 'no-speech' && !isAISpeaking) {
          try {
            recognitionRef.current.start();
          } catch (error) {
            console.log('❌ Error restarting recognition:', error);
          }
        }
      };
    }
  };

  const getBestVoice = () => {
    const voices = voicesRef.current;

    // Priority order for male voices
    const preferredVoices = [
      // First priority: Microsoft male voices
      voices.find(voice => voice.name.includes('Microsoft Guy')),
      voices.find(voice => voice.name.includes('Microsoft David')),
      // Second priority: Google male voices
      voices.find(voice => voice.name.includes('Google US English Male')),
      // Third priority: Any English male voice
      voices.find(voice => voice.name.toLowerCase().includes('male') && voice.lang.startsWith('en')),
      // Fourth priority: Any English voice as fallback
      voices.find(voice => voice.lang === 'en-US'),
      voices.find(voice => voice.lang.startsWith('en')),
      voices[0]
    ];

    return preferredVoices.find(voice => voice !== undefined);
  };

  const speakMessage = async (message: string) => {
    setIsAISpeaking(true);

    // Stop recognition while AI is speaking
    if (recognitionRef.current && recognitionStartedRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log('❌ Error stopping recognition:', error);
      }
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    return new Promise<void>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(message);

      // Get the best male voice
      const voice = getBestVoice();
      if (voice) {
        utterance.voice = voice;
        console.log('🔊 Using voice:', voice.name);
      }

      // Simple speech parameters for natural sound but slightly faster
      utterance.rate = 0.9;     // Slower rate for more natural conversation
      utterance.pitch = 1.0;    // Natural pitch
      utterance.volume = 1.0;   // Full volume

      utterance.onstart = () => {
        console.log('▶️ AI started speaking');
      };

      utterance.onend = () => {
        console.log('⏹️ AI finished speaking');
        setIsAISpeaking(false);
        // Start recognition immediately after AI finishes speaking
        setTimeout(() => {
          if (recognitionRef.current && !recognitionStartedRef.current) {
            try {
              recognitionRef.current.start();
            } catch (error) {
              console.log('❌ Error starting recognition:', error);
            }
          }
        }, 50); // Very short delay before starting recognition
        resolve();
      };

      utterance.onerror = (event) => {
        console.log('❌ Speech error:', event);
        setIsAISpeaking(false);
        resolve();
      };

      // Small delay before speaking for natural timing
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 500);
    });
  };

  const startVideoStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const stopVideoStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setIsStreaming(false);
    }
  };

  const toggleMute = () => setIsMuted(!isMuted);
  const toggleVideo = () => setIsVideoOff(!isVideoOff);
  const toggleQuestions = () => setShowQuestions(!showQuestions);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mainVideoContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!interviewState.isInterviewStarted || interviewState.isInterviewComplete) {
      setInputValue(e.target.value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !interviewState.isThinking) {
      sendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!interviewState.isInterviewStarted || interviewState.isInterviewComplete) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    } else {
      e.preventDefault();
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1b1e]"
      onKeyDown={(e) => interviewState.isInterviewStarted && !interviewState.isInterviewComplete && e.preventDefault()}>
      {/* Header */}
      <div className="bg-[#2d2e31] border-b border-gray-700/50 px-4 py-3">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white font-semibold">Frontend Developer Interview</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {isListening && (
                <div className="flex items-center gap-2 text-sm text-emerald-400">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Listening...
                </div>
              )}
              <div className="text-sm text-gray-400 bg-[#3a3b3f] px-3 py-1.5 rounded-lg">
                Duration: 45:00
              </div>
            </div>
            <button
              disabled
              className="text-gray-300 opacity-50"
            >
              {showQuestions ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative h-[calc(100vh-4rem)]">
        {/* Video Grid */}
        <div className="absolute inset-0 p-4">
          <div className="h-full grid grid-cols-1 gap-4">
            {/* Main Video Container */}
            <div ref={mainVideoContainerRef} className="relative w-full h-full">
              {/* Video Feed */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden bg-[#2d2e31] border border-gray-700/50">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted={isMuted}
                  className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
                />

                {/* Video Off Placeholder */}
                {isVideoOff && (
                  <div className="absolute inset-0 bg-[#2d2e31] flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
                      <span className="text-3xl text-gray-400">JD</span>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Interviewer Picture-in-Picture */}
              <div className="absolute top-4 right-4 w-64 aspect-video bg-[#2d2e31] rounded-xl overflow-hidden border border-gray-700/50 shadow-lg hover:scale-105 transition-transform cursor-pointer">
                <div className="w-full h-full bg-gradient-to-br from-[#3a3b3f] to-[#2d2e31] flex items-center justify-center">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-[#4a4b4f] flex items-center justify-center">
                      <svg
                        className="w-10 h-10 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    {/* Speaking Indicator */}
                    {isAISpeaking && (
                      <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                        <div className="flex gap-1.5">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Controls */}
              <div className="absolute left-1/2 bottom-6 -translate-x-1/2 flex items-center gap-4 px-6 py-4 rounded-full bg-[#2d2e31]/90 border border-gray-700/50 backdrop-blur-sm pointer-events-none">
                {/* Mute Button */}
                <button
                  disabled
                  className={`p-3.5 rounded-full transition-all duration-300 opacity-50 ${isMuted ? 'bg-red-500/20 text-red-500' : 'bg-[#3a3b3f] text-gray-300'
                    }`}
                >
                  {isMuted ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  )}
                </button>

                {/* Video Toggle Button */}
                <button
                  disabled
                  className={`p-3.5 rounded-full transition-all duration-300 opacity-50 ${isVideoOff ? 'bg-red-500/20 text-red-500' : 'bg-[#3a3b3f] text-gray-300'
                    }`}
                >
                  {isVideoOff ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>

                {/* Fullscreen Button */}
                <button
                  disabled
                  className="p-3.5 rounded-full bg-[#3a3b3f] text-gray-300 opacity-50"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                  </svg>
                </button>

                {/* End Call Button */}
                <button
                  disabled
                  className="p-3.5 rounded-full bg-red-500 text-white opacity-50"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Panel - Slides in/out */}
        <div className={`absolute right-0 top-0 bottom-0 w-96 transform transition-transform duration-300 ease-in-out ${showQuestions ? 'translate-x-0' : 'translate-x-full'
          }`}>
          <div className="h-full bg-[#2d2e31] border-l border-gray-700/50 p-6 overflow-y-auto">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white border-b border-gray-700/50 pb-4">
                Interview Transcript
              </h2>

              {/* Messages Display */}
              <div className="space-y-4">
                {interviewState.messages.map((message, index) => (
                  <div key={index} className="bg-[#3a3b3f] rounded-xl p-4 border border-gray-700/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className={`font-medium ${message.role === 'assistant' ? 'text-blue-400' : 'text-green-400'}`}>
                        {message.role === 'assistant' ? 'Interviewer' : 'You'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-gray-200">{message.content}</p>
                  </div>
                ))}
              </div>

              {/* Status Indicator */}
              <div className="flex items-center justify-center gap-2 text-sm">
                {isAISpeaking ? (
                  <div className="text-blue-400">AI is speaking...</div>
                ) : isListening ? (
                  <div className="flex items-center gap-2 text-emerald-400">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Listening to your answer...
                  </div>
                ) : (
                  <div className="text-gray-400">Waiting for response...</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Text Input Area */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4">
          <form onSubmit={handleSubmit} className="relative opacity-0">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your response..."
              className="w-full bg-gray-800/50 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
              rows={2}
              disabled={interviewState.isInterviewStarted && !interviewState.isInterviewComplete}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || interviewState.isThinking || interviewState.isInterviewStarted}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 rounded-full p-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 