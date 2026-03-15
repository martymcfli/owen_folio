import { GoogleGenAI } from "@google/genai";
import { GeneratedTrip } from "../types";

const getApiKey = (): string => {
  const key = process.env.API_KEY;
  if (!key) throw new Error("API Key not found");
  return key;
};

export const generateTripPlaylist = async (
  origin: string,
  destination: string,
  vibe: string,
  musicService: string = "VibeDrive AI",
  userLocation?: { lat: number; lng: number }
): Promise<GeneratedTrip> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  // Prompt updated to explicitly request JSON since responseSchema is not supported with googleMaps tool
  const prompt = `
    I am driving from "${origin}" to "${destination}".
    ${userLocation ? `My current GPS location is: Latitude ${userLocation.lat}, Longitude ${userLocation.lng}. Use this if the origin is "Current Location".` : ''}
    My desired music vibe is: "${vibe}".
    My linked music service is: "${musicService}". Please select tracks that are popular and available on this platform.
    
    Task:
    1. Identify the destination. If it's a specific place, tell me about it.
    2. ESTMATE the driving time between these two locations (be realistic).
    3. Generate a playlist of songs where the TOTAL duration matches the estimated driving time exactly (within a 30-second margin).
    4. Ensure the last song is an "arrival anthem" - high energy or fitting for the destination.
    5. The playlist order matters. Start with the vibe, build up, and land perfectly.

    Output MUST be valid JSON with the following structure:
    {
      "estimatedDurationMinutes": number,
      "destinationSummary": "string",
      "playlist": [
        { "title": "string", "artist": "string", "durationSeconds": number, "reasoning": "string" }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Required for Google Maps tool
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }], // Enable Maps grounding
        // Note: responseMimeType and responseSchema are NOT supported with googleMaps tool
        systemInstruction: "You are VibeDrive, an AI DJ that syncs music to travel time perfectly. Use the googleMaps tool to check the destination."
      }
    });

    let rawText = response.text;
    if (!rawText) throw new Error("No trip generated");

    // Clean up markdown code blocks if present
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

    const data = JSON.parse(rawText);
    
    // Extract grounding info if available to enrich destination details
    const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    let destinationName = destination;
    let rating = undefined;

    // Try to find rich map data in grounding chunks
    if (grounding) {
        // Simple heuristic to find a map chunk with a title
        const mapChunk = grounding.find(c => c.web?.title || (c as any).maps?.title); // casting as 'maps' might not be in type def yet but is in response
        if (mapChunk && mapChunk.web) {
            destinationName = mapChunk.web.title || destinationName;
        }
    }

    return {
      context: {
        origin,
        destination,
        vibe,
        estimatedDurationMinutes: data.estimatedDurationMinutes,
        destinationDetails: {
          name: destinationName,
          summary: data.destinationSummary,
          rating: rating
        }
      },
      playlist: data.playlist
    };

  } catch (error) {
    console.error("VibeDrive Error:", error);
    throw error;
  }
};