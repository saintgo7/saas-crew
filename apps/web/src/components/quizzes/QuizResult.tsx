'use client'

import { QuizSubmitResult } from '@/lib/api/quizzes'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
  ArrowRight,
} from 'lucide-react'

interface QuizResultProps {
  result: QuizSubmitResult
  onRetry?: () => void
  onContinue: () => void
  canRetry: boolean
}

export function QuizResult({
  result,
  onRetry,
  onContinue,
  canRetry,
}: QuizResultProps) {
  const { score, passed, correctCount, totalQuestions, passingScore } = result

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center pb-2">
          <div
            className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
              passed ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            {passed ? (
              <Trophy className="h-10 w-10 text-green-600" />
            ) : (
              <XCircle className="h-10 w-10 text-red-600" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {passed ? 'Congratulations!' : 'Keep Trying!'}
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            {passed
              ? 'You passed the quiz!'
              : `You need ${passingScore}% to pass.`}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score */}
          <div className="text-center">
            <div
              className={`text-6xl font-bold ${
                passed ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {score}%
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {correctCount} of {totalQuestions} correct
            </p>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Your Score</span>
              <span>Pass: {passingScore}%</span>
            </div>
            <div className="relative">
              <Progress value={score} className="h-3" />
              <div
                className="absolute top-0 bottom-0 border-l-2 border-dashed border-gray-400"
                style={{ left: `${passingScore}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center gap-1 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="font-semibold">{correctCount}</span>
              </div>
              <p className="text-xs text-muted-foreground">Correct</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="flex items-center justify-center gap-1 text-red-600">
                <XCircle className="h-4 w-4" />
                <span className="font-semibold">
                  {totalQuestions - correctCount}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Incorrect</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            {!passed && canRetry && onRetry && (
              <Button onClick={onRetry} variant="outline" className="w-full">
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
            <Button onClick={onContinue} className="w-full">
              {passed ? (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              ) : (
                'Back to Course'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
