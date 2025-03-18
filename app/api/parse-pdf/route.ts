import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Import pdf-parse with error handling
let pdfParse: any = null;
try {
  // Use dynamic import to avoid test file dependency issues
  pdfParse = require('pdf-parse/lib/pdf-parse.js');
} catch (error) {
  console.error('Error importing pdf-parse:', error);
}

export async function POST(request: NextRequest) {
  try {
    // Check if pdf-parse is available
    if (!pdfParse) {
      return NextResponse.json(
        { error: 'PDF parsing library not available. Please install pdf-parse package.' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create temp directory if it doesn't exist
    const tempDir = path.join(os.tmpdir(), 'smarthire-pdf-uploads');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Save file to temp directory
    const tempFilePath = path.join(tempDir, file.name);
    fs.writeFileSync(tempFilePath, buffer);

    // Parse PDF
    try {
      const data = await pdfParse(buffer);
      
      // Clean up temp file
      fs.unlinkSync(tempFilePath);
      
      return NextResponse.json({ text: data.text });
    } catch (parseError) {
      console.error('Error parsing PDF:', parseError);
      
      // Clean up temp file
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
      
      return NextResponse.json(
        { error: 'Failed to parse PDF file' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in parse-pdf route:', error);
    return NextResponse.json(
      { error: 'Failed to process PDF file' },
      { status: 500 }
    );
  }
} 