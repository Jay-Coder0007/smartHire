/**
 * Utility functions for file handling
 */

/**
 * Extract text from a PDF file by sending it to the server for processing
 * @param file The PDF file to extract text from
 * @returns The extracted text
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);

    // Send the file to the server for processing
    const response = await fetch('/api/parse-pdf', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to parse PDF');
    }

    if (!data.text) {
      throw new Error('No text extracted from PDF');
    }

    return data.text;
  } catch (error: any) {
    console.error('Error extracting text from PDF:', error);
    
    // Show a more user-friendly error message
    if (error.message.includes('PDF parsing library not available')) {
      alert('PDF parsing is not available. Please try again later or contact support.');
    } else {
      alert('Failed to extract text from PDF. Please try a different file or format.');
    }
    
    throw error;
  }
}

/**
 * Extract text from a file based on its type
 * @param file The file to extract text from
 * @returns The extracted text
 */
export async function extractTextFromFile(file: File): Promise<string> {
  try {
    // Check if the file is a PDF
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      return extractTextFromPDF(file);
    }

    // For text files, read directly
    if (file.type.startsWith('text/')) {
      return await file.text();
    }

    throw new Error(`Unsupported file type: ${file.type}`);
  } catch (error) {
    console.error('Error extracting text from file:', error);
    throw error;
  }
}

/**
 * Check if a file is a valid resume file type
 * @param file The file to check
 * @returns True if the file is a valid resume file type
 */
export function isValidResumeFile(file: File): boolean {
  const validTypes = [
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  // Also check file extension for PDF files
  if (file.name.toLowerCase().endsWith('.pdf')) {
    return true;
  }

  return validTypes.includes(file.type);
} 