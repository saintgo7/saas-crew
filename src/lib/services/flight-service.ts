// 비행편 서비스 — Sprint 3
// 스케줄 생성, 승무원 배정, 상태 전이

import { db } from '@/db';
import { flights, crewAssignments } from '@/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';
import { z } from 'zod';

export const FlightInputSchema = z.object({
  flightNumber: z.string().min(2).max(10),
  departureAirport: z.string().length(3),
  arrivalAirport: z.string().length(3),
  departureAt: z.string().datetime(),
  arrivalAt: z.string().datetime(),
  aircraftType: z.string().max(20).optional(),
  requiredCrewCount: z.number().int().min(1).max(20).default(8),
});

export type FlightInput = z.infer<typeof FlightInputSchema>;

export async function createFlight(input: FlightInput) {
  const validated = FlightInputSchema.parse(input);

  if (new Date(validated.departureAt) >= new Date(validated.arrivalAt)) {
    throw new Error('arrivalAt must be after departureAt');
  }

  const [row] = await db
    .insert(flights)
    .values({
      ...validated,
      departureAt: new Date(validated.departureAt),
      arrivalAt: new Date(validated.arrivalAt),
    })
    .returning();

  return row;
}

export async function listFlightsByRange(opts: {
  from: string;
  to: string;
}) {
  return db
    .select()
    .from(flights)
    .where(
      and(
        gte(flights.departureAt, new Date(opts.from)),
        lte(flights.departureAt, new Date(opts.to))
      )
    );
}

export async function getFlight(id: string) {
  const rows = await db.select().from(flights).where(eq(flights.id, id));
  return rows[0] ?? null;
}

export const AssignmentInputSchema = z.object({
  flightId: z.string().uuid(),
  crewId: z.string().uuid(),
  position: z.enum(['purser', 'cabin', 'galley']),
  assignedBy: z.string().uuid().optional(),
});

export async function assignCrew(input: z.infer<typeof AssignmentInputSchema>) {
  const validated = AssignmentInputSchema.parse(input);

  const flight = await getFlight(validated.flightId);
  if (!flight) throw new Error(`flight ${validated.flightId} not found`);

  const existing = await db
    .select()
    .from(crewAssignments)
    .where(
      and(
        eq(crewAssignments.flightId, validated.flightId),
        eq(crewAssignments.crewId, validated.crewId)
      )
    );
  if (existing.length > 0) {
    throw new Error('crew already assigned to this flight');
  }

  const [row] = await db.insert(crewAssignments).values(validated).returning();
  return row;
}

export async function confirmAssignment(id: string) {
  const [row] = await db
    .update(crewAssignments)
    .set({ status: 'confirmed', confirmedAt: new Date() })
    .where(eq(crewAssignments.id, id))
    .returning();
  return row;
}

export async function listCrewSchedule(opts: {
  crewId: string;
  from: string;
  to: string;
}) {
  return db
    .select({
      assignment: crewAssignments,
      flight: flights,
    })
    .from(crewAssignments)
    .innerJoin(flights, eq(crewAssignments.flightId, flights.id))
    .where(
      and(
        eq(crewAssignments.crewId, opts.crewId),
        gte(flights.departureAt, new Date(opts.from)),
        lte(flights.departureAt, new Date(opts.to))
      )
    );
}
