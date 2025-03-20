export interface Subject {
  id: string;
  name: string;
}

export interface AnalysisResult {
  summary: string;
  flashcards: Array<{
    question: string;
    answer: string;
  }>;
}

export interface FileItem {
  name: string;
  content: string;
}
