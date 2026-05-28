// RBAC 매트릭스 — docs/07-auth-permission.md와 1:1 동기화 필수
// 자동 생성됨 (vibe.abada.kr ScaffoldRequest)

export type Role = 'G' | 'CA' | 'SC' | 'QM' | 'PA' | 'SA';
export type FnId = `FN-${string}`;
export type Condition = 'C1_OWNER' | 'C2_ASSIGNED';
export type Permission = 'ALLOW' | 'DENY' | Condition;

export const ROLES: Record<Role, { name: string; level: number }> = {
  G: { name: '비회원', level: 0 },
  CA: { name: '객실 승무원', level: 1 },
  SC: { name: '스케줄러', level: 2 },
  QM: { name: '자격 관리자', level: 3 },
  PA: { name: '정산 담당자', level: 4 },
  SA: { name: '시스템 관리자', level: 5 },
};

export const RBAC_MATRIX: Record<FnId, Record<Role, Permission>> = {
  'FN-101': { G: 'ALLOW', CA: 'ALLOW', SC: 'ALLOW', QM: 'ALLOW', PA: 'ALLOW', SA: 'ALLOW' },
  // TODO: 나머지 FN-ID 추가 (docs/07-auth-permission.md 참조)
};

export function checkPermission(fnId: FnId, role: Role): Permission {
  return RBAC_MATRIX[fnId]?.[role] ?? 'DENY'; // 기본 거부
}
