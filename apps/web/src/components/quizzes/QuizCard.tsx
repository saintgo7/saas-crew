'use client'

import { Quiz } from '@/lib/api/quizzes'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Target, RotateCcw, CheckCircle, XCircle } from 'lucide-react'

interface QuizCardProps {
  quiz: Quiz & {
    _count?: {
      questions: number
      attempts: number
    }
  }
  attemptCount?: number
  bestScore?: number
  onStart?: () => void
  isLoading?: boolean
}

export function QuizCard({
  quiz,
  attemptCount = 0,
  bestScore,
  onStart,
  isLoading = false,
}: QuizCardProps) {
  const hasAttemptsRemaining = attemptCount < quiz.maxAttempts
  const hasPassed = bestScore !== undefined && bestScore >= quiz.passingScore
  const questionCount = quiz._count?.questions ?? quiz.questions?.length ?? 0

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{quiz.title}</CardTitle>
          <div className="flex gap-2">
            {hasPassed && (
              <Badge variant="default" className="bg-green-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Passed
              </Badge>
            )}
            {!quiz.isPublished && (
              <Badge variant="secondary">Draft</Badge>
            )}
          </div>
        </div>
        {quiz.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {quiz.description}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            <span>{questionCount} questions</span>
          </div>
          {quiz.timeLimit && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{quiz.timeLimit} min</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <RotateCcw className="h-4 w-4" />
            <span>
              {attemptCount}/{quiz.maxAttempts} attempts
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span>Pass: {quiz.passingScore}%</span>
          </div>
        </div>

        {bestScore !== undefined && (
          <div className="mb-4 p-2 bg-muted rounded-md">
            <div className="flex items-center justify-between">
              <span className="text-sm">Best Score:</span>
              <span
                className={`font-semibold ${
                  bestScore >= quiz.passingScore
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {bestScore}%
              </span>
            </div>
          </div>
        )}

        <Button
          onClick={onStart}
          disabled={!hasAttemptsRemaining || !quiz.isPublished || isLoading}
          className="w-full"
        >
          {isLoading ? (
            'Loading...'
          ) : !quiz.isPublished ? (
            'Not Available'
          ) : hasPassed ? (
            hasAttemptsRemaining ? (
              'Retake Quiz'
            ) : (
              'Completed'
            )
          ) : hasAttemptsRemaining ? (
            attemptCount > 0 ? (
              'Try Again'
            ) : (
              'Start Quiz'
            )
          ) : (
            'No Attempts Left'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
