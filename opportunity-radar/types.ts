import { Type } from "@google/genai";

export interface GroundingSource {
  title?: string;
  uri?: string;
}

export interface MarketOpportunity {
  headline: string;
  summary: string;
  impactScore: number;
  location?: string;
  predictedRoles: string[];
  reasoning: string;
  projectIdea: string;
  companyName?: string;
}

export interface OpportunityResponse {
  opportunities: MarketOpportunity[];
  groundingSources?: GroundingSource[];
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  SCANNING = 'SCANNING',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export const OpportunitySchema = {
  type: Type.OBJECT,
  properties: {
    opportunities: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          headline: { type: Type.STRING, description: "The news headline." },
          companyName: { type: Type.STRING, description: "The primary company involved, or 'Industry Wide'." },
          summary: { type: Type.STRING, description: "A concise summary of the event." },
          impactScore: { type: Type.INTEGER, description: "A score 1-100 indicating magnitude of hiring potential." },
          location: { type: Type.STRING, description: "Region or city affected, or 'Remote/Global'." },
          predictedRoles: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of 3-5 specific job titles likely to open."
          },
          reasoning: { type: Type.STRING, description: "Why this news leads to these specific jobs." },
          projectIdea: { type: Type.STRING, description: "A specific portfolio project a candidate could build to impress recruiters for these roles." }
        },
        required: ["headline", "summary", "impactScore", "predictedRoles", "reasoning", "projectIdea"],
      }
    }
  }
};