import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  issueCertificate,
  getMyCertificates,
  verifyCertificate,
  checkCourseCompletion,
} from '@/lib/api/certificates'

const certificateKeys = {
  all: ['certificate'] as const,
  my: ['certificate', 'my'] as const,
  verify: (certNumber: string) =>
    ['certificate', 'verify', certNumber] as const,
  completion: (courseId: string) =>
    ['certificate', 'completion', courseId] as const,
}

/**
 * Hook to generate (issue) a certificate
 */
export const useGenerateCertificate = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (courseId: string) => issueCertificate(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: certificateKeys.my })
    },
  })
}

/**
 * Hook to fetch current user's certificates
 */
export const useMyCertificates = () => {
  return useQuery({
    queryKey: certificateKeys.my,
    queryFn: () => getMyCertificates(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

/**
 * Hook to verify a certificate
 */
export const useVerifyCertificate = (certNumber: string, enabled = true) => {
  return useQuery({
    queryKey: certificateKeys.verify(certNumber),
    queryFn: () => verifyCertificate(certNumber),
    enabled: enabled && !!certNumber,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  })
}

/**
 * Hook to check course completion status
 */
export const useCourseCompletion = (courseId: string, enabled = true) => {
  return useQuery({
    queryKey: certificateKeys.completion(courseId),
    queryFn: () => checkCourseCompletion(courseId),
    enabled: enabled && !!courseId,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  })
}
