import { Type } from "@google/genai";

export interface TimberSpecs {
  style: string;
  recommendedWood: string;
  estimatedCost: string;
  structuralComponents: {
    component: string;
    dimensions: string;
    description: string;
  }[];
  joineryDetails: {
    jointType: string;
    location: string;
    complexity: string;
  }[];
  engineeringNotes: string;
}

export interface TimberDesignResult {
  imageUrl: string;
  specs: TimberSpecs;
}

export const TimberSpecSchema = {
  type: Type.OBJECT,
  properties: {
    style: { type: Type.STRING, description: "The architectural style of the frame (e.g., Hammerbeam, Cruck, Post & Beam)." },
    recommendedWood: { type: Type.STRING, description: "Best wood species for this specific design." },
    estimatedCost: { type: Type.STRING, description: "Estimated material cost range." },
    structuralComponents: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          component: { type: Type.STRING, description: "Name of element (e.g., Principal Rafter, Tie Beam)." },
          dimensions: { type: Type.STRING, description: "Suggested dimensions (e.g., 8x8, 10x12)." },
          description: { type: Type.STRING, description: "Function of this component." }
        }
      }
    },
    joineryDetails: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          jointType: { type: Type.STRING, description: "Type of joint (e.g., Mortise & Tenon, Scarf)." },
          location: { type: Type.STRING, description: "Where this joint is used in the frame." },
          complexity: { type: Type.STRING, description: "Fabrication difficulty: Low, Medium, High." }
        }
      }
    },
    engineeringNotes: { type: Type.STRING, description: "Structural considerations and load path analysis." }
  },
  required: ["style", "recommendedWood", "structuralComponents", "joineryDetails", "engineeringNotes"]
};