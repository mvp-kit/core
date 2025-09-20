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
npx @mvp-kit/template-validator core

if [ $? -eq 0 ]; then
    echo "✅ All templates valid!"
else
    echo "❌ Template validation failed!"
    exit 1
fi