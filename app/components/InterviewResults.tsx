'use client';
import { useState, useEffect } from 'react';
import { useInterview } from '../context/InterviewContext';
import { useRouter } from 'next/navigation';

interface InterviewResultsProps {
  onRestart?: () => void;
}

export default function InterviewResults({ onRestart }: InterviewResultsProps) {
  const { interviewState, resetInterview } = useInterview();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  
  // Use useEffect to handle client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleRestart = () => {
    resetInterview();
    if (onRestart) {
      onRestart();
    } else {
      router.push('/');
    }
  };

  // Calculate metrics only on client-side
  const renderMetrics = () => {
    if (!isClient) return null;
    
    const score = Math.floor(Math.random() * 30) + 20; // Random score between 20-50
    const scoreColor = score >= 40 ? 'text-yellow-500' : 'text-red-500';
    
    // Calculate metrics based on messages
    const totalMessages = interviewState.messages.filter(msg => msg.role === 'user').length;
    const avgResponseTime = Math.floor(Math.random() * 10) + 20; // Simulated for now
    const technicalScore = Math.floor(Math.random() * 20) + 20; // Random score between 20-40
    const communicationScore = Math.floor(Math.random() * 20) + 20; // Random score between 20-40
    
    return (
      <>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Interview Complete</h1>
          <p className="text-gray-400">Here's how you performed in your Frontend Developer interview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Overall Score</h2>
            <div className="flex items-center justify-center">
              <div className="relative w-40 h-40">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-4xl font-bold ${scoreColor}`}>{score}</span>
                </div>
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#1a1a1a"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={score >= 40 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="10"
                    strokeDasharray={`${score * 2.83} 283`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Interview Stats</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Questions Answered</span>
                  <span className="font-medium">{totalMessages}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${Math.min(100, totalMessages * 10)}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Avg. Response Time</span>
                  <span className="font-medium">{avgResponseTime}s</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${Math.min(100, 100 - avgResponseTime * 2)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Technical Knowledge</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">React Proficiency</span>
                  <span className="font-medium">{technicalScore}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${technicalScore}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">JavaScript Knowledge</span>
                  <span className="font-medium">{technicalScore - 5}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${technicalScore - 5}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Problem Solving</span>
                  <span className="font-medium">{technicalScore - 10}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${technicalScore - 10}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Communication Skills</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Clarity</span>
                  <span className="font-medium">{communicationScore}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${communicationScore}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Conciseness</span>
                  <span className="font-medium">{communicationScore - 5}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${communicationScore - 5}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400">Technical Terminology</span>
                  <span className="font-medium">{communicationScore - 10}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${communicationScore - 10}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-8">
          <h2 className="text-xl font-semibold mb-4">Feedback Summary</h2>
          <p className="text-gray-300 mb-4">
            {score >= 40
              ? 'You demonstrated basic understanding of frontend development concepts. While there were some good points, there is significant room for improvement in technical knowledge and communication.'
              : 'You showed limited understanding of frontend development concepts. Consider focusing on strengthening your fundamentals and practicing more technical explanations.'}
          </p>
          <div className="space-y-2">
            <h3 className="font-medium">Strengths:</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1 ml-2">
              <li>Basic understanding of React concepts</li>
              <li>Familiarity with JavaScript fundamentals</li>
              <li>Willingness to learn and improve</li>
            </ul>
          </div>
          <div className="space-y-2 mt-4">
            <h3 className="font-medium">Areas for Improvement:</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-1 ml-2">
              <li>Strengthen understanding of React fundamentals</li>
              <li>Improve knowledge of state management patterns</li>
              <li>Practice explaining technical concepts more clearly</li>
            </ul>
          </div>
        </div>

        {/* Interview Transcript Section */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-8">
          <h2 className="text-xl font-semibold mb-4">Interview Transcript</h2>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {interviewState.messages.map((message, index) => (
              <div key={index} className={`p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-blue-500/20 ml-4' 
                  : 'bg-purple-500/20 mr-4'
              }`}>
                <div className="font-medium mb-1">
                  {message.role === 'user' ? 'You' : 'Interviewer'}
                </div>
                <div className="text-gray-300">{message.content}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleRestart}
            className="px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/20"
          >
            Start New Interview
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {isClient ? renderMetrics() : <div>Loading results...</div>}
      </div>
    </div>
  );
} 