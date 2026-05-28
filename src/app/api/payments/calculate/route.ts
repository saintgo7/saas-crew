// /api/payments/calculate — Sprint 3-2
// POST: 정산 시뮬레이션 (DB 저장 없음)

import { NextRequest, NextResponse } from 'next/server';
import {
  PaymentCalcSchema,
  calculatePayment,
  recordPayment,
  aggregateMonthlyPayout,
} from '@/lib/services/payment-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = PaymentCalcSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'invalid input', issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const action = body.action || 'calculate';
    if (action === 'record') {
      const recorded = await recordPayment({
        assignmentId: parsed.data.assignmentId,
        crewId: body.crewId,
        payPeriodStart: parsed.data.payPeriodStart,
        payPeriodEnd: parsed.data.payPeriodEnd,
      });
      return NextResponse.json({ success: true, payment: recorded });
    }

    const result = await calculatePayment(parsed.data);
    return NextResponse.json({ success: true, calculation: result });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const crewId = url.searchParams.get('crewId');
    const yearMonth = url.searchParams.get('yearMonth');
    if (!crewId || !yearMonth) {
      return NextResponse.json(
        { error: 'crewId + yearMonth (YYYY-MM) required' },
        { status: 400 }
      );
    }
    const summary = await aggregateMonthlyPayout({ crewId, yearMonth });
    return NextResponse.json({ success: true, summary });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
