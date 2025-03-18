# SmartHire - AI-Powered Interview Platform

SmartHire is an automated interview platform that uses AI to analyze resumes and conduct personalized interviews.

## Features

- Resume parsing with Google's Gemini 2.0 Flash model
- Interactive virtual interview experience
- Real-time feedback and scoring
- Comprehensive interview results and recommendations

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- A Google AI Studio API key for Gemini

### Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/smarthire.git
cd smarthire
```

2. Install dependencies:

```bash
npm install
```

3. Set up your environment variables:

Create a `.env.local` file in the root directory with the following content:

```
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

You can get your API key from [Google AI Studio](https://ai.google.dev/).

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## How It Works

1. **Resume Upload**: Users upload their resume in PDF, DOC, DOCX, or TXT format
2. **AI Analysis**: The Gemini 2.0 Flash model extracts structured data from the resume
3. **Interview**: Users participate in a virtual interview with AI-generated questions
4. **Results**: The system provides detailed feedback and scoring based on the interview

## Technologies Used

- Next.js 15.2
- React 19
- TypeScript
- Tailwind CSS
- Google Gemini 2.0 Flash API

## License

This project is licensed under the MIT License - see the LICENSE file for details.
