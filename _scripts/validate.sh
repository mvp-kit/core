#!/bin/bash

#
# Simple validation script for core/ repo
#
# Note: @mvp-kit/template-validator is published to GitHub registry.
# For local use, ensure you have access to GitHub packages:
# npm login --scope=@mvp-kit --auth-type=legacy --registry=https://npm.pkg.github.com
#

set -e

echo "🔍 Validating MVPKit Core templates..."

echo "🧠 Checking generated LLM docs..."
node docs/scripts/context-sync.mjs --mode check

LOCAL_VALIDATOR="$PWD/../template-validator/dist/cli.js"

if [ -f "$LOCAL_VALIDATOR" ]; then
    node "$LOCAL_VALIDATOR" core --dir "$PWD"
else
    npx @mvp-kit/template-validator core
fi

if [ $? -eq 0 ]; then
    echo "✅ All templates valid!"
else
    echo "❌ Template validation failed!"
    exit 1
fi
