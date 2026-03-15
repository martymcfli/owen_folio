import { GoogleGenAI, Type } from "@google/genai";
import { OpportunityResponse, OpportunitySchema, MarketOpportunity, GroundingSource } from "../types";

// Helper to safely get the API key
const getApiKey = (): string => {
  const key = process.env.API_KEY;
  if (!key) {
    throw new Error("API Key not found in environment variables");
  }
  return key;
};

export const scanMarketOpportunities = async (query: string): Promise<OpportunityResponse> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Act as an expert Technical Recruiter and Market Forecaster. 
    Task: Search for the latest BREAKING news, press releases, or geopolitical shifts regarding: "${query}".
    Focus on events from the last 7 days that will trigger specific hiring surges.
    
    1. Find 3 distinct, high-impact news stories.
    2. For each story, hypothesize strictly which job roles will be in demand as a direct result.
    3. Create a unique, complex "Portfolio Project" idea that a job seeker could build to prove they are ready for that specific opportunity.
    
    Example Logic: 
    News: "Company X is building a new EV battery plant in Arizona."
    Roles: "Process Engineers, PLC Programmers, Supply Chain Analysts."
    Project: "Simulate a battery cell production line optimization model using Python and SimPy."
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Flash is excellent for speed and has search tools
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }], // Enable real-time web access
        responseMimeType: "application/json",
        responseSchema: OpportunitySchema,
        systemInstruction: "You are a real-time job market intelligence engine. Be specific. Avoid generic advice.",
      },
    });

    const rawText = response.text;
    if (!rawText) throw new Error("No content generated");

    const parsedData = JSON.parse(rawText) as { opportunities: MarketOpportunity[] };
    
    // Extract grounding sources if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources: GroundingSource[] = [];

    if (groundingChunks) {
      groundingChunks.forEach(chunk => {
        if (chunk.web) {
          sources.push({ title: chunk.web.title, uri: chunk.web.uri });
        }
      });
    }

    // De-duplicate sources based on URI
    const uniqueSources = sources.filter((v, i, a) => a.findIndex(t => (t.uri === v.uri)) === i);

    return {
      opportunities: parsedData.opportunities,
      groundingSources: uniqueSources.slice(0, 5) // Return top 5 sources
    };

  } catch (error) {
    console.error("Gemini Scan Error:", error);
    throw error;
  }
};