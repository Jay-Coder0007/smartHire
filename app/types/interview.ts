export type JobRole = 
  | 'Frontend Developer' 
  | 'Backend Developer' 
  | 'Full Stack Developer' 
  | 'UI/UX Designer'
  | 'Data Scientist'
  | 'DevOps Engineer'
  | 'Mobile Developer';

export interface JobRoleDetails {
  title: string;
  description: string;
  skills: string[];
  icon: string;
  initialQuestion: string;
}

export const JOB_ROLES: JobRoleDetails[] = [
  {
    title: 'Frontend Developer',
    description: 'Develop user interfaces and experiences for web applications using modern JavaScript frameworks.',
    skills: ['React', 'JavaScript', 'CSS', 'HTML', 'TypeScript', 'Redux'],
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    initialQuestion: 'Let\'s start with your experience in React. How long have you been working with it?'
  },
  {
    title: 'Backend Developer',
    description: 'Build server-side logic, APIs, and database integrations for web applications.',
    skills: ['Node.js', 'Express', 'Python', 'SQL', 'MongoDB', 'API Design'],
    icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01',
    initialQuestion: 'Tell me about your experience with backend technologies and frameworks.'
  },
  {
    title: 'Full Stack Developer',
    description: 'Develop both client and server software for web applications with end-to-end expertise.',
    skills: ['React', 'Node.js', 'JavaScript', 'TypeScript', 'SQL', 'MongoDB'],
    icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    initialQuestion: 'Can you describe your experience with both frontend and backend technologies?'
  },
  {
    title: 'DevOps Engineer',
    description: 'Implement and manage CI/CD pipelines, infrastructure, and deployment processes.',
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Terraform'],
    icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4',
    initialQuestion: 'Tell me about your experience with containerization and cloud infrastructure.'
  },
  {
    title: 'Data Scientist',
    description: 'Analyze and interpret complex data to help organizations make better decisions.',
    skills: ['Python', 'Machine Learning', 'SQL', 'Data Visualization', 'Statistics', 'TensorFlow'],
    icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    initialQuestion: 'Could you share your experience with data analysis and machine learning projects?'
  },
  {
    title: 'UI/UX Designer',
    description: 'Create intuitive, accessible, and visually appealing user interfaces and experiences.',
    skills: ['Figma', 'User Research', 'Wireframing', 'Prototyping', 'Visual Design', 'Accessibility'],
    icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    initialQuestion: 'Tell me about your design process and how you approach user experience challenges.'
  }
];

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface InterviewState {
  jobRole: JobRoleDetails | null;
  messages: Message[];
  isInterviewStarted: boolean;
  isInterviewComplete: boolean;
  isThinking: boolean;
  candidateName: string;
  candidateSkills: string[];
  interviewScore: number | null;
} 