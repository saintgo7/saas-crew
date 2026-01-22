-- =============================================================================
-- WKU Software Crew - Database Initialization Script
-- Run on first database setup
-- =============================================================================

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For text search

-- Create additional indexes for performance (if not created by Prisma)
-- These are optional and can be customized based on query patterns

-- Create read-only user for analytics (optional)
-- DO $$
-- BEGIN
--     IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'wku_crew_readonly') THEN
--         CREATE ROLE wku_crew_readonly WITH LOGIN PASSWORD 'change_this_password';
--     END IF;
-- END
-- $$;

-- Grant read access to readonly user
-- GRANT CONNECT ON DATABASE wku_crew TO wku_crew_readonly;
-- GRANT USAGE ON SCHEMA public TO wku_crew_readonly;
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO wku_crew_readonly;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO wku_crew_readonly;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Note: Triggers for updatedAt are handled by Prisma automatically
-- This function is provided for custom use cases if needed

-- Maintenance: Vacuum and analyze tables periodically
-- Run this command manually or via cron:
-- VACUUM ANALYZE;

-- Performance: Configure connection pooling
-- Recommended settings for PostgreSQL (set in postgresql.conf):
-- max_connections = 100
-- shared_buffers = 256MB
-- effective_cache_size = 768MB
-- maintenance_work_mem = 64MB
-- checkpoint_completion_target = 0.9
-- wal_buffers = 16MB
-- default_statistics_target = 100
-- random_page_cost = 1.1
-- effective_io_concurrency = 200
-- work_mem = 4MB
-- min_wal_size = 1GB
-- max_wal_size = 4GB

SELECT 'Database initialized successfully' AS status;
