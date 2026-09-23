export type ToeicPart = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface ToeicQuestion {
  id: number;
  part: ToeicPart;
  questionNumber: number; // 1 to 200
  audioUrl?: string; // audio snippet or full audio timestamp
  imageUrl?: string; // for Part 1 or Part 7 charts
  passage?: string; // for Part 6 & 7 reading passages or Part 3 & 4 transcripts
  questionText?: string;
  options: {
    A: string;
    B: string;
    C: string;
    D?: string; // Part 2 only has A, B, C
  };
  correctAnswer: "A" | "B" | "C" | "D";
  explanation: {
    translation: string;
    analysis: string;
    vocabulary?: { word: string; meaning: string; phonetic?: string }[];
  };
}

export interface ToeicTest {
  id: string;
  title: string;
  description: string;
  year: number;
  difficulty: "Dễ" | "Trung bình" | "Khó";
  totalQuestions: number;
  durationMinutes: number;
  questions: ToeicQuestion[];
}

export interface UserAnswerRecord {
  selectedAnswer: "A" | "B" | "C" | "D" | null;
  isCorrect: boolean;
  timeSpentSeconds?: number;
}

export interface TestResultSummary {
  testId: string;
  testTitle: string;
  completedAt: string;
  listeningCorrect: number;
  readingCorrect: number;
  totalCorrect: number;
  listeningScore: number; // 5 - 495
  readingScore: number; // 5 - 495
  totalScore: number; // 10 - 990
  timeSpentSeconds: number;
  answers: Record<number, UserAnswerRecord>;
}

// 4 Listening Modes Types
export interface ListeningSentence {
  id: string;
  audioText: string;
  vietnameseTranslation: string;
  audioStartMs?: number;
  audioEndMs?: number;
  keywordsToFill: string[]; // for Fill in the blanks mode
  grammarNote?: string;
}

export interface ListeningLesson {
  id: string;
  title: string;
  category: "Part 1 - Photo" | "Part 2 - Q&A" | "Part 3 - Conversations" | "Part 4 - Short Talks";
  level: "Beginner (350+)" | "Intermediate (650+)" | "Advanced (800+)";
  sentences: ListeningSentence[];
}

// Flashcard & SRS Types
export interface VocabWord {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  meaningVi: string;
  exampleEn: string;
  exampleVi: string;
  category: string;
  masteryLevel: "new" | "learning" | "mastered"; // SRS state
  lastReviewed?: string;
  nextReview?: string;
}

// Grammar Question Types
export interface GrammarQuestion {
  id: string;
  topic: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: "A" | "B" | "C" | "D";
  explanation: string;
  vietnameseTranslation: string;
  keyRule: string;
}
