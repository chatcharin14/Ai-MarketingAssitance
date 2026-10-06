export interface GenerateParams {
  productName: string;
  targetAudience: string;
  platform: string;
  tone: string;
  contentGoal: string;
  extraDetails?: string;
  includeVariations?: boolean;
}

export interface AnalysisResult {
  overallScore: number;
  engagementScore: number;
  clarityScore: number;
  ctaScore: number;
  hookRating: string;
  verdict: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  rewrittenVersion: string;
}

export interface HistoryItem {
  id: string;
  type: 'generator' | 'analyzer';
  title: string;
  timestamp: number;
  platform?: string;
  content: string;
  analysis?: AnalysisResult;
  inputPrompt?: string;
}

export interface ApiStatus {
  status: string;
  model: string;
  hasApiKey: boolean;
  provider: string;
}
