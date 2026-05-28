// 자격증/교육 서비스 — Sprint 3
// 자격 만료 알림, 교육 수강, 갱신

import { db } from '@/db';
import {
  qualifications,
  crewQualifications,
  trainings,
} from '@/db/schema';
import { eq, and, lte } from 'drizzle-orm';
import { z } from 'zod';

const DEFAULT_VALIDITY_MONTHS = 24;

export const GrantQualificationSchema = z.object({
  crewId: z.string().uuid(),
  qualificationId: z.string().uuid(),
  acquiredAt: z.string().refine((s) => !isNaN(Date.parse(s))),
  certificateUrl: z.string().url().optional(),
  notes: z.string().max(500).optional(),
});

export async function grantQualification(
  input: z.infer<typeof GrantQualificationSchema>
) {
  const validated = GrantQualificationSchema.parse(input);

  const qualRows = await db
    .select()
    .from(qualifications)
    .where(eq(qualifications.id, validated.qualificationId));
  const qual = qualRows[0];
  if (!qual) throw new Error(`qualification ${validated.qualificationId} not found`);

  const months = qual.validityMonths
    ? Number(qual.validityMonths)
    : DEFAULT_VALIDITY_MONTHS;
  const acquired = new Date(validated.acquiredAt);
  const expires = new Date(acquired);
  expires.setMonth(expires.getMonth() + months);

  const [row] = await db
    .insert(crewQualifications)
    .values({
      crewId: validated.crewId,
      qualificationId: validated.qualificationId,
      acquiredAt: validated.acquiredAt,
      expiresAt: expires.toISOString().slice(0, 10),
      status: 'active',
      certificateUrl: validated.certificateUrl,
      notes: validated.notes,
    })
    .returning();

  return row;
}

export async function listCrewQualifications(crewId: string) {
  return db
    .select({
      cq: crewQualifications,
      qual: qualifications,
    })
    .from(crewQualifications)
    .innerJoin(
      qualifications,
      eq(crewQualifications.qualificationId, qualifications.id)
    )
    .where(eq(crewQualifications.crewId, crewId));
}

export async function findExpiringQualifications(opts: {
  withinDays: number;
}) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() + opts.withinDays);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  return db
    .select({
      cq: crewQualifications,
      qual: qualifications,
    })
    .from(crewQualifications)
    .innerJoin(
      qualifications,
      eq(crewQualifications.qualificationId, qualifications.id)
    )
    .where(
      and(
        eq(crewQualifications.status, 'active'),
        lte(crewQualifications.expiresAt, cutoffStr)
      )
    );
}

export const TrainingRecordSchema = z.object({
  crewId: z.string().uuid(),
  qualificationId: z.string().uuid().optional(),
  trainingName: z.string().min(1).max(100),
  startedAt: z.string().refine((s) => !isNaN(Date.parse(s))),
  completedAt: z.string().optional(),
  score: z.string().max(20).optional(),
  passed: z.boolean().optional(),
  instructorId: z.string().uuid().optional(),
});

export async function recordTraining(
  input: z.infer<typeof TrainingRecordSchema>
) {
  const validated = TrainingRecordSchema.parse(input);
  const [row] = await db.insert(trainings).values(validated).returning();
  return row;
}

export async function listTrainingsByCrew(crewId: string) {
  return db.select().from(trainings).where(eq(trainings.crewId, crewId));
}
