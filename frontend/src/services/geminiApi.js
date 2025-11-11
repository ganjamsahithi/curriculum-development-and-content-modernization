// frontend/src/services/geminiApi.js
import axios from 'axios'; 

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; 
const MODEL_NAME = 'gemini-2.5-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;


// --- Helper function for prompt creation ---
function createCurriculumPrompt(formData) {
    const { subject, level, duration, focusAreas, learningOutcomes } = formData;
    
    return `
        You are a team of AI Agents (Research Specialist, Instructional Designer, Content Expert, Assessment Designer). 
        Collaboratively create a detailed, pedagogically-sound, student-centered curriculum.

        Context:
        - **Subject:** ${subject}
        - **Level:** ${level}
        - **Duration:** ${duration}
        - **Focus Areas:** ${focusAreas || 'General curriculum'}
        - **Outcomes:** ${learningOutcomes || 'Standard outcomes for the subject and level.'}

        ---
        Your output MUST be a single JSON object. Follow this strict JSON structure:
        
        {
          "subject": "${subject}",
          "target_audience": "${level} Students",
          "duration": "${duration}",
          "vision": "A brief, inspiring vision statement for the entire course.",
          "learning_objectives": ["Learning goal 1", "Learning goal 2", "Learning goal 3"],
          "content_plan": {
            "title": "Detailed Content Outline (${duration})",
            "level_tips": "2-3 tips for success for a ${level} learner.",
            "tools": "Essential tools and software suggested for a ${level} level (e.g., Python, VS Code).",
            "modules": [
              {
                "module_title": "Module 1: Foundation (Weeks 1-3)",
                "weeks": "Weeks 1-3",
                "topics": ["Core Topic 1", "Core Topic 2", "Core Topic 3"],
                "assessment": "Quiz"
              }
            ]
          },
          "projects_by_industry": [
            {
              "title": "Real-world Project Title (e.g., Sentiment Analysis Tool)",
              "level": "${level}",
              "description": "Brief description of the project, including technologies.",
              "github_link": "https://github.com/search?q=${subject}+project+${level}" 
            }
          ],
          "assessment_questions": [
             {
               "question": "Multiple choice question 1 related to core content.",
               "options": ["A", "B", "C", "D"],
               "correct_answer": "B"
             }
          ],
          "references": [
            {"name": "Book/Documentation Title", "link": "https://example.com/link"}
          ]
        }
    `;
}

// --- Curriculum Generator (REST API) ---
export async function generateCurriculum(formData) {
    if (!API_KEY || API_KEY === 'undefined') {
        throw new Error("GEMINI_API_KEY is missing. Please set VITE_GEMINI_API_KEY in your .env file.");
    }
    
    const prompt = createCurriculumPrompt(formData);
    
    try {
        const response = await axios.post(API_URL, {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { 
                 responseMimeType: "application/json", 
            }
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        const responseText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!responseText) {
             throw new Error("API returned no content or an invalid structure.");
        }
        
        const cleanedJson = responseText.replace(/```json\n?|```/g, '').trim();
        return JSON.parse(cleanedJson);

    } catch (error) {
        console.error("Full API Error Details:", error.response?.data || error.message); 
        throw new Error(`API Request Failed. Ensure your API Key is correct.`);
    }
}

// --- NEW: Dashboard Trend Fetcher ---
export async function fetchMarketTrends() {
    if (!API_KEY || API_KEY === 'undefined') {
        return { trends: ["AI Key Missing. Please check VITE_GEMINI_API_KEY in .env."] };
    }
    
    const prompt = `
        You are a Market Research Agent. Provide a short, actionable summary of the top 3-4 current market demands or trending project topics for mid-level software developers/engineers, focusing on Cloud, AI, and Big Data.
        Your output MUST be a single JSON object. Follow this strict JSON structure:
        {
          "trends": [
            "Brief, high-impact trend 1 (e.g., AI in edge computing)", 
            "Brief, high-impact trend 2 (e.g., Serverless Data Pipelines)", 
            "Brief, high-impact trend 3"
          ]
        }
    `;
    
    try {
        const response = await axios.post(API_URL, {
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { 
                 responseMimeType: "application/json", 
                 temperature: 0.2
            }
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        const responseText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!responseText) {
            return { trends: ["Error fetching trends: No content from API."] };
        }
        
        const cleanedJson = responseText.replace(/```json\n?|```/g, '').trim();
        const data = JSON.parse(cleanedJson);
        return data;

    } catch (error) {
        console.error("Dashboard Trend Fetch Error:", error.response?.data || error.message);
        return { trends: ["Error: Could not connect to market agents."] };
    }
}


// --- Chatbot Generator (REST API) ---
export async function generateAnalysis(prompt) {
    if (!API_KEY || API_KEY === 'undefined') {
        return "Sorry, the research assistant is offline due to a missing API Key.";
    }
    
    try {
        const response = await axios.post(API_URL, { 
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                 responseMimeType: "text/plain", 
                 temperature: 0.5 
            }
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        const responseText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        return responseText || "Sorry, I couldn't get analysis content.";

    } catch (error) {
        console.error("Chatbot/Analysis Error:", error.response?.data || error.message);
        return "Sorry, I couldn't connect to the market intelligence agent. Please try again later.";
    }
}