// /api/flights — Sprint 3-2
// GET: 기간 조회 / POST: 비행편 생성

import { createHandler } from '@/lib/http/createHandler';
import {
  FlightInputSchema,
  createFlight,
  listFlightsByRange,
} from '@/lib/services/flight-service';
import { z } from 'zod';
import { NextRequest, NextResponse } from 'next/server';

export const POST = createHandler({
  fnId: 'FN-1-FLIGHTS' as any,
  input: FlightInputSchema,
  handler: async (_ctx, input) => createFlight(input),
});

const RangeQuerySchema = z.object({
  from: z.string().refine((s) => !isNaN(Date.parse(s))),
  to: z.string().refine((s) => !isNaN(Date.parse(s))),
});

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const parsed = RangeQuerySchema.safeParse({
      from: url.searchParams.get('from'),
      to: url.searchParams.get('to'),
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'from/to ISO date required' },
        { status: 400 }
      );
    }
    const flights = await listFlightsByRange(parsed.data);
    return NextResponse.json({ success: true, flights });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
