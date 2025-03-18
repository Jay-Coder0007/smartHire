import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

// Response structure
interface AIResponse {
  question: string;
  status: 'continue' | 'end';
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { message, context } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'No message provided' },
        { status: 400 }
      );
    }

    // Extract context information
    const { jobRole, candidateName, candidateSkills, previousMessages } = context;

    // Create a prompt for the AI
    const prompt = createInterviewPrompt(message, context);

    // Generate AI response
    const aiResponse = await generateAIResponse(prompt);

    // Return the structured AI response
    return NextResponse.json(aiResponse);
  } catch (error) {
    console.error('Error in interview-ai route:', error);
    return NextResponse.json(
      { 
        question: "Could you tell me more about your experience with React components?",
        status: "continue"
      },
      { status: 200 }
    );
  }
}

// Function to create a prompt for the AI
function createInterviewPrompt(message: string, context: any): string {
  const { jobRole, candidateName, candidateSkills, previousMessages } = context;

  // Format previous messages for context
  const conversationHistory = previousMessages
    .map((msg: any) => `${msg.role === 'assistant' ? 'Interviewer' : 'Candidate'}: ${msg.content}`)
    .join('\n');

  // Extract previous questions to avoid repetition
  const previousQuestions = previousMessages
    .filter((msg: any) => msg.role === 'assistant')
    .map((msg: any) => msg.content);

  // Count user messages to track interview progress
  const userMessageCount = previousMessages.filter((msg: any) => msg.role === 'user').length;

  // Create a prompt with all the context
  return `
    You are an AI interviewer conducting a technical interview for a Frontend Developer position.
    
    Candidate Information:
    - Name: ${candidateName}
    - Skills: ${candidateSkills.join(', ')}
    
    Job Role Requirements:
    - Title: Frontend Developer
    - Key Skills: React, JavaScript, CSS, HTML, TypeScript
    
    Interview Guidelines:
    1. You are conducting a voice interview, so keep responses conversational and natural
    2. Analyze the candidate's response to determine their knowledge and experience
    3. Ask follow-up questions based on their response that probe deeper into their technical knowledge
    4. Focus on frontend development skills, especially React and modern JavaScript
    5. Be professional but friendly
    6. IMPORTANT: Keep responses VERY concise (1-2 short sentences maximum)
    7. IMPORTANT: Respond immediately with a new question after the candidate answers
    8. IMPORTANT: Each new question should be based on the candidate's previous answer
    9. IMPORTANT: Ask progressively more challenging technical questions as the interview proceeds
    10. CRITICAL: NEVER repeat a question you've already asked
    11. CRITICAL: Generate completely new questions based on the conversation flow
    
    Previous Conversation:
    ${conversationHistory}
    
    Candidate's Latest Response:
    ${message}
    
    Current interview progress: ${userMessageCount} questions asked so far.
    
    Previous questions you've already asked (DO NOT REPEAT THESE):
    ${previousQuestions.map((q: string, i: number) => `${i+1}. ${q}`).join('\n')}
    
    Based on the candidate's response, provide your next question or comment.
    Your response MUST be under 30 words and should be direct and to the point.
    Do not add pleasantries like "That's interesting" or "Great answer" - just ask the next question.
    If they mentioned specific technologies or concepts, ask a more technical follow-up about those.
    If they didn't provide enough information, ask them to elaborate on a specific point.
    
    Ask questions that would reveal the depth of their frontend development knowledge, such as:
    - Their understanding of React's rendering lifecycle
    - How they handle state management
    - Their experience with performance optimization
    - How they approach responsive design
    - Their knowledge of modern JavaScript features
    - Their experience with TypeScript
    - How they test their code
    - Their approach to debugging frontend issues
    - Their experience with frontend frameworks and libraries
    - Their knowledge of CSS and styling approaches
    - Their understanding of web accessibility
    - Their experience with frontend build tools and bundlers
    
    Make each question build upon their previous answer to create a natural flow.
    Ensure each question is unique and not a rephrasing of a previous question.
    
    IMPORTANT: After 8-12 questions, you should decide whether to end the interview based on:
    1. If you've covered enough technical areas to evaluate the candidate
    2. If the conversation has reached a natural conclusion
    3. If you've assessed the candidate's knowledge sufficiently
    
    Your response must be in the following JSON format WITHOUT any markdown formatting:
    {"question": "Your next interview question here", "status": "continue"}
    
    If status is "end", the interview will conclude. Only set status to "end" when you've asked at least 8 questions
    and have gathered enough information to evaluate the candidate.
    
    DO NOT include any markdown formatting like \`\`\`json or \`\`\` in your response. Return ONLY the raw JSON object.
  `;
}

// Function to generate AI response
async function generateAIResponse(prompt: string): Promise<AIResponse> {
  try {
    // Get the model - using flash for faster response
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.4, // Increased temperature for more varied and creative questions
        maxOutputTokens: 150, // Increased slightly to accommodate JSON structure
      }
    });
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Clean the response text to extract just the JSON
      const cleanedText = extractJsonFromText(text);
      
      // Parse the JSON response
      const parsedResponse = JSON.parse(cleanedText);
      
      // Validate the response structure
      if (typeof parsedResponse.question === 'string' && 
          (parsedResponse.status === 'continue' || parsedResponse.status === 'end')) {
        return parsedResponse as AIResponse;
      } else {
        // If structure is invalid, return a fallback response
        console.error("Invalid response structure:", parsedResponse);
        return {
          question: parsedResponse.question || "Could you elaborate on your frontend development experience?",
          status: "continue"
        };
      }
    } catch (parseError) {
      // If JSON parsing fails, extract a question from the text response
      console.error("Error parsing JSON response:", parseError);
      console.log("Raw response:", text);
      return {
        question: text.length > 100 ? text.substring(0, 100) + "..." : text,
        status: "continue"
      };
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return {
      question: "Could you tell me more about your experience with React components?",
      status: "continue"
    };
  }
}

// Function to extract JSON from text that might contain markdown formatting
function extractJsonFromText(text: string): string {
  // Remove markdown code block formatting if present
  let cleanedText = text.replace(/```json\s*|\s*```/g, '');
  
  // Try to find JSON object pattern
  const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }
  
  // If no JSON pattern found, return the cleaned text
  return cleanedText;
} 