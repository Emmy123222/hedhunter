export interface InterviewAnswer {
  id:                  string;
  applicationId:       string;
  questionId:          string;
  audioUrl?:           string | null;
  transcript?:         string | null;
  anonymizedTranscript?:string | null;
  isWritten:           boolean;
  createdAt:           Date;
}

export interface RecordingState {
  isRecording: boolean;
  isPaused:    boolean;
  duration:    number;
  audioBlob?:  Blob | null;
  audioUrl?:   string | null;
  error?:      string | null;
}

export interface InterviewSession {
  applicationId:  string;
  questions:      QuestionWithTimer[];
  currentIndex:   number;
  isAccommodated: boolean;
  answers:        Map<string, InterviewAnswer>;
}

export interface QuestionWithTimer {
  id:           string;
  order:        number;
  questionText: string;
  timeLimitSec: number;
  isWritten:    boolean;
  timeRemaining:number;
}

export interface TranscriptionResult {
  transcript:    string;
  language:      string;
  confidence:    number;
  durationSec:   number;
}
