'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ResumeData } from '../types/resume';

interface ResumeContextType {
  resumeData: ResumeData | null;
  setResumeData: (data: ResumeData) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        setResumeData,
        isLoading,
        setIsLoading,
        error,
        setError
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
} 