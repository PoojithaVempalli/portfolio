
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Resume knowledge base
const RESUME_CONTEXT = `
POOJITHA VEMPALLI - PORTFOLIO INFORMATION

PERSONAL DETAILS:
- Name: Poojitha Vempalli
- Title: Full Stack Developer & Computer Science Graduate Student
- Location: Denton, Texas, USA
- Description: Passionate Full Stack Developer and Computer Science graduate student with a love for problem-solving and creating impactful digital experiences

EDUCATION:
- Institution: University of North Texas, Denton, Texas, USA
- Degree: Master's in Computer Science
- GPA: 4.0/4.0 (Perfect GPA)
- Status: Current graduate student

PROFESSIONAL EXPERIENCE:
- Fashion Index (Full Stack Developer role)
- Capgemini Technology Services (Technology role)
- Specializes in creating innovative web solutions and scalable applications

TECHNICAL SKILLS:
- Frontend: HTML5, CSS3, JavaScript, React, Angular
- Backend: Node.js, Spring Boot, Python, Java
- Databases: MongoDB, SQL
- Cloud: AWS, Azure
- DevOps: Docker, CI/CD, Git
- API Development: REST APIs
- Other: Problem-solving, Web Development, Full Stack Development

KEY PROJECTS:
1. Public Restroom Locator
   - Description: Comprehensive web-based solution to locate public restrooms
   - Impact: Enhanced accessibility for over 10,000 users
   - Technologies: HTML, CSS, JavaScript, MongoDB
   - Type: Web application with database integration

CERTIFICATIONS:
- Azure Fundamentals
- Developer Associate
- Cloud Practitioner
- Cloud Digital Leader

PROFESSIONAL QUALITIES:
- Passionate about technology and innovation
- Continuous learner staying at forefront of tech landscape
- Problem-solver focused on creating impactful digital experiences
- Open to discussing new opportunities and interesting projects
`;

// System prompt for the chatbot
const SYSTEM_PROMPT = `You are Poojitha's Portfolio Assistant, a helpful AI chatbot representing Poojitha Vempalli's professional portfolio. Your role is to answer questions about Poojitha's background, skills, experience, education, and projects based STRICTLY on the resume information provided.

GUIDELINES:
1. Be friendly, professional, and enthusiastic when discussing Poojitha's qualifications
2. Only provide information that is explicitly mentioned in the resume context
3. If asked about information not in the resume, politely explain that you don't have that specific information
4. Encourage users to contact Poojitha directly for detailed discussions about opportunities
5. Maintain a conversational but professional tone
6. Use first person when appropriate (e.g., "Poojitha has experience with..." or "She specializes in...")
7. Highlight her achievements, perfect GPA, and diverse technical skills
8. If asked general programming or tech questions not related to Poojitha's portfolio, redirect back to her qualifications

Remember: You represent Poojitha's professional brand, so always be positive and highlight her strengths while staying factual.`;

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Construct messages for OpenAI
    const messages = [
      {
        role: 'system',
        content: `${SYSTEM_PROMPT}\n\nRESUME CONTEXT:\n${RESUME_CONTEXT}`
      }
    ];

    // Add conversation history
    conversationHistory.forEach(msg => {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    });

    // Add current user message
    messages.push({
      role: 'user',
      content: message
    });

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const botResponse = completion.choices[0].message.content;

    res.json({
      success: true,
      response: botResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    
    // Handle different types of errors
    if (error.code === 'insufficient_quota') {
      res.status(402).json({ 
        error: 'OpenAI API quota exceeded. Please try again later.' 
      });
    } else if (error.code === 'invalid_api_key') {
      res.status(401).json({ 
        error: 'Invalid OpenAI API key configuration.' 
      });
    } else {
      res.status(500).json({ 
        error: 'Sorry, I encountered an error. Please try again.' 
      });
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Poojitha Portfolio Chatbot API'
  });
});

// Serve static files (your existing portfolio)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Start server
app.listen(PORT, () => {
  console.log(`🤖 Portfolio Chatbot Server running on port ${PORT}`);
  console.log(`📱 Chat API available at http://localhost:${PORT}/api/chat`);
  console.log(`🌐 Portfolio available at http://localhost:${PORT}`);
  
  // Check if OpenAI API key is configured
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  WARNING: OPENAI_API_KEY not found in environment variables');
    console.log('📝 Please create a .env file with your OpenAI API key');
  }
});

module.exports = app;