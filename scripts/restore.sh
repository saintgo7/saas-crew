#!/bin/bash
# =============================================================================
# WKU Software Crew - Database Restore Script
# Restore database from backup file
# =============================================================================

set -e

# Check arguments
if [ -z "$1" ]; then
    echo "Usage: $0 <backup_file>"
    echo "Example: $0 /backups/wku_crew_20240101_120000.sql.gz"
    exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "${BACKUP_FILE}" ]; then
    echo "ERROR: Backup file not found: ${BACKUP_FILE}"
    exit 1
fi

# Database connection
export PGPASSWORD="${POSTGRES_PASSWORD:-postgres}"
POSTGRES_HOST="${POSTGRES_HOST:-localhost}"
POSTGRES_USER="${POSTGRES_USER:-postgres}"
POSTGRES_DB="${POSTGRES_DB:-wku_crew}"

echo "[$(date)] Starting database restore from: ${BACKUP_FILE}"
echo "WARNING: This will overwrite the current database. Press Ctrl+C to cancel."
echo "Waiting 10 seconds before proceeding..."
sleep 10

echo "[$(date)] Restoring database..."

# Decompress and restore
gunzip -c "${BACKUP_FILE}" | psql -h "${POSTGRES_HOST}" \
                                   -U "${POSTGRES_USER}" \
                                   -d "${POSTGRES_DB}" \
                                   -v ON_ERROR_STOP=1

echo "[$(date)] Database restore completed successfully"

# Run Prisma migrations to ensure schema is up to date
echo "[$(date)] Note: Run 'pnpm --filter @wku-crew/api db:push' to sync schema if needed"
