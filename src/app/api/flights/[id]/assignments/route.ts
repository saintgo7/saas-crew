// /api/flights/[id]/assignments — Sprint 3-2
// POST: 승무원 배정

import { NextRequest, NextResponse } from 'next/server';
import { AssignmentInputSchema, assignCrew } from '@/lib/services/flight-service';
import { auth } from '@/lib/auth/config';
import { checkPermission, Role } from '@/lib/permissions/matrix';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (checkPermission('FN-2-ASSIGN', session.user.role as Role) === 'DENY') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const body = await req.json();
    const parsed = AssignmentInputSchema.safeParse({
      ...body,
      flightId: params.id,
    });
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'invalid input', issues: parsed.error.issues },
        { status: 400 }
      );
    }
    const assignment = await assignCrew(parsed.data);
    return NextResponse.json({ success: true, assignment });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
