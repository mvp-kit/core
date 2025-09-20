#!/bin/bash

# Cleanup Script for MVPKit Core
# This script removes all generated files and build artifacts
# Run from the project root directory: ./cleanup.sh

set -e

echo "🧹 Cleaning up generated files and build artifacts..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if we're in the project root
if [[ ! -f "package.json" ]] || [[ ! -d "apps" ]]; then
    print_error "This script must be run from the project root directory"
    exit 1
fi

# Remove node_modules directories
echo "Removing node_modules directories..."
find . -name "node_modules" -type d -prune -exec rm -rf {} + 2>/dev/null || true
print_status "node_modules removed"

# Remove build outputs
echo "Removing build outputs..."
find . -name "dist" -type d -prune -exec rm -rf {} + 2>/dev/null || true
find . -name ".next" -type d -prune -exec rm -rf {} + 2>/dev/null || true
find . -name ".output" -type d -prune -exec rm -rf {} + 2>/dev/null || true
print_status "build outputs removed"

# Remove Cloudflare Worker artifacts
echo "Removing Cloudflare Worker artifacts..."
find . -name ".wrangler" -type d -prune -exec rm -rf {} + 2>/dev/null || true
find . -name "wrangler-output" -type d -prune -exec rm -rf {} + 2>/dev/null || true
print_status "Cloudflare Worker artifacts removed"

# Remove cache directories
echo "Removing cache directories..."
find . -name ".turbo" -type d -prune -exec rm -rf {} + 2>/dev/null || true
find . -name ".cache" -type d -prune -exec rm -rf {} + 2>/dev/null || true
find . -name ".vite" -type d -prune -exec rm -rf {} + 2>/dev/null || true
print_status "cache directories removed"

# Remove TypeScript build info
echo "Removing TypeScript build info..."
find . -name "*.tsbuildinfo" -delete 2>/dev/null || true
print_status "TypeScript build info removed"

# Remove log files
echo "Removing log files..."
find . -name "*.log" -delete 2>/dev/null || true
find . -name "*.tmp" -delete 2>/dev/null || true
find . -name ".DS_Store" -delete 2>/dev/null || true
find . -name "Thumbs.db" -delete 2>/dev/null || true
print_status "log files removed"

# Remove coverage reports
echo "Removing coverage reports..."
find . -name "coverage" -type d -prune -exec rm -rf {} + 2>/dev/null || true
find . -name ".nyc_output" -type d -prune -exec rm -rf {} + 2>/dev/null || true
print_status "coverage reports removed"

# Remove environment files that shouldn't be committed
echo "Removing environment files..."
find . -name ".env" -delete 2>/dev/null || true
find . -name ".env.local" -delete 2>/dev/null || true
find . -name ".env.development" -delete 2>/dev/null || true
find . -name ".env.production" -delete 2>/dev/null || true
print_warning "Environment files removed (if they existed)"

# Remove package lock files (optional - uncomment if needed)
echo "Removing package lock files..."
find . -name "package-lock.json" -delete 2>/dev/null || true
find . -name "yarn.lock" -delete 2>/dev/null || true
find . -name "bun.lock" -delete 2>/dev/null || true
find . -name "pnpm-lock.yaml" -delete 2>/dev/null || true
print_warning "Package lock files removed"

echo ""
print_status "Cleanup complete!"
echo ""
echo "📋 Summary of removed items:"
echo "   • node_modules directories"
echo "   • Build outputs (dist, .next, .output)"
echo "   • Cloudflare Worker artifacts (.wrangler)"
echo "   • Cache directories (.turbo, .cache, .vite)"
echo "   • TypeScript build info (*.tsbuildinfo)"
echo "   • Log files (*.log, *.tmp)"
echo "   • System files (.DS_Store, Thumbs.db)"
echo "   • Coverage reports"
echo "   • Environment files (.env*)"
echo "   • Package lock files"
echo ""
echo "🔄 Next steps:"
echo "   1. Run 'pnpm install' to reinstall dependencies"
echo "   2. Run 'pnpm dev' to start development servers"
echo ""
echo "⚠️  Note: This script does NOT remove:"
echo "   • Source code files"
echo "   • Configuration files"
echo "   • Git repository (.git)"