import type { Assignment, AssignmentSubmission } from '@/lib/api/assignments'

/**
 * Generate demo assignment for a chapter
 */
export function getDemoAssignment(chapterId: string): Assignment {
  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + 7)

  return {
    id: `demo-assignment-${chapterId}`,
    title: 'Practice Exercise',
    description:
      'Apply what you learned in this chapter. Write a short summary of the key concepts and implement a small example project demonstrating the main ideas.\n\nRequirements:\n- Summarize 3 key concepts from this chapter\n- Create a working code example\n- (Optional) Push your code to a GitHub repository',
    chapterId,
    dueDate: dueDate.toISOString(),
    maxScore: 100,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

/**
 * Generate demo submission
 */
export function getDemoSubmission(
  assignmentId: string,
): AssignmentSubmission | null {
  // Return null to simulate no submission yet
  return null
}
