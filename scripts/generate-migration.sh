#!/bin/bash

# Script to generate Payload CMS migrations
# Usage: ./scripts/generate-migration.sh "description of changes"

if [ -z "$1" ]; then
  echo "Error: Please provide a migration description"
  echo "Usage: ./scripts/generate-migration.sh \"your migration description\""
  exit 1
fi

# Convert description to snake_case
MIGRATION_NAME=$(echo "$1" | tr '[:upper:]' '[:lower:]' | tr ' ' '_')

echo "Generating migration: $MIGRATION_NAME"
npm run payload migrate:create "$MIGRATION_NAME"

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Migration created successfully!"
  echo ""
  echo "Next steps:"
  echo "  1. Review the migration file in migrations/"
  echo "  2. Commit and push: git add migrations/ && git commit -m \"Add migration: $1\" && git push"
  echo "  3. The migration will run automatically on deploy"
else
  echo "❌ Migration generation failed. Make sure DATABASE_URI is set in .env.local"
fi
