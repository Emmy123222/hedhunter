export interface AIScoreResult {
  id:                 string;
  applicationId:      string;
  answerId:           string;
  score:              number;
  explanation:        string;
  strengths:          string[];
  missingPoints:      string[];
  confidence:         number;
  requiresHumanReview:boolean;
  humanReviewedBy?:   string | null;
  humanReviewedAt?:   Date   | null;
  humanOverrideScore?:number | null;
  createdAt:          Date;
}

export interface AnonymizationResult {
  anonymizedText:  string;
  vectorsRemoved:  string[];
  confidenceScore: number;
  flaggedItems:    { original: string; reason: string }[];
  requiresReview:  boolean;
}

export interface InterviewScoreRequest {
  questionText:  string;
  idealAnswer:   string;
  transcript:    string;
  weight:        number;
  rubric?:       string;
}

export interface InterviewScoreResponse {
  score:        number;
  explanation:  string;
  strengths:    string[];
  missingPoints:string[];
  confidence:   number;
}

export interface ComplianceCheckResult {
  isSafe:       boolean;
  flaggedTopics:string[];
  reason?:      string;
}
