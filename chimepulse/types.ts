export enum Channel {
    LINKEDIN = 'LinkedIn',
    TWITTER = 'Twitter/X',
    PRESS_RELEASE = 'Press Release',
    TIKTOK = 'TikTok Script',
    INTERNAL_MEMO = 'Internal Memo'
}

export interface KPIMetrics {
    reach: number; 
    resonance: number; 
    reputationImpact: number;
}

export interface SimulationFeedback {
    persona: string;
    sentiment: 'Positive' | 'Neutral' | 'Negative';
    critique: string;
}

export interface ContentVariant {
    id: string;
    channel: Channel;
    headline: string;
    body: string;
    metrics: KPIMetrics;
    feedback: SimulationFeedback[];
    status: 'draft' | 'simulated' | 'published';
    videoUri?: string; // For Veo generated videos
}

export interface CompetitorMetric {
    name: string;
    score: number; // 0-100 narrative strength
    color: string;
}

export interface MarketContext {
    trendingTopics: string[];
    competitorAnalysis: CompetitorMetric[];
    sentimentVelocity: number; // -100 to 100
}

export interface NewsFlash {
    id: string;
    source: string;
    headline: string;
    impactLevel: 'low' | 'med' | 'high';
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
    timestamp: number;
    isTyping?: boolean;
}

export interface VideoState {
    isGenerating: boolean;
    uri: string | null;
    error: string | null;
}
