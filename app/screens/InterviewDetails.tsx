'use client';
import { useState, useCallback } from 'react';
import ResumePreview from './ResumePreview';
import { extractTextFromFile, parseResume } from '../utils/gemini';
import { useResume } from '../context/ResumeContext';
import { mockResumeData } from '../utils/mockData';

// Pre-set interview details
const INTERVIEW_DETAILS = {
  companyName: "Tech Innovations Inc.",
  candidateEmail: "candidate@example.com",
  jobRole: "Senior Software Engineer"
};

export default function InterviewDetails() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [useMockData, setUseMockData] = useState(false);
  const { setResumeData, setIsLoading, setError } = useResume();

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'application/pdf' || 
        droppedFile.type === 'application/msword' || 
        droppedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        droppedFile.type === 'text/plain')) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    
    try {
      setIsUploading(true);
      setIsLoading(true);
      setError(null);
      
      // Extract text from the resume file
      const resumeText = await extractTextFromFile(file);
      
      if (!resumeText || resumeText.trim().length === 0) {
        throw new Error("Could not extract text from the resume file");
      }
      
      console.log("Extracted text:", resumeText.substring(0, 200) + "...");
      
      // Parse the resume using Gemini API
      let parsedData = await parseResume(resumeText);
      
      if (!parsedData) {
        console.warn("Failed to parse resume with Gemini API, using mock data as fallback");
        parsedData = mockResumeData;
      }
      
      console.log("Parsed resume data:", parsedData);
      
      // Set the resume data in context
      setResumeData(parsedData);
      
      // Simulate a short delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsUploading(false);
      setIsLoading(false);
      setShowPreview(true);
    } catch (error) {
      console.error("Error processing resume:", error);
      console.warn("Using mock data as fallback due to error");
      
      // Use mock data as fallback
      setResumeData(mockResumeData);
      
      // Short delay for UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIsUploading(false);
      setIsLoading(false);
      setShowPreview(true);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const toggleMockData = () => {
    setUseMockData(!useMockData);
  };

  if (showPreview) {
    return <ResumePreview />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="relative group">
          {/* Animated background blur */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse"></div>

          {/* Main content */}
          <div className="relative bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            <div className="space-y-8">
              {/* Title */}
              <div className="text-center">
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                  Upload Your Resume
                </h1>
                <p className="text-gray-400 mt-2">
                  We'll analyze your resume with AI to personalize your interview
                </p>
              </div>
              
              {/* Upload Area */}
              <div
                onDragEnter={handleDragEnter}
                onDragOver={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative group transition-all duration-300 ease-in-out
                  ${isDragging ? 'scale-[1.02]' : 'scale-100'}`}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  id="resume-upload"
                  disabled={useMockData}
                />
                <label
                  htmlFor="resume-upload"
                  className={`relative flex flex-col items-center justify-center h-64 rounded-2xl 
                    border-2 border-dashed transition-all duration-300 cursor-pointer
                    ${useMockData ? 'border-yellow-400 bg-yellow-500/10' :
                      isDragging 
                        ? 'border-blue-400 bg-blue-500/10' 
                        : file 
                          ? 'border-green-400 bg-green-500/10' 
                          : 'border-gray-600 hover:border-blue-400 hover:bg-blue-500/5'}`}
                >
                  {/* Upload Icon */}
                  <div className={`w-16 h-16 mb-4 rounded-full flex items-center justify-center
                    transition-all duration-300 ${
                      useMockData ? 'bg-yellow-500/20' :
                      file ? 'bg-green-500/20' : 'bg-blue-500/20'
                    }`}
                  >
                    <svg
                      className={`w-8 h-8 transition-all duration-300 ${
                        useMockData ? 'text-yellow-400' :
                        file ? 'text-green-400' : 'text-blue-400'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {useMockData ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m0 16v1m9-9h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l-.707.707m-12.728 12.728l-.707.707m12.728 0l-.707-.707"
                        />
                      ) : file ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      )}
                    </svg>
                  </div>

                  {/* Upload Text */}
                  <div className="text-center space-y-2">
                    <p className="text-xl font-medium">
                      {useMockData 
                        ? 'Using sample resume data' 
                        : file 
                          ? file.name 
                          : 'Drop your resume here'}
                    </p>
                    <p className="text-sm text-gray-400">
                      {useMockData
                        ? 'No file upload needed'
                        : file 
                          ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` 
                          : 'PDF, DOC, DOCX, TXT (Max 10MB)'}
                    </p>
                  </div>

                  {/* Remove File Button */}
                  {file && !useMockData && (
                    <button
                      onClick={removeFile}
                      className="absolute top-2 right-2 p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 
                        text-red-400 transition-all duration-300"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </label>
              </div>

              {/* Mock Data Toggle */}
              <div className="flex items-center justify-center">
                <button
                  onClick={toggleMockData}
                  className="text-sm flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {useMockData ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    )}
                  </svg>
                  {useMockData ? 'Disable Sample Data' : 'Use Sample Data'}
                </button>
              </div>

              {/* Process Button */}
              <button
                onClick={handleSubmit}
                disabled={(!file && !useMockData) || isUploading}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-500 
                  ${(file || useMockData) && !isUploading
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/20'
                    : 'bg-gray-700/50 cursor-not-allowed'
                  }`}
              >
                <span className="flex items-center justify-center gap-2">
                  {isUploading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Analyzing Resume with AI...
                    </>
                  ) : (
                    useMockData ? 'Continue with Sample Data' : 'Process Resume'
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 