export interface Expert {
  id: string;
  name: string;
  profileLink: string;
  avatar: string;
  accuracy: number;
  rating: number;
  totalPredictions: number;
  fulfilledPredictions: number;
  failedPredictions: number;
}

export interface Prediction {
  id: string;
  expert: Expert;
  topic: Topic;
  originalQuote: string;
  interpretation: string;
  status: 'pending' | 'fulfilled' | 'failed';
  verificationStatus: 'auto_verified' | 'manual_verified' | 'unverifiable';
  source: string;
  sourceTimestamp?: number;
  createdAt: string;
  targetDate: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface Topic {
  id: string;
  name: string;
  icon: string;
  predictionsCount: number;
  successRate: number;
}

export type PredictionStatus = 'all' | 'pending' | 'fulfilled' | 'failed';
export type ConfidenceLevel = 'all' | 'high' | 'medium' | 'low';
