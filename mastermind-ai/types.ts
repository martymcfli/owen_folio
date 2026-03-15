export interface AudioFile {
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface MasteringChain {
  genre: string;
  profileName: string;
  analysis: string;
  eq: {
    lowGain: number; // dB
    midGain: number; // dB
    highGain: number; // dB
    lowFreq: number; // Hz
    midFreq: number; // Hz
    highFreq: number; // Hz
  };
  saturation: {
    amount: number; // 0 to 1 (intensity)
    type: 'Warm Tape' | 'Vacuum Tube' | 'Neural Clip';
  };
  imaging: {
    width: number; // 1.0 is normal, 1.2+ is wide
  };
  compressor: {
    threshold: number; // dB
    ratio: number;
    attack: number; // seconds
    release: number; // seconds
  };
  limiter: {
    threshold: number; // dB ceiling
  };
  outputGain: number; // dB
}

export const DefaultChain: MasteringChain = {
  genre: "Unknown",
  profileName: "Neural Bypass",
  analysis: "Awaiting audio input...",
  eq: { lowGain: 0, midGain: 0, highGain: 0, lowFreq: 100, midFreq: 1000, highFreq: 5000 },
  saturation: { amount: 0, type: 'Warm Tape' },
  imaging: { width: 1.0 },
  compressor: { threshold: 0, ratio: 1, attack: 0.1, release: 0.25 },
  limiter: { threshold: -0.1 },
  outputGain: 0
};