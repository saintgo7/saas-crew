-- Seed default channels for WKU Software Crew

-- General channels (PUBLIC)
INSERT INTO channels (id, name, slug, description, type, is_default, icon, created_at, updated_at)
VALUES 
  ('ch_general', 'general', 'general', '일반적인 대화를 나누는 공간입니다', 'PUBLIC', true, 'hash', NOW(), NOW()),
  ('ch_intro', 'introductions', 'introductions', '자기소개를 해주세요!', 'PUBLIC', true, 'hand-wave', NOW(), NOW()),
  ('ch_resources', 'resources', 'resources', '유용한 자료와 링크를 공유하세요', 'PUBLIC', false, 'book-open', NOW(), NOW()),
  ('ch_code_review', 'code-review', 'code-review', '코드 리뷰 요청 및 피드백', 'PUBLIC', false, 'code', NOW(), NOW()),
  ('ch_qna', 'questions', 'questions', '질문과 답변을 주고받는 공간', 'PUBLIC', false, 'help-circle', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Level-restricted channels
INSERT INTO channels (id, name, slug, description, type, min_rank, is_default, icon, created_at, updated_at)
VALUES 
  ('ch_junior_help', 'junior-help', 'junior-help', 'Junior 멤버들의 질문 공간', 'LEVEL_RESTRICTED', 'JUNIOR', false, 'sparkles', NOW(), NOW()),
  ('ch_senior_lounge', 'senior-lounge', 'senior-lounge', 'Senior 이상 멤버들의 토론 공간', 'LEVEL_RESTRICTED', 'SENIOR', false, 'coffee', NOW(), NOW()),
  ('ch_master_council', 'master-council', 'master-council', 'Master들의 고급 기술 논의', 'LEVEL_RESTRICTED', 'MASTER', false, 'crown', NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Insert success message
SELECT 'Channels seeded successfully' as result;
