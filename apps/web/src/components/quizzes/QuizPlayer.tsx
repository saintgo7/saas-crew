'use client'

import { useState, useEffect, useCallback } from 'react'
import { Quiz, QuizQuestion, submitQuiz, QuizSubmitResult } from '@/lib/api/quizzes'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Clock, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

interface QuizPlayerProps {
  quiz: Quiz
  onComplete: (result: QuizSubmitResult) => void
  onCancel: () => void
}

export function QuizPlayer({ quiz, onComplete, onCancel }: QuizPlayerProps) {
  const { error: showError } = useToast()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeSpent, setTimeSpent] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false)
  const [showConfirmExit, setShowConfirmExit] = useState(false)

  const questions = quiz.questions
  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100
  const answeredCount = Object.keys(answers).length
  const unansweredCount = questions.length - answeredCount

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prev) => {
        if (quiz.timeLimit && prev >= quiz.timeLimit * 60) {
          // Time's up - auto submit
          handleSubmit()
          return prev
        }
        return prev + 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [quiz.timeLimit])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getRemainingTime = () => {
    if (!quiz.timeLimit) return null
    const remaining = quiz.timeLimit * 60 - timeSpent
    return remaining > 0 ? remaining : 0
  }

  const remainingTime = getRemainingTime()
  const isTimeWarning = remainingTime !== null && remainingTime < 60

  const handleAnswerChange = useCallback(
    (value: string) => {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: value,
      }))
    },
    [currentQuestion?.id],
  )

  const handleMultiSelectChange = useCallback(
    (option: string, checked: boolean) => {
      const current = answers[currentQuestion.id] || ''
      const selected = current ? current.split(',') : []

      let newSelected: string[]
      if (checked) {
        newSelected = [...selected, option]
      } else {
        newSelected = selected.filter((s) => s !== option)
      }

      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: newSelected.join(','),
      }))
    },
    [currentQuestion?.id, answers],
  )

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const result = await submitQuiz(quiz.id, {
        answers,
        timeSpent,
      })
      onComplete(result)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit quiz'
      showError(errorMessage)
    } finally {
      setIsSubmitting(false)
      setShowConfirmSubmit(false)
    }
  }

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index)
    }
  }

  const renderQuestion = () => {
    if (!currentQuestion) return null

    const answer = answers[currentQuestion.id] || ''

    switch (currentQuestion.type) {
      case 'MULTIPLE_CHOICE':
        return (
          <RadioGroup value={answer} onValueChange={handleAnswerChange}>
            {currentQuestion.options.map((option, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-2 p-3 rounded-md border hover:bg-muted/50 cursor-pointer"
              >
                <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                <Label
                  htmlFor={`option-${idx}`}
                  className="flex-1 cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case 'MULTIPLE_SELECT':
        const selectedOptions = answer ? answer.split(',') : []
        return (
          <div className="space-y-2">
            {currentQuestion.options.map((option, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-2 p-3 rounded-md border hover:bg-muted/50 cursor-pointer"
              >
                <Checkbox
                  id={`option-${idx}`}
                  checked={selectedOptions.includes(idx.toString())}
                  onCheckedChange={(checked) =>
                    handleMultiSelectChange(idx.toString(), checked as boolean)
                  }
                />
                <Label
                  htmlFor={`option-${idx}`}
                  className="flex-1 cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )

      case 'TRUE_FALSE':
        return (
          <RadioGroup value={answer} onValueChange={handleAnswerChange}>
            <div className="flex items-center space-x-2 p-3 rounded-md border hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="true" id="true" />
              <Label htmlFor="true" className="flex-1 cursor-pointer">
                True
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 rounded-md border hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="false" id="false" />
              <Label htmlFor="false" className="flex-1 cursor-pointer">
                False
              </Label>
            </div>
          </RadioGroup>
        )

      case 'SHORT_ANSWER':
        return (
          <Input
            value={answer}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Type your answer..."
            className="w-full"
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{quiz.title}</h2>
        <div className="flex items-center gap-4">
          {quiz.timeLimit && (
            <Badge
              variant={isTimeWarning ? 'destructive' : 'outline'}
              className="text-lg px-3 py-1"
            >
              <Clock className="h-4 w-4 mr-2" />
              {remainingTime !== null
                ? formatTime(remainingTime)
                : formatTime(timeSpent)}
            </Badge>
          )}
          <Button variant="outline" onClick={() => setShowConfirmExit(true)}>
            Exit
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span>{answeredCount} answered</span>
        </div>
        <Progress value={progress} />
      </div>

      {/* Question navigation dots */}
      <div className="flex flex-wrap gap-2 mb-6">
        {questions.map((q, idx) => (
          <button
            key={q.id}
            onClick={() => goToQuestion(idx)}
            className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
              idx === currentIndex
                ? 'bg-primary text-primary-foreground'
                : answers[q.id]
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg">
              {currentQuestion?.question}
            </CardTitle>
            <Badge variant="outline">{currentQuestion?.points} pts</Badge>
          </div>
        </CardHeader>
        <CardContent>{renderQuestion()}</CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => goToQuestion(currentIndex - 1)}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        {currentIndex === questions.length - 1 ? (
          <Button
            onClick={() => setShowConfirmSubmit(true)}
            disabled={isSubmitting}
          >
            Submit Quiz
          </Button>
        ) : (
          <Button onClick={() => goToQuestion(currentIndex + 1)}>
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showConfirmSubmit} onOpenChange={setShowConfirmSubmit}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              {unansweredCount > 0 && (
                <div className="flex items-center gap-2 text-amber-600 mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>
                    You have {unansweredCount} unanswered question
                    {unansweredCount > 1 ? 's' : ''}.
                  </span>
                </div>
              )}
              Are you sure you want to submit your quiz? You cannot change your
              answers after submission.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Review Answers</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showConfirmExit} onOpenChange={setShowConfirmExit}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              Your progress will not be saved. Are you sure you want to exit?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Quiz</AlertDialogCancel>
            <AlertDialogAction onClick={onCancel}>Exit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
