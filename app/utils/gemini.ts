import { GoogleGenerativeAI } from '@google/generative-ai';
import { extractTextFromPDFClientSide } from './pdfUtils';

// Initialize the Google Generative AI with your API key
// The API key should be stored in environment variables in production
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

// Resume parsing function using Gemini 2.0 Flash
export async function parseResume(resumeText: string) {
  try {
    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Prompt for resume parsing
    const prompt = `
      Parse the following resume and extract the information in a structured JSON format.
      Include the following sections:
      - personalInfo (name, email, phone, location, linkedin)
      - skills (array of skills)
      - experience (array of objects with title, company, duration, and points array)
      - education (array of objects with degree, school, and year)
      - certifications (array of certifications if available)
      - projects (array of projects if available)
      
      Return ONLY the JSON without any markdown formatting, explanation, or code blocks.
      Do not include backticks or json tags in your response.
      
      Resume:
      ${resumeText}
    `;
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up the response if it contains markdown formatting
    text = cleanJsonResponse(text);
    
    // Parse the JSON response
    try {
      return JSON.parse(text);
    } catch (error) {
      console.error("Failed to parse JSON response:", error);
      console.error("Raw response:", text);
      return null;
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return null;
  }
}

// Function to clean up JSON response from markdown formatting
function cleanJsonResponse(text: string): string {
  // Remove markdown code block syntax if present
  let cleanedText = text;
  
  // Remove ```json and ``` markers
  const jsonBlockRegex = /```(?:json)?\s*([\s\S]*?)```/;
  const match = jsonBlockRegex.exec(cleanedText);
  
  if (match && match[1]) {
    cleanedText = match[1].trim();
  }
  
  // Remove any remaining backticks
  cleanedText = cleanedText.replace(/`/g, '');
  
  // Remove any "json" or "JSON" text at the beginning
  cleanedText = cleanedText.replace(/^(?:json|JSON)\s+/, '');
  
  return cleanedText;
}

// Function to extract text from file
export async function extractTextFromFile(file: File): Promise<string> {
  try {
    // Handle different file types
    if (file.type === 'application/pdf') {
      try {
        // Try server-side parsing first
        return await extractTextFromPDF(file);
      } catch (error) {
        console.warn('Server-side PDF parsing failed, falling back to client-side extraction');
        // Fall back to client-side extraction from pdfUtils.ts
        return await extractTextFromPDFClientSide(file);
      }
    } else {
      // For text files, docx, etc.
      return await readTextFile(file);
    }
  } catch (error) {
    console.error("Error extracting text from file:", error);
    throw error;
  }
}

// Function to read text from a text file
async function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (!event.target?.result) {
        reject("Failed to read file");
        return;
      }
      
      resolve(event.target.result.toString());
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsText(file);
  });
}

// Function to extract text from PDF using the server API
async function extractTextFromPDF(file: File): Promise<string> {
  try {
    // Create a FormData object
    const formData = new FormData();
    formData.append('file', file);
    
    // Call the API route
    const response = await fetch('/api/parse-pdf', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to parse PDF');
    }
    
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error;
  }
} 