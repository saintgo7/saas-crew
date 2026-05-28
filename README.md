# saas-crew — 항공사 객실 승무원 관리 SaaS

> 자동 생성됨 (vibe.abada.kr Topic Mode + full-generate)
> 패턴: SaaS-16 (16-doc + RBAC + Mermaid 9 + Code scaffold)

## 자동 생성 산출물

- 16개 설계 문서 (docs/)
- 자동 검증 결과 (docs/REVIEW.md)
- 코드 스켈레톤 (_scaffold_preview/)
- 분석 결과 (docs/topic-analysis.json)

## 빠른 시작

```bash
# docs 확인
ls docs/

# RBAC 매트릭스 (자동 추론)
cat docs/56-auth-permission-rbac.md

# Mermaid 9개 다이어그램
cat docs/60-architecture-diagrams-mermaid.md
```

## 다음 단계

1. _scaffold_preview/ → src/ 로 이동
2. `npm install` (package.json 작성 필요)
3. PostgreSQL 컨테이너 시작
4. Drizzle 마이그레이션
5. 본격 개발 시작

## 생성 정보

- 자동 생성: 2026-05-28
- 모델: Pamout LLM (gemma-4-31b)
- 생성 시간: 113초
- 자동 점수: 58/D (CLAUDE.md 추가 시 80+ 예상)
