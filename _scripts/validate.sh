#!/bin/bash

#
# Simple validation script for core/ repo
#
# Note: @mvp-kit/template-validator is published to the public npm registry.
#

set -e

echo "🔍 Validating MVPKit Core templates..."

echo "🧠 Checking generated LLM docs..."
node docs/scripts/context-sync.mjs --mode check

npx @mvp-kit/template-validator@latest core --dir "$PWD"

if [ $? -eq 0 ]; then
    echo "✅ All templates valid!"
else
    echo "❌ Template validation failed!"
    exit 1
fi
