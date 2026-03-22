import type { Quiz, QuizAttempt } from '@/lib/api/quizzes'

/**
 * Generate demo quiz for a chapter
 */
export function getDemoQuiz(chapterId: string): Quiz {
  return {
    id: `demo-quiz-${chapterId}`,
    title: 'Chapter Quiz',
    description: 'Test your understanding of this chapter.',
    chapterId,
    passingScore: 70,
    timeLimit: 10,
    maxAttempts: 3,
    shuffleQuestions: false,
    isPublished: true,
    questions: [
      {
        id: `${chapterId}-q1`,
        type: 'MULTIPLE_CHOICE',
        question: 'What is the primary purpose of version control systems?',
        options: [
          'To make code run faster',
          'To track changes and collaborate on code',
          'To compile source code',
          'To design user interfaces',
        ],
        order: 1,
        points: 10,
      },
      {
        id: `${chapterId}-q2`,
        type: 'TRUE_FALSE',
        question: 'Git is a distributed version control system.',
        options: ['True', 'False'],
        order: 2,
        points: 10,
      },
      {
        id: `${chapterId}-q3`,
        type: 'MULTIPLE_SELECT',
        question: 'Which of the following are JavaScript data types? (Select all that apply)',
        options: ['String', 'Number', 'Integer', 'Boolean', 'Character'],
        order: 3,
        points: 10,
      },
      {
        id: `${chapterId}-q4`,
        type: 'SHORT_ANSWER',
        question: 'What command is used to initialize a new Git repository?',
        options: [],
        order: 4,
        points: 10,
      },
      {
        id: `${chapterId}-q5`,
        type: 'MULTIPLE_CHOICE',
        question: 'Which HTTP method is typically used to create a new resource?',
        options: ['GET', 'POST', 'PUT', 'DELETE'],
        order: 5,
        points: 10,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

/**
 * Generate demo quiz attempt result
 */
export function getDemoQuizResult(quizId: string): QuizAttempt {
  return {
    id: `demo-attempt-${quizId}`,
    userId: 'demo-user',
    quizId,
    answers: {},
    score: 80,
    passed: true,
    timeSpent: 300,
    startedAt: new Date(Date.now() - 600000).toISOString(),
    completedAt: new Date().toISOString(),
  }
}
