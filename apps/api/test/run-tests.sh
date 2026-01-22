#!/bin/bash

# E2E Test Runner Script
# Automatically sets up test database and runs integration tests

set -e

echo "========================================="
echo "WKU Software Crew E2E Test Runner"
echo "========================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
CLEAN_DB=${CLEAN_DB:-true}
SETUP_DB=${SETUP_DB:-true}
TEARDOWN_DB=${TEARDOWN_DB:-false}
TEST_PATTERN=${TEST_PATTERN:-""}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --no-setup)
      SETUP_DB=false
      shift
      ;;
    --teardown)
      TEARDOWN_DB=true
      shift
      ;;
    --no-clean)
      CLEAN_DB=false
      shift
      ;;
    --pattern)
      TEST_PATTERN="$2"
      shift 2
      ;;
    --help)
      echo "Usage: ./run-tests.sh [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --no-setup    Skip database setup"
      echo "  --teardown    Tear down database after tests"
      echo "  --no-clean    Skip database cleanup between tests"
      echo "  --pattern     Run specific test file (e.g., 'auth.e2e-spec.ts')"
      echo "  --help        Show this help message"
      echo ""
      echo "Examples:"
      echo "  ./run-tests.sh                           # Run all tests"
      echo "  ./run-tests.sh --pattern auth            # Run auth tests only"
      echo "  ./run-tests.sh --no-setup --teardown     # Use existing DB and clean up after"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

# Function to check if Docker is running
check_docker() {
  if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Error: Docker is not running${NC}"
    echo "Please start Docker and try again"
    exit 1
  fi
}

# Function to setup test database
setup_database() {
  echo -e "${YELLOW}Setting up test database...${NC}"

  # Start Docker containers
  docker-compose -f docker-compose.test.yml up -d

  # Wait for PostgreSQL to be ready
  echo "Waiting for PostgreSQL to be ready..."
  for i in {1..30}; do
    if docker exec wku-test-db pg_isready -U postgres > /dev/null 2>&1; then
      echo -e "${GREEN}PostgreSQL is ready!${NC}"
      break
    fi
    if [ $i -eq 30 ]; then
      echo -e "${RED}PostgreSQL failed to start${NC}"
      exit 1
    fi
    sleep 1
  done

  # Run migrations
  echo "Running database migrations..."
  DATABASE_URL="postgresql://postgres:postgres@localhost:5433/wku_crew_test" pnpm db:push

  echo -e "${GREEN}Database setup complete!${NC}"
  echo ""
}

# Function to teardown test database
teardown_database() {
  echo -e "${YELLOW}Tearing down test database...${NC}"
  docker-compose -f docker-compose.test.yml down -v
  echo -e "${GREEN}Database teardown complete!${NC}"
}

# Function to run tests
run_tests() {
  echo -e "${YELLOW}Running E2E tests...${NC}"
  echo ""

  if [ -n "$TEST_PATTERN" ]; then
    echo "Running tests matching pattern: $TEST_PATTERN"
    pnpm test:e2e "$TEST_PATTERN"
  else
    echo "Running all E2E tests"
    pnpm test:e2e
  fi
}

# Main execution
main() {
  # Change to API directory
  cd "$(dirname "$0")/.."

  # Setup database if requested
  if [ "$SETUP_DB" = true ]; then
    check_docker
    setup_database
  fi

  # Run tests
  run_tests
  TEST_EXIT_CODE=$?

  # Teardown database if requested
  if [ "$TEARDOWN_DB" = true ]; then
    teardown_database
  fi

  # Exit with test exit code
  if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo ""
    echo -e "${GREEN}=========================================${NC}"
    echo -e "${GREEN}All tests passed! ✓${NC}"
    echo -e "${GREEN}=========================================${NC}"
  else
    echo ""
    echo -e "${RED}=========================================${NC}"
    echo -e "${RED}Some tests failed ✗${NC}"
    echo -e "${RED}=========================================${NC}"
  fi

  exit $TEST_EXIT_CODE
}

# Run main function
main
