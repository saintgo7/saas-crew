// /api/qualifications — Sprint 3-2
// GET: 만료 임박 자격 / POST: 자격 부여

import { NextRequest, NextResponse } from 'next/server';
import {
  GrantQualificationSchema,
  grantQualification,
  findExpiringQualifications,
} from '@/lib/services/qualification-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = GrantQualificationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'invalid input', issues: parsed.error.issues },
        { status: 400 }
      );
    }
    const granted = await grantQualification(parsed.data);
    return NextResponse.json({ success: true, qualification: granted });
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
    const days = Number(url.searchParams.get('withinDays') || '30');
    if (isNaN(days) || days < 0 || days > 365) {
      return NextResponse.json(
        { error: 'withinDays must be 0-365' },
        { status: 400 }
      );
    }
    const expiring = await findExpiringQualifications({ withinDays: days });
    return NextResponse.json({ success: true, expiring });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
