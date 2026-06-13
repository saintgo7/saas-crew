// computePay 순수 수당 계산 단위 테스트 — 야간/장거리 가산 경계값
import { describe, it, expect } from 'vitest';
import { computePay } from './payment-service';

describe('computePay', () => {
  it('주간 단거리 cabin: 기본급만, 가산 없음', () => {
    const r = computePay({
      position: 'cabin',
      departureAt: '2026-05-01T10:00:00.000Z',
      arrivalAt: '2026-05-01T14:00:00.000Z',
    });
    expect(r.isNight).toBe(false);
    expect(r.isLongHaul).toBe(false);
    expect(r.baseAmount).toBe(180000);
    expect(r.nightSurcharge).toBe(0);
    expect(r.longHaulSurcharge).toBe(0);
    expect(r.totalAmount).toBe(180000);
    expect(r.durationHours).toBe(4);
    expect(r.currency).toBe('KRW');
  });

  it('야간 장거리 purser: 기본급 + 야간 + 장거리 가산', () => {
    const r = computePay({
      position: 'purser',
      departureAt: '2026-05-01T23:00:00.000Z',
      arrivalAt: '2026-05-02T09:00:00.000Z',
    });
    expect(r.isNight).toBe(true);
    expect(r.isLongHaul).toBe(true);
    expect(r.baseAmount).toBe(250000);
    expect(r.nightSurcharge).toBe(40000);
    expect(r.longHaulSurcharge).toBe(80000);
    expect(r.totalAmount).toBe(370000);
    expect(r.durationHours).toBe(10);
  });

  it('장거리 경계값(정확히 6시간)은 장거리로 인정한다', () => {
    const r = computePay({
      position: 'cabin',
      departureAt: '2026-05-01T08:00:00.000Z',
      arrivalAt: '2026-05-01T14:00:00.000Z',
    });
    expect(r.isLongHaul).toBe(true);
    expect(r.longHaulSurcharge).toBe(60000);
  });

  it('야간 경계값: 도착 정각 06:00은 야간 아님(시각순서 유효)', () => {
    // 출발 20:00 → 도착 익일 06:00. 둘 다 [06,22) 밖이 아니므로 야간 아님.
    const notNight = computePay({
      position: 'cabin',
      departureAt: '2026-05-01T20:00:00.000Z',
      arrivalAt: '2026-05-02T06:00:00.000Z',
    });
    expect(notNight.isNight).toBe(false);
  });

  it('야간 경계값: 도착 05:59는 야간 창(<06)에 걸려 야간(시각순서 유효)', () => {
    // 출발 20:00 → 도착 익일 05:59. 도착 시각이 06시 미만이라 야간.
    const night = computePay({
      position: 'cabin',
      departureAt: '2026-05-01T20:00:00.000Z',
      arrivalAt: '2026-05-02T05:59:00.000Z',
    });
    expect(night.isNight).toBe(true);
  });

  it('알 수 없는 직급은 cabin 요율로 폴백한다', () => {
    const r = computePay({
      position: 'unknown-position',
      departureAt: '2026-05-01T10:00:00.000Z',
      arrivalAt: '2026-05-01T13:00:00.000Z',
    });
    expect(r.baseAmount).toBe(180000); // cabin base
  });
});
