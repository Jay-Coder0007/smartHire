'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { JobRoleDetails, Message } from '../types/interview';

interface InterviewContextType {
  interviewState: {
    jobRole: JobRoleDetails | null;
    candidateName: string;
    candidateSkills: string[];
    messages: Message[];
    isThinking: boolean;
    isInterviewStarted: boolean;
    isInterviewComplete: boolean;
    score: number | null;
  };
  setJobRole: (role: JobRoleDetails) => void;
  startInterview: () => void;
  sendMessage: (content: string) => void;
  completeInterview: (score: number) => void;
  resetInterview: () => void;
}

// AI response structure
interface AIResponse {
  question: string;
  status: 'continue' | 'end';
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [jobRole, setJobRole] = useState<JobRoleDetails | null>(null);
  const [candidateName, setCandidateName] = useState<string>('John Doe');
  const [candidateSkills, setCandidateSkills] = useState<string[]>(['JavaScript', 'React', 'CSS', 'HTML']);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [isInterviewStarted, setIsInterviewStarted] = useState<boolean>(false);
  const [isInterviewComplete, setIsInterviewComplete] = useState<boolean>(false);
  const [score, setScore] = useState<number | null>(null);

  // Start the interview with an initial greeting
  const startInterview = async () => {
    if (isInterviewStarted || !jobRole) return;
    
    setIsInterviewStarted(true);
    
    // Request fullscreen when starting interview
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      }
    } catch (error) {
      console.error('Error requesting fullscreen:', error);
    }
    
    // Add initial greeting
    const initialGreeting = `Hello! I'll be conducting your Frontend Developer interview today. Let's start with your experience in React. How long have you been working with it and what kind of projects have you built?`;
    
    addMessage({
      role: 'assistant',
      content: initialGreeting,
      timestamp: Date.now()
    });
  };

  // Send a message and get AI response
  const sendMessage = async (content: string) => {
    if (isThinking || isInterviewComplete) return;
    
    // Add user message
    addMessage({
      role: 'user',
      content,
      timestamp: Date.now()
    });
    
    // Set thinking state
    setIsThinking(true);
    
    try {
      // Get updated messages after adding the user message
      const updatedMessages = [...messages, {
        role: 'user',
        content,
        timestamp: Date.now()
      }];
      
      // Prepare context for AI with complete conversation history
      const context = {
        jobRole,
        candidateName,
        candidateSkills,
        previousMessages: updatedMessages, // Send the complete conversation history
      };
      
      // Call API with minimal delay
      const response = await fetch('/api/interview-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          context,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }
      
      const data: AIResponse = await response.json();
      
      // Add AI response with minimal delay
      addMessage({
        role: 'assistant',
        content: data.question,
        timestamp: Date.now()
      });
      
      // Check if the interview should end
      if (data.status === 'end') {
        // Add a final message
        setTimeout(() => {
          addMessage({
            role: 'assistant',
            content: "Thank you for your time today. I've gathered enough information about your frontend development experience. The interview is now complete.",
            timestamp: Date.now()
          });
          
          // Generate a score between 70 and 95
          const score = Math.floor(Math.random() * 26) + 70;
          completeInterview(score);
        }, 3000);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Add fallback response
      addMessage({
        role: 'assistant',
        content: "I didn't catch that. Could you elaborate on your frontend development experience?",
        timestamp: Date.now()
      });
    } finally {
      // Set thinking state to false immediately
      setIsThinking(false);
    }
  };

  // Add a message to the messages array
  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  // Complete the interview
  const completeInterview = (interviewScore: number) => {
    setIsInterviewComplete(true);
    setScore(interviewScore);
    
    // Exit fullscreen when interview is complete
    try {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
    }

    // Remove visibility change event listener to allow tab switching
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };

  // Handler for visibility change
  const handleVisibilityChange = () => {
    if (document.hidden && isInterviewStarted && !isInterviewComplete) {
      alert('Please do not switch tabs during the interview!');
    }
  };

  // Reset the interview
  const resetInterview = () => {
    setJobRole(null);
    setMessages([]);
    setIsThinking(false);
    setIsInterviewStarted(false);
    setIsInterviewComplete(false);
    setScore(null);
  };

  const value = {
    interviewState: {
      jobRole,
      candidateName,
      candidateSkills,
      messages,
      isThinking,
      isInterviewStarted,
      isInterviewComplete,
      score,
    },
    setJobRole,
    startInterview,
    sendMessage,
    completeInterview,
    resetInterview,
  };

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterview() {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
} 