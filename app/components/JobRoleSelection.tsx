'use client';
import { useState, useEffect } from 'react';
import { JOB_ROLES, JobRoleDetails } from '../types/interview';
import { useInterview } from '../context/InterviewContext';

interface JobRoleSelectionProps {
  onComplete: () => void;
}

export default function JobRoleSelection({ onComplete }: JobRoleSelectionProps) {
  const { setJobRole, interviewState } = useInterview();
  const [selectedRole, setSelectedRole] = useState<JobRoleDetails | null>(null);

  // Auto-select Frontend Developer role
  useEffect(() => {
    const frontendRole = JOB_ROLES.find(role => role.title === 'Frontend Developer');
    if (frontendRole) {
      setSelectedRole(frontendRole);
      setJobRole(frontendRole);
    }
  }, [setJobRole]);

  const handleContinue = () => {
    if (selectedRole) {
      onComplete();
    }
  };

  // Find the Frontend Developer role
  const frontendRole = JOB_ROLES.find(role => role.title === 'Frontend Developer');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Frontend Developer Interview
          </h1>
          <p className="text-gray-400 mt-2">
            You'll be interviewed for a Frontend Developer position with voice interaction
          </p>
        </div>

        {/* Job Role Card */}
        {frontendRole && (
          <div className="max-w-md mx-auto">
            <div className="relative group cursor-pointer transition-all duration-300 transform scale-[1.02] ring-2 ring-blue-500">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
              <div className="relative bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/10 h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d={frontendRole.icon}
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold">{frontendRole.title}</h2>
                </div>
                <p className="text-gray-300 mb-4">{frontendRole.description}</p>
                <div className="mt-auto">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Key Skills:</h3>
                  <div className="flex flex-wrap gap-2">
                    {frontendRole.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-blue-500/10 rounded-full text-xs font-medium text-blue-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Continue Button */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={handleContinue}
            className="px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/20"
          >
            Start Interview
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-blue-400 mb-3">Voice Interview Instructions:</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>The AI interviewer will ask you questions through voice</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Your microphone will automatically activate to capture your responses</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>When you finish speaking, your answer will be sent after a brief pause</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>You can use the controls to mute your microphone or turn off your camera</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>The interview will last approximately 10-15 minutes</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 