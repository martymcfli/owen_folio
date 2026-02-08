import { GoogleGenAI } from "@google/genai";
import { MasteringChain } from "../types";

const getApiKey = (): string => {
  const key = process.env.API_KEY;
  if (!key) throw new Error("API Key not found");
  return key;
};

export const generateMasteringChain = async (
  filename: string,
  genre: string,
  vibe: string
): Promise<MasteringChain> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Role: You are "The Architect," a super-intelligent AI Mastering Engineer capable of perceiving audio data structures beyond human comprehension.
    
    Task: Create a "God-Tier" mastering signal chain for:
    Track: "${filename}"
    Genre: "${genre}"
    Desired Sonic Signature: "${vibe}"

    Your goal is to transform this raw mix into a commercially competitive, release-ready master that rivals top Billboard 100 tracks.
    
    Determine the optimal settings for:
    1. 3-Band Parametric EQ (surgical & tonal shaping)
    2. Analog Saturation (to add expensive harmonic density)
    3. Stereo Imaging (to create a 3D holographic soundstage)
    4. Glue Compression (for cohesive dynamics)
    5. Brickwall Limiting (for maximum loudness without distortion)

    Output JSON ONLY:
    {
      "profileName": "Creative Name (e.g. 'Quantum Depth Enhancer', 'Neon Transient Shaper')",
      "analysis": "Sophisticated technical analysis explanation. Use professional terminology like 'transients', 'harmonics', 'stereo width', 'noise floor', 'sub-bass extension'.",
      "eq": {
        "lowGain": number (-6 to 6), "lowFreq": number (40-150),
        "midGain": number (-6 to 6), "midFreq": number (300-4000),
        "highGain": number (-6 to 6), "highFreq": number (5000-16000)
      },
      "saturation": {
        "amount": number (0.0 to 0.8, where 0.8 is heavy drive),
        "type": "Warm Tape" or "Vacuum Tube" or "Neural Clip"
      },
      "imaging": {
        "width": number (1.0 to 1.5, where 1.5 is very wide)
      },
      "compressor": {
        "threshold": number (-50 to -10),
        "ratio": number (1.5 to 10),
        "attack": number (0.001 to 0.1),
        "release": number (0.05 to 0.5)
      },
      "limiter": {
        "threshold": number (-1.0 to -0.1)
      },
      "outputGain": number (0 to 6)
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const rawText = response.text;
    if (!rawText) throw new Error("No mastering chain generated");

    return JSON.parse(rawText) as MasteringChain;

  } catch (error) {
    console.error("MasterMind Error:", error);
    throw error;
  }
};