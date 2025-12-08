import { GoogleGenAI, Type } from "@google/genai";
import { Question, UserResponse } from "../types";

const createClient = () => {
  const apiKey = process.env.API_KEY || ''; 
  if (!apiKey) {
    console.warn("API_KEY is missing. Gemini service will fail.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateHealthReport = async (
  questions: Question[],
  answers: UserResponse[]
) => {
  const ai = createClient();
  
  // Format data for the prompt
  const userContext = answers.map(ans => {
    const q = questions.find(q => q.id === ans.questionId);
    return `Question: ${q?.text} Answer: ${ans.answer}`;
  }).join('\n');

  const prompt = `
    Analyze the following user health habits and provide personalized health tips.
    
    User Responses:
    ${userContext}

    Please provide the output in JSON format with the following structure:
    {
      "summary": "A 2-3 sentence overall summary of their health status based on inputs.",
      "score": 0-100 (an integer estimating health score),
      "tips": [
        {
          "title": "Tip Title",
          "description": "Detailed actionable advice.",
          "category": "diet" | "activity" | "lifestyle"
        }
      ]
    }
    Provide at least 3 tips, one for each category if possible. Keep tone encouraging and professional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            score: { type: Type.INTEGER },
            tips: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  category: { type: Type.STRING, enum: ['diet', 'activity', 'lifestyle'] }
                }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback mock data if API fails or key is missing
    return {
      summary: "We couldn't generate a live report at this moment, but based on general guidelines, focus on balanced nutrition and regular movement.",
      score: 75,
      tips: [
        {
          title: "Hydration is Key",
          description: "Try to drink at least 8 glasses of water a day to maintain energy levels.",
          category: "diet"
        },
        {
          title: "Keep Moving",
          description: "Aim for 30 minutes of moderate activity most days of the week.",
          category: "activity"
        },
        {
          title: "Sleep Well",
          description: "Prioritize 7-9 hours of sleep for optimal recovery.",
          category: "lifestyle"
        }
      ]
    };
  }
};
