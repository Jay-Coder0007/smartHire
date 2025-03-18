'use client';
import { useEffect, useState } from 'react';
import InterviewDetails from './screens/InterviewDetails';

export default function Home() {
  const [time, setTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 10
  });
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    if (time.hours === 0 && time.minutes === 0 && time.seconds === 0) {
      setIsTimeUp(true);
      return;
    }

    const timer = setInterval(() => {
      setTime(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  // Format number to always show two digits
  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  if (isTimeUp) {
    return <InterviewDetails />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
      <div className="relative w-full max-w-4xl mx-auto px-4">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-teal-500/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-12">
          {/* Main text */}
          <h1 className="text-4xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 animate-gradient-x">
            Your Interview Will Start In
          </h1>

          {/* Digital timer */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-75"></div>
            <div className="relative bg-black/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/10">
              <div className="flex items-center gap-2 md:gap-4 text-7xl md:text-9xl font-bold font-mono tracking-wider tabular-nums">
                {/* Hours */}
                <span className="inline-block w-[1.1em] text-center animate-pulse-slow">
                  {formatNumber(time.hours)}
                </span>
                <span className="animate-pulse-slow text-blue-400">:</span>
                {/* Minutes */}
                <span className="inline-block w-[1.1em] text-center animate-pulse-slow">
                  {formatNumber(time.minutes)}
                </span>
                <span className="animate-pulse-slow text-blue-400">:</span>
                {/* Seconds */}
                <span className="inline-block w-[1.1em] text-center animate-pulse-slow">
                  {formatNumber(time.seconds)}
                </span>
              </div>
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
            </div>
          </div>

          {/* Time labels */}
          <div className="flex items-center gap-[3.6em] md:gap-[4.2em] text-sm md:text-base text-gray-400 font-mono">
            <span className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>HOURS</span>
            <span className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>MINUTES</span>
            <span className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>SECONDS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
