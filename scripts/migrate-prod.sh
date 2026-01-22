#!/bin/bash
# =============================================================================
# WKU Software Crew - Production Migration Script
# Safe database migration for production environments
# =============================================================================

set -e

echo "==================================="
echo "Production Database Migration"
echo "==================================="

# Check environment
if [ -z "${DATABASE_URL}" ]; then
    echo "ERROR: DATABASE_URL environment variable is not set"
    exit 1
fi

echo "[$(date)] Starting production migration..."

# Create backup before migration
echo "[$(date)] Creating pre-migration backup..."
BACKUP_DIR="${BACKUP_DIR:-./backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/pre_migration_${TIMESTAMP}.sql.gz"

mkdir -p "${BACKUP_DIR}"

# Extract database credentials from DATABASE_URL
# Format: postgresql://user:password@host:port/database
DB_USER=$(echo "${DATABASE_URL}" | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
DB_PASS=$(echo "${DATABASE_URL}" | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
DB_HOST=$(echo "${DATABASE_URL}" | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo "${DATABASE_URL}" | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo "${DATABASE_URL}" | sed -n 's/.*\/\([^?]*\).*/\1/p')

export PGPASSWORD="${DB_PASS}"

pg_dump -h "${DB_HOST}" \
        -p "${DB_PORT}" \
        -U "${DB_USER}" \
        -d "${DB_NAME}" \
        --no-owner \
        --no-acl \
        | gzip > "${BACKUP_FILE}"

echo "[$(date)] Backup created: ${BACKUP_FILE}"

# Run Prisma migration
echo "[$(date)] Running database migration..."
cd apps/api

# Deploy migrations (production-safe)
npx prisma migrate deploy

echo "[$(date)] Migration completed successfully"

# Verify database connectivity
echo "[$(date)] Verifying database connectivity..."
npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM users;"

echo "[$(date)] Production migration completed successfully"
echo "==================================="
