// 승무원 자격 / 교육 — Sprint 2
// 참조: docs/52-db-schema-saas.md FN-3* 자격 및 교육 관리

import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  pgEnum,
  date,
  boolean,
} from 'drizzle-orm/pg-core';
import { users } from './users';

export const qualificationStatusEnum = pgEnum('qualification_status', [
  'pending',
  'active',
  'expired',
  'revoked',
]);

// 자격증 마스터
export const qualifications = pgTable('qualifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 30 }).unique().notNull(), // QL-EMERGENCY / QL-FA-A380
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 30 }).notNull(), // safety/medical/aircraft
  validityMonths: varchar('validity_months', { length: 10 }), // 24개월 등
  required: boolean('required').default(false),
});

// 승무원 자격 보유
export const crewQualifications = pgTable('crew_qualifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  crewId: uuid('crew_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  qualificationId: uuid('qualification_id')
    .references(() => qualifications.id, { onDelete: 'restrict' })
    .notNull(),
  acquiredAt: date('acquired_at').notNull(),
  expiresAt: date('expires_at'),
  status: qualificationStatusEnum('status').notNull().default('active'),
  certificateUrl: text('certificate_url'), // R2 storage
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 교육 이력
export const trainings = pgTable('trainings', {
  id: uuid('id').primaryKey().defaultRandom(),
  crewId: uuid('crew_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  qualificationId: uuid('qualification_id').references(
    () => qualifications.id
  ),
  trainingName: varchar('training_name', { length: 100 }).notNull(),
  startedAt: date('started_at').notNull(),
  completedAt: date('completed_at'),
  score: varchar('score', { length: 20 }),
  passed: boolean('passed'),
  instructorId: uuid('instructor_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Qualification = typeof qualifications.$inferSelect;
export type NewQualification = typeof qualifications.$inferInsert;
export type CrewQualification = typeof crewQualifications.$inferSelect;
export type NewCrewQualification = typeof crewQualifications.$inferInsert;
export type Training = typeof trainings.$inferSelect;
