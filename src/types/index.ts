export interface DictationRecord {
  id: string;
  audioUrl: string;
  originalText: string;
  userText: string;
  score: number;
  createdAt: Date;
}