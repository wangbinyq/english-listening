export interface DictationRecord {
  id: string;
  kekenetId: string;
  audioUrl: string;
  originalText: string;
  userText: string;
  score: number;
  createdAt: Date;
  title: string;
  description: string;
}