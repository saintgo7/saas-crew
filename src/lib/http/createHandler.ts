// API 라우트 표준 미들웨어 — Zod + RBAC + DomainError 통합
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkPermission, FnId, Role } from '../permissions/matrix';

export interface HandlerContext {
  session: { userId: string; role: Role };
  request: NextRequest;
}

export function createHandler<TInput, TOutput>(opts: {
  fnId: FnId;
  input?: z.ZodType<TInput>;
  handler: (ctx: HandlerContext, input: TInput) => Promise<TOutput>;
}) {
  return async (req: NextRequest) => {
    try {
      // TODO: 실제 세션 조회 로직 (NextAuth auth()로 교체).
      // 그 전까지 데모 세션은 dev/test에서만 허용한다. 프로덕션에서
      // 무인증 쓰기가 열리지 않도록 fail-closed 한다.
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const session = { userId: 'demo', role: 'SA' as Role };

      // RBAC 체크
      const perm = checkPermission(opts.fnId, session.role);
      if (perm === 'DENY') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      // 입력 검증
      const raw = opts.input ? await req.json() : ({} as TInput);
      const input = opts.input ? opts.input.parse(raw) : (raw as TInput);

      // 핸들러 실행
      const result = await opts.handler({ session, request: req }, input);

      return NextResponse.json({ success: true, data: result });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown';
      return NextResponse.json({ error: message }, { status: 500 });
    }
  };
}
