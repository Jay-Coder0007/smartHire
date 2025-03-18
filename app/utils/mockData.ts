import { ResumeData } from '../types/resume';

// Mock resume data for testing or fallback
export const mockResumeData: ResumeData = {
  personalInfo: {
    name: "John Anderson",
    email: "john.anderson@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/johnanderson"
  },
  skills: [
    "JavaScript", "TypeScript", "React", "Node.js", "Python",
    "AWS", "Docker", "GraphQL", "MongoDB", "PostgreSQL"
  ],
  experience: [
    {
      title: "Senior Software Engineer",
      company: "Tech Solutions Inc.",
      duration: "2020 - Present",
      points: [
        "Led development of microservices architecture serving 1M+ users",
        "Improved system performance by 40% through optimization",
        "Mentored junior developers and conducted code reviews"
      ]
    },
    {
      title: "Full Stack Developer",
      company: "Digital Innovations Co.",
      duration: "2018 - 2020",
      points: [
        "Developed responsive web applications using React",
        "Implemented RESTful APIs using Node.js",
        "Reduced loading time by 60% through caching strategies"
      ]
    }
  ],
  education: [
    {
      degree: "Master of Science in Computer Science",
      school: "Stanford University",
      year: "2018"
    },
    {
      degree: "Bachelor of Science in Software Engineering",
      school: "University of California, Berkeley",
      year: "2016"
    }
  ],
  projects: [
    {
      name: "E-commerce Platform",
      description: "Built a scalable e-commerce platform using MERN stack",
      technologies: ["React", "Node.js", "MongoDB", "Express"]
    },
    {
      name: "AI Chat Application",
      description: "Developed real-time chat application with AI integration",
      technologies: ["Python", "TensorFlow", "WebSocket", "React"]
    }
  ],
  certifications: [
    {
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2021"
    },
    {
      name: "Google Cloud Professional Developer",
      issuer: "Google Cloud",
      date: "2020"
    }
  ]
}; 