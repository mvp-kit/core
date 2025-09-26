#!/bin/bash

# Cloudflare Remote Bindings Setup Script
# Run this script from the apps/backend directory: ./setup-remote.sh
# This script helps you set up remote bindings for production deployment

# Check if we're in the backend directory
if [[ ! -f "wrangler.toml" ]]; then
    echo "❌ Error: This script must be run from the apps/backend directory"
    echo "   cd apps/backend"
    echo "   ./setup-remote.sh"
    exit 1
fi

echo "🚀 Setting up Cloudflare Remote Bindings for Production"
echo "======================================================"

# Check if wrangler is logged in
echo "📋 Step 1: Checking Wrangler authentication..."
AUTH_STATUS=$(wrangler whoami 2>&1)
if echo "$AUTH_STATUS" | grep -q "You are not authenticated"; then
    echo "❌ Not logged in to Wrangler. Please run:"
    echo "   wrangler login"
    exit 1
fi

echo "✅ Wrangler authentication confirmed"
echo "📧 Logged in as: $(echo "$AUTH_STATUS" | head -1)"

# Get project configuration from wrangler.toml template variables
WORKERS_NAME="hello-world-backend"
PROJECT_KEBAB="hello-world"
KV_NAMESPACE_ID=""

# Generate resource names
DB_NAME="$PROJECT_KEBAB-db"
KV_NAME="$PROJECT_KEBAB-kv"
BUCKET_NAME="$PROJECT_KEBAB-bucket"

# Create D1 Database
echo ""
echo "📋 Step 2: Creating D1 Database..."
echo "Creating database '$DB_NAME'..."
DB_OUTPUT=$(wrangler d1 create "$DB_NAME" 2>&1)

if echo "$DB_OUTPUT" | grep -q -E "(database_id|Created database)"; then
    echo "✅ D1 Database created successfully"
    # Try multiple patterns to extract database ID
    DATABASE_ID=$(echo "$DB_OUTPUT" | grep -E "database_id.*=" | sed -E 's/.*database_id.*=.*"([^"]+)".*/\1/' | head -1)
    if [[ -z "$DATABASE_ID" ]]; then
        DATABASE_ID=$(echo "$DB_OUTPUT" | grep -oE "[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}" | head -1)
    fi
    echo "📝 Database ID: $DATABASE_ID"
    echo "📝 Add this to your wrangler.toml production section"
else
    echo "⚠️  D1 Database creation failed or already exists"
    echo "$DB_OUTPUT"
fi

# Create KV Namespace
echo ""
echo "📋 Step 3: Creating KV Namespace..."
echo "Creating namespace '$KV_NAME'..."
KV_OUTPUT=$(wrangler kv namespace create "$KV_NAME" 2>&1)

if echo "$KV_OUTPUT" | grep -q "id ="; then
    echo "✅ KV Namespace created successfully"
    KV_ID=$(echo "$KV_OUTPUT" | grep "id =" | cut -d'"' -f2)
    echo "📝 KV ID: $KV_ID"
    echo "📝 Add this to your wrangler.toml production section"
else
    echo "⚠️  KV Namespace creation failed or already exists"
    echo "$KV_OUTPUT"
fi

# Create R2 Bucket
echo ""
echo "📋 Step 4: Creating R2 Bucket..."
echo "Creating bucket '$BUCKET_NAME'..."
wrangler r2 bucket create "$BUCKET_NAME"

if [ $? -eq 0 ]; then
    echo "✅ R2 Bucket created successfully"
else
    echo "⚠️  R2 Bucket creation failed or already exists"
fi

echo ""
echo "🎉 Remote Resources Setup Complete!"
echo "=================================="
echo "✅ D1 Database: $DB_NAME"
echo "✅ KV Namespace: $KV_NAME"
echo "✅ R2 Bucket: $BUCKET_NAME"
echo ""
echo "📋 Next Steps:"
if [[ -n "$DATABASE_ID" ]]; then
    echo "1. Update wrangler.toml with database_id:"
    echo "   database_id = \"$DATABASE_ID\""
fi
if [[ -n "$KV_ID" ]]; then
    echo "2. Update wrangler.toml with KV namespace id:"
    echo "   id = \"$KV_ID\""
echo ""
echo "🔗 Useful Commands:"
echo "• View databases: wrangler d1 list"
echo "• View KV namespaces: wrangler kv namespace list"
echo "• View buckets: wrangler r2 bucket list"
echo "• View deployments: wrangler deployments list"
echo "• View logs: wrangler tail"