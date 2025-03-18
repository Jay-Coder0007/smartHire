/**
 * Simple client-side PDF text extraction
 * This is a basic implementation that works for some PDFs
 * It's used as a fallback when server-side parsing fails
 */
export async function extractTextFromPDFClientSide(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (!event.target?.result) {
        reject("Failed to read file");
        return;
      }
      
      try {
        const arrayBuffer = event.target.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        const text = extractTextFromPDFData(uint8Array);
        resolve(text);
      } catch (error) {
        console.error("Error in client-side PDF extraction:", error);
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Extract text from PDF data
 * This is a very basic implementation that looks for text streams in the PDF
 */
function extractTextFromPDFData(data: Uint8Array): string {
  // Convert the binary data to a string
  const pdfString = new TextDecoder('utf-8').decode(data);
  
  // Find all text objects in the PDF
  const textObjects: string[] = [];
  const textRegex = /\(([^\)]+)\)/g;
  let match;
  
  while ((match = textRegex.exec(pdfString)) !== null) {
    if (match[1] && match[1].length > 1) {
      // Filter out single characters and control sequences
      if (!/^[\\()\d]+$/.test(match[1])) {
        textObjects.push(match[1]);
      }
    }
  }
  
  // Join all text objects
  let extractedText = textObjects.join(' ');
  
  // Clean up the text
  extractedText = extractedText
    .replace(/\\n/g, '\n') // Replace escaped newlines
    .replace(/\\r/g, '') // Remove carriage returns
    .replace(/\\t/g, ' ') // Replace tabs with spaces
    .replace(/\\\\/g, '\\') // Replace escaped backslashes
    .replace(/\\\(/g, '(') // Replace escaped parentheses
    .replace(/\\\)/g, ')') // Replace escaped parentheses
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  return extractedText;
} 