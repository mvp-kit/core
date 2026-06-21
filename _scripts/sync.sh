#!/bin/bash

#
# Template ↔ Example Sync Helper
#
# Keeps hello-world example and core template in sync during development
#

set -e

show_help() {
    echo "🔄 Template ↔ Example Sync"
    echo ""
    echo "USAGE:"
    echo "  $0 to-example     # Template → Example (render templates to example)"
    echo "  $0 from-example   # Example → Template (extract example back to templates)"
    echo "  $0 cleanup        # Clean build artifacts only (no sync)"
    echo "  $0 validate       # Validate templates after sync"
    echo "  $0 help          # Show this help"
    echo ""
    echo "WORKFLOW:"
    echo "  1. Make changes in templates      → Run: sync.sh to-example"
    echo "  2. Test/develop in hello-world   → Run: cd examples/hello-world && bun run dev"
    echo "  3. Make changes in hello-world   → Run: sync.sh from-example"
    echo "  4. Always validate after sync    → Run: sync.sh validate"
    echo ""
    echo "EXAMPLES:"
    echo "  ./_scripts/sync.sh to-example     # Sync template changes to working example"
    echo "  ./_scripts/sync.sh from-example   # Sync working example back to templates"
    echo "  ./_scripts/sync.sh cleanup        # Clean build artifacts from templates"
}

case "$1" in
    "to-example")
        echo "🧠 Regenerating template LLM docs..."
        node docs/scripts/context-sync.mjs --mode write-template
        echo "🔄 Syncing templates → hello-world example..."
        node _scripts/sync-template-to-example.js
        echo "🧠 Regenerating example LLM docs..."
        node docs/scripts/context-sync.mjs --mode write-example
        ;;
    "from-example")
        echo "🔄 Syncing hello-world example → templates..."
        node _scripts/sync-and-clean.js
        echo "🧠 Regenerating template LLM docs..."
        node docs/scripts/context-sync.mjs --mode write-template
        echo "🧠 Regenerating example LLM docs..."
        node docs/scripts/context-sync.mjs --mode write-example
        echo "🔍 Validating templates..."
        ./_scripts/validate.sh
        ;;
    "validate")
        echo "🔍 Validating templates..."
        ./_scripts/validate.sh
        ;;
    "cleanup")
        echo "🧹 Cleaning build artifacts..."
        node _scripts/sync-and-clean.js --cleanup-only
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    "")
        echo "❌ No command specified"
        echo ""
        show_help
        exit 1
        ;;
    *)
        echo "❌ Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
