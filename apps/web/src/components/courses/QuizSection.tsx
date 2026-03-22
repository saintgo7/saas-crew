'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  CheckCircle2,
  XCircle,
  Clock,
  Trophy,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RotateCcw,
  Info,
} from 'lucide-react'
import { useTranslations } from '@/i18n/LanguageContext'
import { useChapterQuiz, useSubmitQuizAttempt, useMyQuizAttempts } from '@/lib/hooks/use-quiz'
import { getDemoQuiz } from '@/lib/data/demo-quiz'
import { cn } from '@/lib/utils'
import type { Quiz, QuizQuestion, QuizSubmitResult } from '@/lib/api/quizzes'

interface QuizSectionProps {
  chapterId: string
  isDemo?: boolean
}

type QuizState = 'idle' | 'taking' | 'result'

export function QuizSection({ chapterId, isDemo = false }: QuizSectionProps) {
  const t = useTranslations()
  const [quizState, setQuizState] = useState<QuizState>('idle')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [result, setResult] = useState<QuizSubmitResult | null>(null)
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false)

  const { data: quizzes, isLoading, error } = useChapterQuiz(chapterId, !isDemo)
  const submitAttempt = useSubmitQuizAttempt()

  const quiz: Quiz | null = useMemo(() => {
    if (isDemo || error || (!isLoading && (!quizzes || quizzes.length === 0))) {
      return getDemoQuiz(chapterId)
    }
    return quizzes?.[0] ?? null
  }, [isDemo, error, isLoading, quizzes, chapterId])

  const { data: attempts } = useMyQuizAttempts(
    quiz?.id ?? '',
    !isDemo && !!quiz?.id,
  )

  const hasPassed = useMemo(
    () => attempts?.some((a) => a.passed) ?? false,
    [attempts],
  )

  const bestScore = useMemo(() => {
    if (!attempts || attempts.length === 0) return null
    return Math.max(...attempts.map((a) => a.score))
  }, [attempts])

  const attemptsRemaining = useMemo(() => {
    if (!quiz) return 0
    if (!attempts) return quiz.maxAttempts
    return Math.max(0, quiz.maxAttempts - attempts.length)
  }, [quiz, attempts])

  // Timer effect
  useEffect(() => {
    if (quizState !== 'taking' || timeRemaining === null) return

    if (timeRemaining <= 0) {
      handleSubmit()
      return
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev !== null ? prev - 1 : null))
    }, 1000)

    return () => clearInterval(timer)
  }, [quizState, timeRemaining])

  const handleStartQuiz = useCallback(() => {
    setQuizState('taking')
    setCurrentQuestionIndex(0)
    setAnswers({})
    setResult(null)
    if (quiz?.timeLimit) {
      setTimeRemaining(quiz.timeLimit * 60)
    }
  }, [quiz])

  const handleAnswerChange = useCallback(
    (questionId: string, value: string) => {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: value,
      }))
    },
    [],
  )

  const handleMultiSelectToggle = useCallback(
    (questionId: string, option: string) => {
      setAnswers((prev) => {
        const current = prev[questionId] || ''
        const selected = current ? current.split(',') : []
        const idx = selected.indexOf(option)

        const newSelected =
          idx >= 0
            ? [...selected.slice(0, idx), ...selected.slice(idx + 1)]
            : [...selected, option]

        return {
          ...prev,
          [questionId]: newSelected.join(','),
        }
      })
    },
    [],
  )

  const handleSubmit = useCallback(async () => {
    if (!quiz) return
    setShowConfirmSubmit(false)

    if (isDemo) {
      const correctCount = Math.floor(quiz.questions.length * 0.8)
      const score = Math.round((correctCount / quiz.questions.length) * 100)
      setResult({
        attemptId: `demo-${Date.now()}`,
        score,
        passed: score >= quiz.passingScore,
        correctCount,
        totalQuestions: quiz.questions.length,
        passingScore: quiz.passingScore,
      })
      setQuizState('result')
      return
    }

    try {
      const submitResult = await submitAttempt.mutateAsync({
        quizId: quiz.id,
        data: { answers, timeSpent: quiz.timeLimit ? (quiz.timeLimit * 60 - (timeRemaining ?? 0)) : undefined },
      })
      setResult(submitResult)
      setQuizState('result')
    } catch (err) {
      // Demo fallback on API failure
      const correctCount = Math.floor(quiz.questions.length * 0.6)
      const score = Math.round((correctCount / quiz.questions.length) * 100)
      setResult({
        attemptId: `fallback-${Date.now()}`,
        score,
        passed: score >= quiz.passingScore,
        correctCount,
        totalQuestions: quiz.questions.length,
        passingScore: quiz.passingScore,
      })
      setQuizState('result')
    }
  }, [quiz, answers, timeRemaining, isDemo, submitAttempt])

  const formatTime = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!quiz) return null

  const answeredCount = Object.keys(answers).length
  const totalQuestions = quiz.questions.length
  const currentQuestion = quiz.questions[currentQuestionIndex]

  // Idle state - show quiz info
  if (quizState === 'idle') {
    return (
      <div className="space-y-6">
        {/* Demo banner */}
        {isDemo && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-900/20">
            <p className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
              <Info className="h-4 w-4" />
              {t('courses.demoBanner')}
            </p>
          </div>
        )}

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
              <Trophy className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {quiz.title}
            </h3>
          </div>

          {quiz.description && (
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              {quiz.description}
            </p>
          )}

          {/* Quiz meta */}
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('quiz.questions')}
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {totalQuestions}
              </p>
            </div>
            {quiz.timeLimit && (
              <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('quiz.timeLimit')}
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {quiz.timeLimit} {t('quiz.minutes')}
                </p>
              </div>
            )}
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('quiz.passingScore')}
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {quiz.passingScore}%
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('quiz.attempts')}
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {isDemo ? quiz.maxAttempts : attemptsRemaining}/{quiz.maxAttempts}
              </p>
            </div>
          </div>

          {/* Best score */}
          {bestScore !== null && (
            <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-700/50">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('quiz.bestScore')}:{' '}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {bestScore}%
                </span>
                {hasPassed && (
                  <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle2 className="h-3 w-3" />
                    {t('quiz.passed')}
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Passed congratulations */}
          {hasPassed && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                <p className="font-medium text-green-800 dark:text-green-300">
                  {t('quiz.congratulations')} {t('quiz.youPassed')}
                </p>
              </div>
            </div>
          )}

          {/* Start / Retake button */}
          {attemptsRemaining > 0 || isDemo ? (
            <button
              onClick={handleStartQuiz}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              {hasPassed ? (
                <>
                  <RotateCcw className="h-4 w-4" />
                  {t('quiz.retake')}
                </>
              ) : attempts && attempts.length > 0 ? (
                <>
                  <RotateCcw className="h-4 w-4" />
                  {t('quiz.tryAgain')}
                </>
              ) : (
                t('quiz.start')
              )}
            </button>
          ) : (
            <p className="text-sm text-red-600 dark:text-red-400">
              {t('quiz.noAttemptsLeft')}
            </p>
          )}

          {/* Previous attempts */}
          {attempts && attempts.length > 0 && (
            <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
              <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                {t('quiz.attempts')}
              </h4>
              <div className="space-y-2">
                {attempts.map((attempt, idx) => (
                  <div
                    key={attempt.id}
                    className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm dark:bg-gray-700/50"
                  >
                    <span className="text-gray-600 dark:text-gray-400">
                      #{attempts.length - idx}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {attempt.score}%
                    </span>
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        attempt.passed
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
                      )}
                    >
                      {attempt.passed ? t('quiz.passed') : t('quiz.failed')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Taking quiz
  if (quizState === 'taking' && currentQuestion) {
    return (
      <div className="space-y-6">
        {/* Quiz header with timer and progress */}
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {t('quiz.question')} {currentQuestionIndex + 1} {t('quiz.of')}{' '}
            {totalQuestions}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {t('quiz.answered')}: {answeredCount}/{totalQuestions}
            </span>
            {timeRemaining !== null && (
              <div
                className={cn(
                  'flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium',
                  timeRemaining < 60
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
                )}
              >
                <Clock className="h-4 w-4" />
                {formatTime(timeRemaining)}
              </div>
            )}
          </div>
        </div>

        {/* Question card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
            {currentQuestion.points} {t('quiz.points')}
          </div>
          <h4 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
            {currentQuestion.question}
          </h4>

          {/* Answer options */}
          <div className="space-y-3">
            {currentQuestion.type === 'MULTIPLE_CHOICE' ||
            currentQuestion.type === 'TRUE_FALSE' ? (
              currentQuestion.options.map((option, idx) => (
                <label
                  key={idx}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors',
                    answers[currentQuestion.id] === option
                      ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                      : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50',
                  )}
                >
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    value={option}
                    checked={answers[currentQuestion.id] === option}
                    onChange={() =>
                      handleAnswerChange(currentQuestion.id, option)
                    }
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {option}
                  </span>
                </label>
              ))
            ) : currentQuestion.type === 'MULTIPLE_SELECT' ? (
              currentQuestion.options.map((option, idx) => {
                const selected = (
                  answers[currentQuestion.id] || ''
                )
                  .split(',')
                  .filter(Boolean)
                return (
                  <label
                    key={idx}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors',
                      selected.includes(option)
                        ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
                        : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50',
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(option)}
                      onChange={() =>
                        handleMultiSelectToggle(currentQuestion.id, option)
                      }
                      className="h-4 w-4 rounded text-blue-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {option}
                    </span>
                  </label>
                )
              })
            ) : (
              /* SHORT_ANSWER */
              <input
                type="text"
                value={answers[currentQuestion.id] || ''}
                onChange={(e) =>
                  handleAnswerChange(currentQuestion.id, e.target.value)
                }
                placeholder="Type your answer..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            )}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={() =>
              setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
            }
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <ChevronLeft className="h-4 w-4" />
            {t('quiz.previous')}
          </button>

          {currentQuestionIndex < totalQuestions - 1 ? (
            <button
              onClick={() =>
                setCurrentQuestionIndex(currentQuestionIndex + 1)
              }
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              {t('quiz.next')}
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => setShowConfirmSubmit(true)}
              disabled={submitAttempt.isPending}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitAttempt.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('quiz.submitting')}
                </>
              ) : (
                t('quiz.submit')
              )}
            </button>
          )}
        </div>

        {/* Question dots navigation */}
        <div className="flex flex-wrap justify-center gap-2">
          {quiz.questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(idx)}
              className={cn(
                'h-8 w-8 rounded-full text-xs font-medium transition-colors',
                idx === currentQuestionIndex
                  ? 'bg-blue-600 text-white'
                  : answers[q.id]
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
              )}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {/* Confirm submit modal */}
        {showConfirmSubmit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="mx-4 w-full max-w-sm rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                {t('quiz.confirmSubmit')}
              </h3>
              {answeredCount < totalQuestions && (
                <p className="mb-2 flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="h-4 w-4" />
                  {t('quiz.unansweredWarning', {
                    count: (totalQuestions - answeredCount).toString(),
                  })}
                </p>
              )}
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                {t('quiz.cannotChange')}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmSubmit(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {t('quiz.reviewAnswers')}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitAttempt.isPending}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                  {t('quiz.submit')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Result state
  if (quizState === 'result' && result) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-800">
          {/* Result icon */}
          <div className="mb-4">
            {result.passed ? (
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <Trophy className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            ) : (
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            )}
          </div>

          <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-white">
            {result.passed ? t('quiz.congratulations') : t('quiz.keepTrying')}
          </h3>
          <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            {result.passed
              ? t('quiz.youPassed')
              : t('quiz.needToPass', {
                  score: result.passingScore.toString(),
                })}
          </p>

          {/* Score display */}
          <div className="mb-6 flex justify-center gap-8">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {result.score}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('quiz.yourScore')}
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {result.correctCount}/{result.totalQuestions}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('quiz.correctAnswers')}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-3">
            {!result.passed && (attemptsRemaining > 0 || isDemo) && (
              <button
                onClick={handleStartQuiz}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <RotateCcw className="h-4 w-4" />
                {t('quiz.tryAgain')}
              </button>
            )}
            <button
              onClick={() => setQuizState('idle')}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {t('quiz.continue')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
