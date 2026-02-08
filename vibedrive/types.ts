import { Type } from "@google/genai";

export interface Track {
  title: string;
  artist: string;
  durationSeconds: number; // Duration in seconds
  reasoning?: string; // Why this song fits the vibe/location
}

export interface TripContext {
  origin: string;
  destination: string;
  vibe: string;
  estimatedDurationMinutes: number;
  destinationDetails?: {
    name: string;
    rating?: number;
    summary?: string;
  };
}

export interface GeneratedTrip {
  context: TripContext;
  playlist: Track[];
}

export const TripSchema = {
  type: Type.OBJECT,
  properties: {
    estimatedDurationMinutes: { type: Type.INTEGER, description: "Estimated driving time in minutes between origin and destination." },
    destinationSummary: { type: Type.STRING, description: "A short, exciting description of the destination vibe." },
    playlist: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          artist: { type: Type.STRING },
          durationSeconds: { type: Type.INTEGER, description: "Exact duration in seconds." },
          reasoning: { type: Type.STRING, description: "Why this song works here." }
        },
        required: ["title", "artist", "durationSeconds"]
      }
    }
  },
  required: ["estimatedDurationMinutes", "playlist", "destinationSummary"]
};