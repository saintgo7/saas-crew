// 비행 수당 정산 서비스 — Sprint 3
// 기본급 + 야간 가산 + 장거리 가산

import { db } from '@/db';
import { flightPayments, crewAssignments, flights } from '@/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';
import { z } from 'zod';

const NIGHT_START_HOUR = 22; // 22:00 ~ 06:00 야간 가산
const NIGHT_END_HOUR = 6;
const LONG_HAUL_HOURS = 6;

const RATE_TABLE: Record<string, { base: number; night: number; long: number }> = {
  purser: { base: 250000, night: 40000, long: 80000 },
  cabin: { base: 180000, night: 30000, long: 60000 },
  galley: { base: 160000, night: 25000, long: 50000 },
};

export const PaymentCalcSchema = z.object({
  assignmentId: z.string().uuid(),
  payPeriodStart: z.string().refine((s) => !isNaN(Date.parse(s))),
  payPeriodEnd: z.string().refine((s) => !isNaN(Date.parse(s))),
});

export async function calculatePayment(
  input: z.infer<typeof PaymentCalcSchema>
) {
  const validated = PaymentCalcSchema.parse(input);

  const rows = await db
    .select({ assignment: crewAssignments, flight: flights })
    .from(crewAssignments)
    .innerJoin(flights, eq(crewAssignments.flightId, flights.id))
    .where(eq(crewAssignments.id, validated.assignmentId));

  const row = rows[0];
  if (!row) throw new Error(`assignment ${validated.assignmentId} not found`);

  const { assignment, flight } = row;
  const position = assignment.position;
  const rates = RATE_TABLE[position] || RATE_TABLE.cabin;

  const dep = new Date(flight.departureAt);
  const arr = new Date(flight.arrivalAt);
  const durationHours = (arr.getTime() - dep.getTime()) / 3_600_000;

  const isNight =
    dep.getUTCHours() >= NIGHT_START_HOUR ||
    dep.getUTCHours() < NIGHT_END_HOUR ||
    arr.getUTCHours() >= NIGHT_START_HOUR ||
    arr.getUTCHours() < NIGHT_END_HOUR;
  const isLongHaul = durationHours >= LONG_HAUL_HOURS;

  const baseAmount = rates.base;
  const nightSurcharge = isNight ? rates.night : 0;
  const longHaulSurcharge = isLongHaul ? rates.long : 0;
  const totalAmount = baseAmount + nightSurcharge + longHaulSurcharge;

  return {
    baseAmount,
    nightSurcharge,
    longHaulSurcharge,
    totalAmount,
    isNight,
    isLongHaul,
    durationHours: Number(durationHours.toFixed(2)),
    currency: 'KRW',
  };
}

export async function recordPayment(opts: {
  assignmentId: string;
  crewId: string;
  payPeriodStart: string;
  payPeriodEnd: string;
}) {
  const calc = await calculatePayment({
    assignmentId: opts.assignmentId,
    payPeriodStart: opts.payPeriodStart,
    payPeriodEnd: opts.payPeriodEnd,
  });

  const [row] = await db
    .insert(flightPayments)
    .values({
      assignmentId: opts.assignmentId,
      crewId: opts.crewId,
      baseAmount: String(calc.baseAmount),
      nightSurcharge: String(calc.nightSurcharge),
      longHaulSurcharge: String(calc.longHaulSurcharge),
      totalAmount: String(calc.totalAmount),
      currency: calc.currency,
      payPeriodStart: opts.payPeriodStart,
      payPeriodEnd: opts.payPeriodEnd,
    })
    .returning();

  return row;
}

export async function listPaymentsByPeriod(opts: {
  crewId: string;
  from: string;
  to: string;
}) {
  return db
    .select()
    .from(flightPayments)
    .where(
      and(
        eq(flightPayments.crewId, opts.crewId),
        gte(flightPayments.payPeriodStart, opts.from),
        lte(flightPayments.payPeriodEnd, opts.to)
      )
    );
}

export async function aggregateMonthlyPayout(opts: {
  crewId: string;
  yearMonth: string; // 2026-05
}) {
  const start = `${opts.yearMonth}-01`;
  const [year, month] = opts.yearMonth.split('-').map(Number);
  const lastDay = new Date(year, month, 0).getDate();
  const end = `${opts.yearMonth}-${String(lastDay).padStart(2, '0')}`;

  const payments = await listPaymentsByPeriod({
    crewId: opts.crewId,
    from: start,
    to: end,
  });

  const total = payments.reduce(
    (acc, p) => acc + Number(p.totalAmount),
    0
  );
  const breakdown = {
    base: payments.reduce((a, p) => a + Number(p.baseAmount), 0),
    night: payments.reduce((a, p) => a + Number(p.nightSurcharge || 0), 0),
    longHaul: payments.reduce((a, p) => a + Number(p.longHaulSurcharge || 0), 0),
  };

  return {
    crewId: opts.crewId,
    yearMonth: opts.yearMonth,
    flightCount: payments.length,
    total,
    breakdown,
    currency: 'KRW',
  };
}
