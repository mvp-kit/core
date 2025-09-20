#!/usr/bin/env node

/**
 * Sync template changes to examples/hello-world
 *
 * This script renders templates with hello-world values
 * and updates the working example.
 */

import fs from 'fs'
import path from 'path'

const EXAMPLE_DIR = 'examples/hello-world'
const TEMPLATE_ROOT = '.'

// Variables to use when rendering templates
const TEMPLATE_VALUES = {
  projectName: 'hello-world',
  projectDescription: 'A new MVPKit Core application: Hello World',
  domainName: 'hello-world.mvpkit.dev',
  packageManager: 'pnpm',
  packageManagerVersion: '10.14.0',
  // Derived values
  projectKebabCase: 'hello-world',
  workersName: 'hello-world-api'
}

// Template files to render (template path -> example path)
// Note: wrangler.toml files are excluded because they contain actual Cloudflare resource IDs
const SYNC_MAP = {
  'package.json.template': 'package.json',
  'biome.json.template': 'biome.json',
  'turbo.json.template': 'turbo.json',
  'tsconfig.json.template': 'tsconfig.json',
  'apps/web/package.json.template': 'apps/web/package.json',
  'apps/web/tsconfig.json.template': 'apps/web/tsconfig.json',
  // 'apps/web/wrangler.toml.template': 'apps/web/wrangler.toml', // Excluded - contains real IDs
  'apps/api/package.json.template': 'apps/api/package.json',
  'apps/api/tsconfig.json.template': 'apps/api/tsconfig.json',
  // 'apps/api/wrangler.toml.template': 'apps/api/wrangler.toml', // Excluded - contains real IDs
  'packages/types/package.json.template': 'packages/types/package.json',
  'packages/types/tsconfig.json.template': 'packages/types/tsconfig.json',
  'packages/config/package.json.template': 'packages/config/package.json',
  'packages/config/tsconfig.json.template': 'packages/config/tsconfig.json'
}

function renderTemplate(content, values) {
  let result = content

  // Replace template variables with actual values
  for (const [key, value] of Object.entries(values)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value)
  }

  // Handle Handlebars conditionals
  // {{#if (eq packageManager 'pnpm')}}...{{/if}}
  const conditionalRegex = /\{\{#if \(eq packageManager '([^']+)'\)\}\}([\s\S]*?)\{\{\/if\}\}/g
  result = result.replace(conditionalRegex, (match, condition, content) => {
    if (condition === values.packageManager) {
      return content
    }
    return ''
  })

  // Clean up any remaining template syntax that didn't match
  result = result.replace(/\{\{[^}]+\}\}/g, '')

  return result
}

function syncFile(templatePath, examplePath) {
  const fullTemplatePath = path.join(TEMPLATE_ROOT, templatePath)
  const fullExamplePath = path.join(EXAMPLE_DIR, examplePath)

  if (!fs.existsSync(fullTemplatePath)) {
    console.log(`❌ Template file not found: ${templatePath}`)
    return false
  }

  try {
    const templateContent = fs.readFileSync(fullTemplatePath, 'utf8')
    const renderedContent = renderTemplate(templateContent, TEMPLATE_VALUES)

    // Ensure example directory exists
    const exampleDir = path.dirname(fullExamplePath)
    if (!fs.existsSync(exampleDir)) {
      fs.mkdirSync(exampleDir, { recursive: true })
    }

    // Write to example file
    fs.writeFileSync(fullExamplePath, renderedContent)
    console.log(`✅ Synced: ${templatePath} → ${examplePath}`)
    return true
  } catch (error) {
    console.log(`❌ Failed to sync ${templatePath}: ${error.message}`)
    return false
  }
}

function main() {
  console.log('🔄 Syncing template changes to hello-world example...')

  let successCount = 0
  let totalCount = 0

  for (const [templatePath, examplePath] of Object.entries(SYNC_MAP)) {
    totalCount++
    if (syncFile(templatePath, examplePath)) {
      successCount++
    }
  }

  console.log(`\n📈 Summary: ${successCount}/${totalCount} files synced successfully`)

  if (successCount === totalCount) {
    console.log('🎉 All files synced! Example is ready for development.')
    console.log('💡 Next: cd examples/hello-world && pnpm install && pnpm dev')
  } else {
    console.log('⚠️  Some files failed to sync. Check the errors above.')
    process.exit(1)
  }
}

main()