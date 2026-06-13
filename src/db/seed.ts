// 시드 데이터 — Sprint 5 R3
// dev/staging DB에 기본 데이터 주입

import { db } from './index';
import {
  users,
  flights,
  crewAssignments,
  qualifications,
  crewQualifications,
} from './schema';

async function seed() {
  console.log('[seed] starting...');

  const purser = {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'purser@example.com',
    name: '김사무장',
    role: 'SA' as const,
    passwordHash: '$2a$12$placeholder',
  };
  const crew1 = {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'crew1@example.com',
    name: '이승무원',
    role: 'CA' as const,
    passwordHash: '$2a$12$placeholder',
  };

  await db.insert(users).values([purser, crew1]).onConflictDoNothing();

  const dep = new Date();
  dep.setDate(dep.getDate() + 1);
  dep.setHours(22, 30, 0, 0);
  const arr = new Date(dep);
  arr.setHours(arr.getHours() + 10);

  const [flight] = await db
    .insert(flights)
    .values({
      flightNumber: 'KE001',
      departureAirport: 'ICN',
      arrivalAirport: 'LAX',
      departureAt: dep,
      arrivalAt: arr,
      aircraftType: 'B777-300ER',
      requiredCrewCount: 8,
      status: 'scheduled',
    })
    .returning();

  if (flight) {
    await db.insert(crewAssignments).values([
      {
        flightId: flight.id,
        crewId: purser.id,
        position: 'purser',
        status: 'confirmed',
        confirmedAt: new Date(),
      },
      {
        flightId: flight.id,
        crewId: crew1.id,
        position: 'cabin',
        status: 'confirmed',
        confirmedAt: new Date(),
      },
    ]);
  }

  const quals = await db
    .insert(qualifications)
    .values([
      {
        code: 'QL-EMERGENCY',
        name: '비상안전훈련',
        category: 'safety',
        validityMonths: '24',
        required: true,
      },
      {
        code: 'QL-FA-A380',
        name: 'A380 기종 자격',
        category: 'aircraft',
        validityMonths: '36',
        required: false,
      },
      {
        code: 'QL-MEDICAL',
        name: '항공의료 자격',
        category: 'medical',
        validityMonths: '12',
        required: true,
      },
    ])
    .onConflictDoNothing()
    .returning();

  if (quals.length > 0) {
    const today = new Date().toISOString().slice(0, 10);
    const expires = new Date();
    expires.setMonth(expires.getMonth() + 24);
    await db.insert(crewQualifications).values([
      {
        crewId: purser.id,
        qualificationId: quals[0].id,
        acquiredAt: today,
        expiresAt: expires.toISOString().slice(0, 10),
        status: 'active',
      },
    ]);
  }

  console.log('[seed] done');
}

seed()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
