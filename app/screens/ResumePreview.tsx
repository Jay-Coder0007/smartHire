'use client';
import { useState } from 'react';
import InterviewRoom from './InterviewRoom';
import { useResume } from '../context/ResumeContext';

export default function ResumePreview() {
  const [startInterview, setStartInterview] = useState(false);
  const { resumeData, isLoading, error } = useResume();

  if (startInterview) {
    return <InterviewRoom />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl font-medium">Analyzing your resume...</p>
        </div>
      </div>
    );
  }

  if (error) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center p-4">
        <div className="w-full max-w-xl bg-red-500/10 backdrop-blur-xl rounded-3xl p-8 border border-red-500/30">
          <div className="flex flex-col items-center gap-4 text-center">
            <svg className="w-16 h-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-2xl font-bold text-red-400">Error Processing Resume</h2>
            <p className="text-gray-300">{error}</p>
          <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 rounded-xl transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center p-4">
        <div className="w-full max-w-xl bg-yellow-500/10 backdrop-blur-xl rounded-3xl p-8 border border-yellow-500/30">
          <div className="flex flex-col items-center gap-4 text-center">
            <svg className="w-16 h-16 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            <h2 className="text-2xl font-bold text-yellow-400">No Resume Data Found</h2>
            <p className="text-gray-300">We couldn't find any data from your resume. Please try uploading again.</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-xl transition-all duration-300"
            >
              Try Again
          </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Resume Analysis
          </h1>
          <p className="text-gray-400 mt-2">
            Review the information extracted from your resume
          </p>
      </div>

      {/* Resume Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Personal Info */}
          <div className="col-span-1 bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all duration-300">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Personal Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-lg font-medium">{resumeData.personalInfo.name}</p>
                <p className="text-gray-400">{resumeData.personalInfo.location}</p>
                </div>
              <div className="pt-2">
                <p className="text-gray-300 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {resumeData.personalInfo.email}
                </p>
                <p className="text-gray-300 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {resumeData.personalInfo.phone}
                </p>
                {resumeData.personalInfo.linkedin && (
                  <p className="text-gray-300 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {resumeData.personalInfo.linkedin}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="col-span-2 bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300">
            <h2 className="text-xl font-semibold mb-4 text-purple-400">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-500/10 rounded-full text-sm font-medium text-purple-300 border border-purple-500/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="col-span-3 bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all duration-300">
            <h2 className="text-xl font-semibold mb-4 text-blue-400">Experience</h2>
            <div className="space-y-6">
              {resumeData.experience.map((exp, index) => (
                <div key={index} className="border-l-2 border-blue-500/30 pl-4 pb-2">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <h3 className="text-lg font-medium">{exp.title}</h3>
                    <p className="text-gray-400">{exp.duration}</p>
                  </div>
                  <p className="text-blue-300 mb-2">{exp.company}</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-300">
                    {exp.points.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="col-span-3 bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300">
            <h2 className="text-xl font-semibold mb-4 text-purple-400">Education</h2>
            <div className="space-y-4">
              {resumeData.education.map((edu, index) => (
                <div key={index} className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{edu.degree}</h3>
                    <p className="text-gray-300">{edu.school}</p>
                  </div>
                  <p className="text-gray-400">{edu.year}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Projects (if available) */}
          {resumeData.projects && resumeData.projects.length > 0 && (
            <div className="col-span-3 bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-green-500/30 transition-all duration-300">
              <h2 className="text-xl font-semibold mb-4 text-green-400">Projects</h2>
              <div className="space-y-6">
                {resumeData.projects.map((project, index) => (
                  <div key={index} className="border-l-2 border-green-500/30 pl-4 pb-2">
                    <h3 className="text-lg font-medium">{project.name}</h3>
                    <p className="text-gray-300 my-2">{project.description}</p>
                    {project.technologies && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Array.isArray(project.technologies) ? project.technologies.map((tech, i) => (
                          <span 
                            key={i}
                            className="px-2 py-1 bg-green-500/10 rounded-full text-xs font-medium text-green-300 border border-green-500/20"
                          >
                            {tech}
                          </span>
                        )) : (
                          <span className="px-2 py-1 bg-green-500/10 rounded-full text-xs font-medium text-green-300 border border-green-500/20">
                            {project.technologies}
                          </span>
                        )}
                      </div>
                    )}
                    {project.link && (
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 mt-2 text-sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Project
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications (if available) */}
          {resumeData.certifications && resumeData.certifications.length > 0 && (
            <div className="col-span-3 bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-yellow-500/30 transition-all duration-300">
              <h2 className="text-xl font-semibold mb-4 text-yellow-400">Certifications</h2>
              <div className="space-y-4">
                {resumeData.certifications.map((cert, index) => (
                  <div key={index} className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-medium">{cert.name}</h3>
                      {cert.issuer && <p className="text-gray-300">{cert.issuer}</p>}
                    </div>
                    {cert.date && <p className="text-gray-400">{cert.date}</p>}
                </div>
              ))}
            </div>
          </div>
          )}
        </div>

        {/* Start Interview Button */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setStartInterview(true)}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-lg hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300"
          >
            Start Interview
          </button>
        </div>
      </div>
    </div>
  );
} 