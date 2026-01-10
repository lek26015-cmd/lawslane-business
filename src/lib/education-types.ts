export interface Book {
    id: string;
    title: string;
    description: string;
    price: number;
    coverUrl: string;
    author: string;
    publisher?: string;
    isbn?: string;
    pageCount?: number;
    publishedAt?: Date;
    isDigital: boolean; // true = ebook (pdf), false = physical
    fileUrl?: string; // for ebook
    stock: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Exam {
    id: string;
    title: string;
    description: string;
    price: number; // 0 for free exams
    durationMinutes: number;
    passingScore: number;
    totalQuestions: number;
    coverUrl?: string;
    category: 'license' | 'prosecutor' | 'judge' | 'other';
    difficulty: 'easy' | 'medium' | 'hard';
    createdAt: Date;
    updatedAt: Date;
}

export interface Question {
    id: string;
    examId: string;
    text: string;
    type: 'MULTIPLE_CHOICE' | 'ESSAY'; // Added type
    options?: string[]; // Only for MULTIPLE_CHOICE
    correctOptionIndex?: number; // Only for MULTIPLE_CHOICE
    correctAnswerText?: string; // For ESSAY (Model Answer / ธงคำตอบ)
    explanation?: string;
    order: number;
}

export interface ExamAttempt {
    id: string;
    userId: string;
    examId: string;
    startedAt: Date;
    completedAt?: Date;
    score?: number; // Might be null for Essay until graded
    answers: Record<string, number | string>; // questionId -> index (MC) or text (Essay)
    status: 'IN_PROGRESS' | 'COMPLETED' | 'TIMEOUT';
}
