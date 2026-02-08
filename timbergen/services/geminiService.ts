import { GoogleGenAI } from "@google/genai";
import { TimberDesignResult, TimberSpecSchema, TimberSpecs } from "../types";

const getApiKey = (): string => {
  const key = process.env.API_KEY;
  if (!key) throw new Error("API Key not found");
  return key;
};

export const generateTimberDesign = async (
  prompt: string,
  style: string,
  woodType: string
): Promise<TimberDesignResult> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  // 1. Image Generation Prompt
  const imagePrompt = `
    Architectural visualization of a ${style} style timber frame structure. 
    Constructed from ${woodType}. 
    ${prompt}. 
    High angle professional architectural photography, 8k resolution, photorealistic, 
    visible intricate joinery, mortise and tenon details, exposed beams, 
    warm lighting, construction site or scenic landscape background.
  `;

  // 2. Engineering Specs Prompt
  const specsPrompt = `
    Act as a Structural Engineer specializing in Timber Framing.
    Analyze a design for a: ${style} structure using ${woodType}.
    User description: "${prompt}".
    
    Provide a preliminary technical specification including:
    - Best wood species if user choice is suboptimal, otherwise confirm choice.
    - List of primary structural members (Posts, Plates, Beams, Rafters) with typical nominal dimensions.
    - Specific traditional joinery types required (e.g., English Tying Joint, Scarf Joint, Wedged Anchor Beam).
    - Structural load path notes.
  `;

  try {
    // Run generation in parallel for speed
    const [imageRes, specsRes] = await Promise.all([
      // Image Generation
      ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: imagePrompt }] },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
            imageSize: "1K" // Use 1K for preview speed, upgradeable if needed
          }
        }
      }),
      // Text/Specs Generation
      ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: specsPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: TimberSpecSchema,
          systemInstruction: "You are a Master Timber Framer and Structural Engineer. Be highly technical."
        }
      })
    ]);

    // Extract Image
    let imageUrl = '';
    const imagePart = imageRes.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (imagePart?.inlineData?.data) {
      imageUrl = `data:image/png;base64,${imagePart.inlineData.data}`;
    }

    // Extract Specs
    const specsText = specsRes.text;
    const specs = specsText ? JSON.parse(specsText) as TimberSpecs : null;

    if (!imageUrl || !specs) {
      throw new Error("Failed to generate complete design package.");
    }

    return { imageUrl, specs };

  } catch (error) {
    console.error("TimberGen Error:", error);
    throw error;
  }
};