// 항공사 객실 승무원 스케줄 — Sprint 2
// 참조: docs/52-db-schema-saas.md

import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  pgEnum,
  integer,
  date,
  decimal,
  jsonb,
} from 'drizzle-orm/pg-core';
import { users } from './users';

// 비행편 운항 상태
export const flightStatusEnum = pgEnum('flight_status', [
  'scheduled',
  'in_progress',
  'completed',
  'cancelled',
  'delayed',
]);

// 스케줄 배정 상태
export const assignmentStatusEnum = pgEnum('assignment_status', [
  'tentative',
  'confirmed',
  'swapped',
  'cancelled',
]);

// 비행편 (스케줄 단위)
export const flights = pgTable('flights', {
  id: uuid('id').primaryKey().defaultRandom(),
  flightNumber: varchar('flight_number', { length: 10 }).notNull(), // KE001
  departureAirport: varchar('departure_airport', { length: 3 }).notNull(), // ICN
  arrivalAirport: varchar('arrival_airport', { length: 3 }).notNull(), // LAX
  departureAt: timestamp('departure_at', { withTimezone: true }).notNull(),
  arrivalAt: timestamp('arrival_at', { withTimezone: true }).notNull(),
  aircraftType: varchar('aircraft_type', { length: 20 }), // B777-300ER
  requiredCrewCount: integer('required_crew_count').notNull().default(8),
  status: flightStatusEnum('status').notNull().default('scheduled'),
  metadata: jsonb('metadata'), // 추가 정보 (게이트, 기상 등)
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 승무원 스케줄 배정
export const crewAssignments = pgTable('crew_assignments', {
  id: uuid('id').primaryKey().defaultRandom(),
  flightId: uuid('flight_id')
    .references(() => flights.id, { onDelete: 'cascade' })
    .notNull(),
  crewId: uuid('crew_id')
    .references(() => users.id, { onDelete: 'restrict' })
    .notNull(),
  position: varchar('position', { length: 20 }).notNull(), // purser / cabin / galley
  status: assignmentStatusEnum('status').notNull().default('tentative'),
  assignedBy: uuid('assigned_by').references(() => users.id),
  assignedAt: timestamp('assigned_at').defaultNow().notNull(),
  confirmedAt: timestamp('confirmed_at'),
  swapWithId: uuid('swap_with_id'), // 교환된 배정 ID
  notes: text('notes'),
});

// 비행 수당 (정산용)
export const flightPayments = pgTable('flight_payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  assignmentId: uuid('assignment_id')
    .references(() => crewAssignments.id, { onDelete: 'cascade' })
    .notNull(),
  crewId: uuid('crew_id')
    .references(() => users.id)
    .notNull(),
  baseAmount: decimal('base_amount', { precision: 12, scale: 2 }).notNull(),
  nightSurcharge: decimal('night_surcharge', {
    precision: 12,
    scale: 2,
  }).default('0'),
  longHaulSurcharge: decimal('long_haul_surcharge', {
    precision: 12,
    scale: 2,
  }).default('0'),
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('KRW'),
  payPeriodStart: date('pay_period_start').notNull(),
  payPeriodEnd: date('pay_period_end').notNull(),
  paidAt: timestamp('paid_at'),
  paymentStatus: varchar('payment_status', { length: 20 })
    .notNull()
    .default('pending'),
});

export type Flight = typeof flights.$inferSelect;
export type NewFlight = typeof flights.$inferInsert;
export type CrewAssignment = typeof crewAssignments.$inferSelect;
export type NewCrewAssignment = typeof crewAssignments.$inferInsert;
export type FlightPayment = typeof flightPayments.$inferSelect;
