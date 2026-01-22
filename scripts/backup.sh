#!/bin/bash
# =============================================================================
# WKU Software Crew - Database Backup Script
# Automated backup script for PostgreSQL database
# =============================================================================

set -e

# Configuration
BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/wku_crew_${TIMESTAMP}.sql.gz"
RETENTION_DAYS=${BACKUP_RETENTION_DAYS:-7}

# Database connection
export PGPASSWORD="${POSTGRES_PASSWORD}"

echo "[$(date)] Starting database backup..."

# Create backup directory if not exists
mkdir -p "${BACKUP_DIR}"

# Perform backup with compression
pg_dump -h "${POSTGRES_HOST}" \
        -U "${POSTGRES_USER}" \
        -d "${POSTGRES_DB}" \
        --no-owner \
        --no-acl \
        --clean \
        --if-exists \
        | gzip > "${BACKUP_FILE}"

# Verify backup was created
if [ -f "${BACKUP_FILE}" ]; then
    BACKUP_SIZE=$(ls -lh "${BACKUP_FILE}" | awk '{print $5}')
    echo "[$(date)] Backup completed successfully: ${BACKUP_FILE} (${BACKUP_SIZE})"
else
    echo "[$(date)] ERROR: Backup failed - file not created"
    exit 1
fi

# Remove old backups
echo "[$(date)] Removing backups older than ${RETENTION_DAYS} days..."
find "${BACKUP_DIR}" -name "wku_crew_*.sql.gz" -mtime +${RETENTION_DAYS} -delete

# List remaining backups
echo "[$(date)] Current backups:"
ls -lh "${BACKUP_DIR}"/wku_crew_*.sql.gz 2>/dev/null || echo "No backups found"

echo "[$(date)] Backup process completed"
