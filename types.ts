
export interface Prophecy {
  timeframe: string;
  title: string;
  description: string;
  historicalContext: string;
  likelihood: number; // 0 to 100
}

export interface OracleResult {
  introduction: string;
  predictions: Prophecy[];
  conclusion: string;
  sources: { uri: string; title: string }[];
}

export interface SavedProphecy {
  id: string;
  timestamp: number;
  topic: string;
  timeline: string;
  result: OracleResult;
}

export type TimelineOption = '6 months' | '12 months' | '24 months' | '5 years' | 'custom';

export interface UserQuery {
  topic: string;
  timeline: string;
}
