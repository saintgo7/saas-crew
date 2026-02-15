'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Users, GraduationCap, UserPlus, Clock, Award, AlertCircle, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { MentorCard } from '@/components/mentoring/MentorCard'
import { MenteeCard } from '@/components/mentoring/MenteeCard'
import { MentorshipRequest } from '@/components/mentoring/MentorshipRequest'
import { RatingModal } from '@/components/mentoring/RatingModal'
import { FindMentorModal } from '@/components/mentoring/FindMentorModal'
import { useTranslations } from '@/i18n/LanguageContext'
import {
  useMentoringDashboard,
  useAcceptMentorship,
  useRejectMentorship,
  useCancelRequest,
  useRecordSession,
  useCompleteMentorship,
  useRateMentorship,
} from '@/lib/hooks'
import { useUserStore } from '@/store/user-store'
import type { Mentorship, UserRank } from '@/lib/api/types'

// Check if user can request mentorship based on rank
function canRequestMentorship(rank?: UserRank): boolean {
  // JUNIOR can request SENIOR or MASTER
  // SENIOR can request MASTER
  // MASTER cannot request mentorship
  return rank === 'JUNIOR' || rank === 'SENIOR'
}

export default function MentoringPage() {
  const t = useTranslations()
  const router = useRouter()
  const { user } = useUserStore()
  const [isFindMentorOpen, setIsFindMentorOpen] = useState(false)
  const [ratingMentorship, setRatingMentorship] = useState<Mentorship | null>(null)
  const [currentUserRank, setCurrentUserRank] = useState<UserRank | undefined>()

  // Fetch mentoring dashboard data only when user is logged in
  const { data: dashboard, isLoading, error, refetch } = useMentoringDashboard()

  // Mutations
  const acceptMentorship = useAcceptMentorship()
  const rejectMentorship = useRejectMentorship()
  const cancelRequest = useCancelRequest()
  const recordSession = useRecordSession()
  const completeMentorship = useCompleteMentorship()
  const rateMentorship = useRateMentorship()

  // Get current user's rank from mentoring data
  useEffect(() => {
    if (dashboard?.myMentors?.length && dashboard.myMentors[0]?.mentee) {
      setCurrentUserRank(dashboard.myMentors[0].mentee.rank)
    } else if (dashboard?.myMentees?.length && dashboard.myMentees[0]?.mentor) {
      setCurrentUserRank(dashboard.myMentees[0].mentor.rank)
    }
  }, [dashboard])

  // Handlers
  const handleAcceptRequest = async (requestId: string) => {
    await acceptMentorship.mutateAsync(requestId)
  }

  const handleRejectRequest = async (requestId: string) => {
    await rejectMentorship.mutateAsync(requestId)
  }

  const handleCancelRequest = async (requestId: string) => {
    await cancelRequest.mutateAsync(requestId)
  }

  const handleRecordSession = async (mentorshipId: string) => {
    await recordSession.mutateAsync(mentorshipId)
  }

  const handleCompleteMentorship = async (mentorshipId: string) => {
    await completeMentorship.mutateAsync(mentorshipId)
  }

  const handleRateMentorship = async (rating: number, feedback?: string) => {
    if (!ratingMentorship) return
    await rateMentorship.mutateAsync({
      mentorshipId: ratingMentorship.id,
      rating,
      feedback,
    })
    setRatingMentorship(null)
  }

  const handleMessageMentor = (mentorId: string) => {
    // Navigate to chat or open direct message
    router.push(`/chat?userId=${mentorId}`)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Show login prompt for unauthenticated users
  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-8 text-center dark:border-blue-800 dark:bg-blue-900/20">
          <LogIn className="mx-auto h-12 w-12 text-blue-600 dark:text-blue-400" />
          <h2 className="mt-4 text-xl font-semibold text-blue-800 dark:text-blue-200">
            {t('auth.login.title')}
          </h2>
          <p className="mt-2 text-blue-600 dark:text-blue-400">
            {t('mentoring.description')}
          </p>
          <Button
            onClick={() => router.push('/login')}
            className="mt-6"
          >
            <LogIn className="mr-2 h-4 w-4" />
            {t('common.login')}
          </Button>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-200">
                {t('common.error')}
              </h3>
              <p className="text-sm text-red-600 dark:text-red-400">
                {t('mentoring.loadError')}
              </p>
            </div>
          </div>
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="mt-4"
          >
            {t('common.retry')}
          </Button>
        </div>
      </div>
    )
  }

  const myMentors = dashboard?.myMentors?.filter(m => m.status === 'ACTIVE') || []
  const myMentees = dashboard?.myMentees?.filter(m => m.status === 'ACTIVE') || []
  const pendingIncoming = dashboard?.pendingRequests?.filter(r => r.status === 'PENDING') || []
  const pendingOutgoing = dashboard?.pendingRequests?.filter(r => r.status === 'PENDING') || []
  const completedMentorships = dashboard?.myMentors?.filter(m => m.status === 'COMPLETED' && !m.rating) || []

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('mentoring.title')}
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            {t('mentoring.description')}
          </p>
        </div>
        {canRequestMentorship(currentUserRank) && (
          <Button
            onClick={() => setIsFindMentorOpen(true)}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            {t('mentoring.findMentor')}
          </Button>
        )}
      </div>

      {/* Rank Notice for MASTER users */}
      {currentUserRank === 'MASTER' && (
        <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              {t('mentoring.masterRankNotice')}
            </p>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {myMentors.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('mentoring.myMentors')}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
              <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {myMentees.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('mentoring.myMentees')}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
              <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {pendingIncoming.length + pendingOutgoing.length}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('mentoring.pendingRequests')}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(dashboard?.myMentors?.filter(m => m.status === 'COMPLETED').length || 0) +
                  (dashboard?.myMentees?.filter(m => m.status === 'COMPLETED').length || 0)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('mentoring.completed')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Requests Section */}
      {(pendingIncoming.length > 0 || pendingOutgoing.length > 0) && (
        <section className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
            <Clock className="h-5 w-5 text-yellow-500" />
            {t('mentoring.pendingRequests')}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {pendingIncoming.map((request) => (
              <MentorshipRequest
                key={request.id}
                request={request}
                variant="incoming"
                onAccept={() => handleAcceptRequest(request.id)}
                onReject={() => handleRejectRequest(request.id)}
                isAccepting={acceptMentorship.isPending}
                isRejecting={rejectMentorship.isPending}
              />
            ))}
            {pendingOutgoing.map((request) => (
              <MentorshipRequest
                key={request.id}
                request={request}
                variant="outgoing"
                onCancel={() => handleCancelRequest(request.id)}
                isCancelling={cancelRequest.isPending}
              />
            ))}
          </div>
        </section>
      )}

      {/* Awaiting Rating Section */}
      {completedMentorships.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
            <Award className="h-5 w-5 text-yellow-500" />
            {t('mentoring.awaitingRating')}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {completedMentorships.map((mentorship) => (
              <div
                key={mentorship.id}
                className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20"
              >
                <MentorCard
                  mentor={mentorship}
                  variant="active"
                />
                <Button
                  onClick={() => setRatingMentorship(mentorship)}
                  className="mt-3 w-full"
                  variant="default"
                >
                  {t('mentoring.rateMentor')}
                </Button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* My Mentors Section */}
      <section className="mb-8">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
          <GraduationCap className="h-5 w-5 text-blue-500" />
          {t('mentoring.myMentors')}
        </h2>
        {myMentors.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-600 dark:bg-gray-800/50">
            <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {t('mentoring.noMentors')}
            </p>
            {canRequestMentorship(currentUserRank) && (
              <Button
                onClick={() => setIsFindMentorOpen(true)}
                variant="outline"
                className="mt-4"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                {t('mentoring.findMentor')}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myMentors.map((mentorship) => (
              <MentorCard
                key={mentorship.id}
                mentor={mentorship}
                variant="active"
                onMessage={() => handleMessageMentor(mentorship.mentorId)}
              />
            ))}
          </div>
        )}
      </section>

      {/* My Mentees Section */}
      <section className="mb-8">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
          <Users className="h-5 w-5 text-green-500" />
          {t('mentoring.myMentees')}
        </h2>
        {myMentees.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-600 dark:bg-gray-800/50">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {t('mentoring.noMentees')}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myMentees.map((mentorship) => (
              <MenteeCard
                key={mentorship.id}
                mentorship={mentorship}
                onRecordSession={() => handleRecordSession(mentorship.id)}
                onComplete={() => handleCompleteMentorship(mentorship.id)}
                isRecordingSession={recordSession.isPending}
                isCompleting={completeMentorship.isPending}
              />
            ))}
          </div>
        )}
      </section>

      {/* Available Mentors Section */}
      {canRequestMentorship(currentUserRank) && dashboard?.availableMentors && dashboard.availableMentors.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
              <UserPlus className="h-5 w-5 text-purple-500" />
              {t('mentoring.availableMentors')}
            </h2>
            <Button
              onClick={() => setIsFindMentorOpen(true)}
              variant="ghost"
              size="sm"
            >
              {t('common.viewAll')}
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dashboard.availableMentors.slice(0, 6).map((mentor) => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                variant="available"
                onRequest={() => setIsFindMentorOpen(true)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Modals */}
      <FindMentorModal
        isOpen={isFindMentorOpen}
        onClose={() => setIsFindMentorOpen(false)}
        onSuccess={() => refetch()}
      />

      {ratingMentorship && (
        <RatingModal
          isOpen={!!ratingMentorship}
          onClose={() => setRatingMentorship(null)}
          mentorship={ratingMentorship}
          onSubmit={handleRateMentorship}
          isSubmitting={rateMentorship.isPending}
        />
      )}
    </div>
  )
}
