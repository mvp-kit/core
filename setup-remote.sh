#!/bin/bash

# Cloudflare Remote Bindings Setup Script
# This script helps you set up remote bindings for testing

echo "🚀 Setting up Cloudflare Remote Bindings for Testing"
echo "=================================================="

# Check if wrangler is logged in
echo "📋 Step 1: Checking Wrangler authentication..."
if ! wrangler auth status > /dev/null 2>&1; then
    echo "❌ Not logged in to Wrangler. Please run:"
    echo "   wrangler auth login"
    exit 1
fi

echo "✅ Wrangler authentication confirmed"

# Create D1 Database
echo ""
echo "📋 Step 2: Creating D1 Database..."
echo "Creating database 'starter-db'..."
wrangler d1 create starter-db

if [ $? -eq 0 ]; then
    echo "✅ D1 Database created successfully"
    echo "📝 Note: Update the database_id in apps/backend/wrangler.toml"
else
    echo "⚠️  D1 Database creation failed or already exists"
fi

# Create R2 Bucket
echo ""
echo "📋 Step 3: Creating R2 Bucket..."
echo "Creating bucket 'starter-bucket'..."
wrangler r2 bucket create starter-bucket

if [ $? -eq 0 ]; then
    echo "✅ R2 Bucket created successfully"
else
    echo "⚠️  R2 Bucket creation failed or already exists"
fi

# Deploy the Worker
echo ""
echo "📋 Step 4: Deploying Worker..."
cd apps/backend
wrangler deploy

if [ $? -eq 0 ]; then
    echo "✅ Worker deployed successfully"
    echo "🌐 Your Worker URL will be displayed above"
    echo "📝 Update BACKEND_URL in apps/frontend/src/lib/trpc-client.tsx"
else
    echo "❌ Worker deployment failed"
    exit 1
fi

# Build frontend
echo ""
echo "📋 Step 5: Building Frontend..."
cd ../frontend
pnpm build

if [ $? -eq 0 ]; then
    echo "✅ Frontend built successfully"
else
    echo "❌ Frontend build failed"
    exit 1
fi

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo "✅ D1 Database: starter-db"
echo "✅ R2 Bucket: starter-bucket"
echo "✅ Worker: Deployed"
echo "✅ Frontend: Built"
echo ""
echo "📋 Next Steps:"
echo "1. Update apps/backend/wrangler.toml with your database_id"
echo "2. Update apps/frontend/src/lib/trpc-client.tsx with your Worker URL"
echo "3. Test the connection using the test buttons on the homepage"
echo ""
echo "🔗 Useful Commands:"
echo "• View databases: wrangler d1 list"
echo "• View buckets: wrangler r2 bucket list"
echo "• View workers: wrangler deployments list"