import { GoogleGenAI, Type, Schema, Chat } from "@google/genai";
import { Channel, ContentVariant, KPIMetrics, SimulationFeedback, MarketContext } from "../types";

// NOTE: We initialize strictly with process.env.API_KEY as per guidelines.
// For Veo, we will handle the key selection in the UI component if needed, 
// but the service uses the injected key.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are "Chime Pulse", an elite Strategic Editorial Intelligence Unit.
You don't just write copy; you analyze market dynamics, competitor positioning (Monzo, Revolut, Varo), and cultural zeitgeist.
Your output is sophisticated, data-driven, and designed for a Director-level dashboard.
`;

const ANALYST_INSTRUCTION = `
You are the Chief Strategy Analyst for Chime. 
You provide brief, punchy, data-backed insights into marketing performance and sentiment.
You are talking to the Director of Corporate Editorial. Be concise, insightful, and forward-looking.
`;

export const generateEditorialCampaign = async (topic: string): Promise<ContentVariant[]> => {
    const feedbackSchema: Schema = {
        type: Type.OBJECT,
        properties: {
            persona: { type: Type.STRING },
            sentiment: { type: Type.STRING, enum: ["Positive", "Neutral", "Negative"] },
            critique: { type: Type.STRING }
        },
        required: ["persona", "sentiment", "critique"]
    };

    const metricsSchema: Schema = {
        type: Type.OBJECT,
        properties: {
            reach: { type: Type.INTEGER },
            resonance: { type: Type.INTEGER },
            reputationImpact: { type: Type.INTEGER }
        },
        required: ["reach", "resonance", "reputationImpact"]
    };

    const variantSchema: Schema = {
        type: Type.OBJECT,
        properties: {
            channel: { type: Type.STRING, enum: Object.values(Channel) },
            headline: { type: Type.STRING },
            body: { type: Type.STRING, description: "Full content body. For Twitter, keep it short. For LinkedIn, structured." },
            metrics: metricsSchema,
            feedback: { type: Type.ARRAY, items: feedbackSchema }
        },
        required: ["channel", "headline", "body", "metrics", "feedback"]
    };

    const responseSchema: Schema = {
        type: Type.ARRAY,
        items: variantSchema
    };

    const prompt = `
    Topic: "${topic}"
    
    Task:
    1. Create 3 distinct content variants (LinkedIn, Twitter, Press Release).
    2. Simulate KPI predictions and detailed persona feedback (e.g., 'TechCrunch Editor', 'Retail Investor').
    3. Ensure the tone is 'Chime Authentic': Human, Transparent, Helpful.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
                temperature: 0.7,
            }
        });

        if (response.text) {
            const rawData = JSON.parse(response.text);
            return rawData.map((item: any, index: number) => ({
                id: `var-${Date.now()}-${index}`,
                ...item,
                status: 'simulated'
            }));
        }
        return [];
    } catch (error) {
        console.error("Gemini Generation Error:", error);
        throw new Error("Failed to generate campaign simulations.");
    }
};

export const enhancePrompt = async (rawInput: string): Promise<string> => {
    const prompt = `
    Rewrite the following editorial brief to be more "Chime-y" (Empathetic, Transparent, Innovative) and optimized for high engagement.
    Keep it concise.
    
    Input: "${rawInput}"
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    
    return response.text || rawInput;
};

// --- ANALYST CHAT ---

let chatSession: Chat | null = null;

export const sendMessageToAnalyst = async (message: string, contextData?: string): Promise<string> => {
    if (!chatSession) {
        chatSession = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: {
                systemInstruction: ANALYST_INSTRUCTION
            }
        });
    }

    let fullMessage = message;
    if (contextData) {
        fullMessage += `\n[Context Data: ${contextData}]`;
    }

    try {
        const result = await chatSession.sendMessage({ message: fullMessage });
        return result.text;
    } catch (e) {
        console.error("Chat Error", e);
        return "I'm having trouble analyzing that right now. Try again in a moment.";
    }
};


// --- VIDEO GENERATION (VEO) ---

export const generateCampaignVideo = async (prompt: string): Promise<string | null> => {
    // Check if key is selected (Frontend should handle this, but safety check)
    // We assume the user has clicked the button which triggers the check.
    
    // We recreate the AI instance to ensure fresh auth state if key changed
    const freshAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
        let operation = await freshAi.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: `Cinematic, futuristic fintech visualization. ${prompt}. High quality, professional lighting, 1080p.`,
            config: {
                numberOfVideos: 1,
                resolution: '1080p',
                aspectRatio: '16:9'
            }
        });

        // Poll for completion
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
            operation = await freshAi.operations.getVideosOperation({ operation: operation });
        }

        const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (videoUri) {
            // Append key for playback
            return `${videoUri}&key=${process.env.API_KEY}`;
        }
        return null;
    } catch (e) {
        console.error("Video Gen Error", e);
        throw e;
    }
};

export const getMarketContext = async (): Promise<MarketContext | null> => {
    const prompt = `
    Analyze the current hypothetical fintech landscape for 2026.
    Return JSON with:
    1. 'trendingTopics': 3 key industry buzzwords.
    2. 'competitorAnalysis': Array of objects {name, score, color} comparing Chime (Green), Monzo (Orange), Revolut (Blue), CashApp (Green) on "Brand Trust".
    3. 'sentimentVelocity': Number (-100 to 100) representing market optimism.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        return response.text ? JSON.parse(response.text) : null;
    } catch (e) {
        return null;
    }
};
