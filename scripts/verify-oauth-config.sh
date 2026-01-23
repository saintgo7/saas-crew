#!/bin/bash

# GitHub OAuth Configuration Verification Script
# This script verifies that OAuth configuration is properly set up

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================"
echo "GitHub OAuth Configuration Verification"
echo "========================================"
echo ""

# Function to check if a variable is set and not placeholder
check_env_var() {
    local var_name=$1
    local var_value=$2
    local placeholder=$3

    if [ -z "$var_value" ]; then
        echo -e "${RED}[MISSING]${NC} $var_name is not set"
        return 1
    elif [ "$var_value" = "$placeholder" ]; then
        echo -e "${YELLOW}[PLACEHOLDER]${NC} $var_name contains placeholder value"
        return 1
    else
        echo -e "${GREEN}[OK]${NC} $var_name is configured"
        return 0
    fi
}

# Track errors
errors=0

# Check backend .env
echo "Checking Backend Configuration (apps/api/.env)..."
echo "---------------------------------------------------"

if [ -f "apps/api/.env" ]; then
    # Source the env file
    source apps/api/.env 2>/dev/null || true

    check_env_var "GITHUB_CLIENT_ID" "$GITHUB_CLIENT_ID" "your-github-client-id" || ((errors++))
    check_env_var "GITHUB_CLIENT_SECRET" "$GITHUB_CLIENT_SECRET" "your-github-client-secret" || ((errors++))
    check_env_var "GITHUB_CALLBACK_URL" "$GITHUB_CALLBACK_URL" "" || ((errors++))
    check_env_var "FRONTEND_URL" "$FRONTEND_URL" "" || ((errors++))
    check_env_var "JWT_SECRET" "$JWT_SECRET" "your-super-secret-jwt-key-change-this-in-production" || ((errors++))
else
    echo -e "${RED}[ERROR]${NC} apps/api/.env file not found"
    echo "Please copy apps/api/.env.example to apps/api/.env"
    ((errors++))
fi

echo ""
echo "Checking Frontend Configuration (apps/web/.env.local)..."
echo "--------------------------------------------------------"

if [ -f "apps/web/.env.local" ]; then
    source apps/web/.env.local 2>/dev/null || true

    check_env_var "NEXT_PUBLIC_API_URL" "$NEXT_PUBLIC_API_URL" "" || ((errors++))
else
    echo -e "${YELLOW}[WARNING]${NC} apps/web/.env.local file not found"
    echo "Consider copying apps/web/.env.example to apps/web/.env.local"
fi

echo ""
echo "========================================"
echo "Verification Summary"
echo "========================================"

if [ $errors -eq 0 ]; then
    echo -e "${GREEN}All checks passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Start the backend: cd apps/api && npm run start:dev"
    echo "2. Start the frontend: cd apps/web && npm run dev"
    echo "3. Test OAuth: Open http://localhost:4000/api/auth/github"
else
    echo -e "${RED}Found $errors issue(s) that need attention${NC}"
    echo ""
    echo "To fix:"
    echo "1. Create a GitHub OAuth App at: https://github.com/settings/developers"
    echo "2. Set the callback URL to: http://localhost:4000/api/auth/github/callback"
    echo "3. Copy the Client ID and Client Secret to your .env file"
    echo ""
    echo "See docs/GITHUB_OAUTH_SETUP.md for detailed instructions"
fi

exit $errors
