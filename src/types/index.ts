export interface DictationRecord {
  id: string;
  kekenetId: string;
  audioUrl: string;
  originalText: string;
  userText: string;
  score: number;
  timeSpent: number; // Time spent in seconds
  createdAt: Date;
  title: string;
  description: string;
}