'use client';
import { useState, useEffect } from 'react';
import { useInterview } from '../context/InterviewContext';
import JobRoleSelection from '../components/JobRoleSelection';
import InterviewChat from '../components/InterviewChat';
import InterviewResults from '../components/InterviewResults';

export default function InterviewRoom() {
  const { interviewState, startInterview } = useInterview();
  const [currentStep, setCurrentStep] = useState<'selection' | 'interview' | 'results'>('selection');

  // Start the interview when job role is selected
  useEffect(() => {
    if (currentStep === 'interview' && interviewState.jobRole && !interviewState.isInterviewStarted) {
      startInterview();
    }
  }, [currentStep, interviewState.jobRole, interviewState.isInterviewStarted, startInterview]);

  // Handle job role selection completion
  const handleSelectionComplete = () => {
    setCurrentStep('interview');
  };

  // Handle interview completion
  const handleInterviewComplete = () => {
    setCurrentStep('results');
  };

  // Handle restart
  const handleRestart = () => {
    setCurrentStep('selection');
  };

  // Render the appropriate component based on the current step
  const renderStep = () => {
    switch (currentStep) {
      case 'selection':
        return <JobRoleSelection onComplete={handleSelectionComplete} />;
      case 'interview':
        return <InterviewChat onComplete={handleInterviewComplete} />;
      case 'results':
        return <InterviewResults onRestart={handleRestart} />;
      default:
        return <JobRoleSelection onComplete={handleSelectionComplete} />;
    }
  };

  return <>{renderStep()}</>;
} 