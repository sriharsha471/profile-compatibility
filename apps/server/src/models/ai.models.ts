export interface GenerateContentRequest {
  contents: Content[];
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
  };
}

export interface Content {
  parts: Part[];
  role: string;
}

export interface Part {
  text: string;
}

export interface AnalysisResult {
  alignmentScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  summary: string;
}
