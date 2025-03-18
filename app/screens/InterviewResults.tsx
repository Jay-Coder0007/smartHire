import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Strength {
  category: string;
  description: string;
  score: number;
}

interface InterviewResult {
  overallScore: number;
  keyStrengths: Strength[];
  recommendation: 'Strongly Recommend' | 'Recommend' | 'Consider' | 'Do Not Recommend' | 'Reject';
  feedback: string;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
}

const getRecommendationColor = (recommendation: string) => {
  switch (recommendation) {
    case 'Strongly Recommend':
      return 'text-emerald-400';
    case 'Recommend':
      return 'text-blue-400';
    case 'Consider':
      return 'text-yellow-400';
    case 'Do Not Recommend':
      return 'text-orange-400';
    case 'Reject':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
};

// Sample data - In production, this would come from AI analysis
const sampleResult: InterviewResult = {
  overallScore: 85,
  technicalScore: 88,
  communicationScore: 82,
  problemSolvingScore: 85,
  keyStrengths: [
    {
      category: 'Technical Knowledge',
      description: 'Strong understanding of React and Next.js concepts',
      score: 88
    },
    {
      category: 'Problem Solving',
      description: 'Excellent approach to breaking down complex problems',
      score: 85
    },
    {
      category: 'Communication',
      description: 'Clear and concise communication skills',
      score: 82
    }
  ],
  recommendation: 'Strongly Recommend',
  feedback: 'The candidate demonstrated strong technical skills and excellent problem-solving abilities. Their communication was clear and professional throughout the interview.'
};

export default function InterviewResults() {
  const resultsRef = React.useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!resultsRef.current) return;

    // Show loading state
    const button = document.querySelector('#downloadButton');
    if (button) {
      button.textContent = 'Generating PDF...';
      button.setAttribute('disabled', 'true');
    }

    try {
      // Create a canvas from the results div
      const canvas = await html2canvas(resultsRef.current, {
        scale: 2,
        backgroundColor: '#1a1b1e',
        logging: false
      });

      // Create PDF
      const pdf = new jsPDF({
        format: 'a4',
        unit: 'px'
      });

      // Calculate dimensions
      const imgWidth = 595; // A4 width in pixels at 72 DPI
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add the image to the PDF
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        0,
        imgWidth,
        imgHeight
      );

      // Save the PDF
      pdf.save('interview-results.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      // Reset button state
      if (button) {
        button.textContent = 'Download Results (PDF)';
        button.removeAttribute('disabled');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1b1e] text-white p-8">
      <div ref={resultsRef} className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Interview Results</h1>
          <p className="text-gray-400">Technical Interview Assessment</p>
          <button
            id="downloadButton"
            onClick={downloadPDF}
            className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center gap-2 transition-colors mx-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Results (PDF)
          </button>
        </div>

        {/* Overall Score */}
        <div className="bg-[#2d2e31] rounded-2xl p-8 mb-8 border border-gray-700/50">
          <h2 className="text-2xl font-semibold mb-6">Overall Score</h2>
          <div className="flex items-center gap-8">
            <div className="relative w-48 h-48">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-gray-700"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={553}
                  strokeDashoffset={553 - (553 * sampleResult.overallScore) / 100}
                  className="text-blue-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold">{sampleResult.overallScore}</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#3a3b3f] rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">{sampleResult.technicalScore}</div>
                  <div className="text-sm text-gray-400 mt-1">Technical</div>
                </div>
                <div className="bg-[#3a3b3f] rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">{sampleResult.communicationScore}</div>
                  <div className="text-sm text-gray-400 mt-1">Communication</div>
                </div>
                <div className="bg-[#3a3b3f] rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-400">{sampleResult.problemSolvingScore}</div>
                  <div className="text-sm text-gray-400 mt-1">Problem Solving</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Strengths */}
        <div className="bg-[#2d2e31] rounded-2xl p-8 mb-8 border border-gray-700/50">
          <h2 className="text-2xl font-semibold mb-6">Key Strengths</h2>
          <div className="grid gap-4">
            {sampleResult.keyStrengths.map((strength, index) => (
              <div key={index} className="bg-[#3a3b3f] rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-200">{strength.category}</h3>
                  <p className="text-gray-400 text-sm mt-1">{strength.description}</p>
                </div>
                <div className="text-2xl font-bold text-blue-400">{strength.score}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendation */}
        <div className="bg-[#2d2e31] rounded-2xl p-8 border border-gray-700/50">
          <h2 className="text-2xl font-semibold mb-6">Final Recommendation</h2>
          <div className="mb-6">
            <div className={`text-3xl font-bold ${getRecommendationColor(sampleResult.recommendation)}`}>
              {sampleResult.recommendation}
            </div>
          </div>
          <div className="bg-[#3a3b3f] rounded-xl p-6">
            <h3 className="font-semibold mb-3">Detailed Feedback</h3>
            <p className="text-gray-400 leading-relaxed">{sampleResult.feedback}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 