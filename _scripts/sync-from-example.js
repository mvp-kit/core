#!/usr/bin/env node

/**
 * Sync changes from examples/hello-world back to template files
 *
 * This script helps when you make changes in the working example
 * and want to sync them back to the template.
 */

import fs from 'fs'
import path from 'path'

const EXAMPLE_DIR = 'examples/hello-world'
const TEMPLATE_ROOT = '.'

// Variables used in hello-world example
const EXAMPLE_VALUES = {
  projectName: 'hello-world',
  projectDescription: 'A new MVPKit Core application: Hello World',
  domainName: 'hello-world.mvpkit.dev',
  packageManager: 'pnpm',
  packageManagerVersion: '10.14.0'
}

// Files to sync (example path -> template path)
// Note: wrangler.toml files are excluded because they contain actual Cloudflare resource IDs
const SYNC_MAP = {
  'package.json': 'package.json.template',
  'biome.json': 'biome.json.template',
  'turbo.json': 'turbo.json.template',
  'tsconfig.json': 'tsconfig.json.template',
  'apps/web/package.json': 'apps/web/package.json.template',
  'apps/web/tsconfig.json': 'apps/web/tsconfig.json.template',
  // 'apps/web/wrangler.toml': 'apps/web/wrangler.toml.template', // Excluded - contains real IDs
  'apps/api/package.json': 'apps/api/package.json.template',
  'apps/api/tsconfig.json': 'apps/api/tsconfig.json.template',
  // 'apps/api/wrangler.toml': 'apps/api/wrangler.toml.template', // Excluded - contains real IDs
  'packages/types/package.json': 'packages/types/package.json.template',
  'packages/types/tsconfig.json': 'packages/types/tsconfig.json.template',
  'packages/config/package.json': 'packages/config/package.json.template',
  'packages/config/tsconfig.json': 'packages/config/tsconfig.json.template'
}

function reverseTemplate(content, values) {
  let result = content

  // Systematically replace all variable values with template variables
  // Process in order from most specific to most general

  // 1. Replace exact quoted strings first
  result = result.replace(new RegExp(`"${escapeRegex(values.projectDescription)}"`, 'g'), '"{{projectDescription}}"')

  // 2. Replace domain name (escape dots for regex)
  result = result.replace(new RegExp(escapeRegex(values.domainName), 'g'), '{{domainName}}')

  // 3. Replace package manager version (escape dots)
  result = result.replace(new RegExp(escapeRegex(values.packageManagerVersion), 'g'), '{{packageManagerVersion}}')

  // 4. Replace project name in all contexts
  result = result.replace(new RegExp(escapeRegex(values.projectName), 'g'), '{{projectName}}')

  // 5. Fix packageManager field specifically (it should not be projectName)
  result = result.replace(/"packageManager": "{{projectName}}@/g, `"packageManager": "${values.packageManager}@`)
  result = result.replace(new RegExp(`"${values.packageManager}@`, 'g'), '"{{packageManager}}@')

  // 6. Handle package manager conditionals
  if (result.includes('"pnpm":')) {
    result = result.replace(
      /,\s*"pnpm": \{\s*"overrides": \{\}\s*\}/,
      '{{#if (eq packageManager \'pnpm\')}},\n  "pnpm": {\n    "overrides": {}\n  }{{/if}}{{#if (eq packageManager \'bun\')}},\n  "trustedDependencies": []{{/if}}'
    )
  }

  return result
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function syncFile(examplePath, templatePath) {
  const fullExamplePath = path.join(EXAMPLE_DIR, examplePath)
  const fullTemplatePath = path.join(TEMPLATE_ROOT, templatePath)

  if (!fs.existsSync(fullExamplePath)) {
    console.log(`❌ Example file not found: ${examplePath}`)
    return false
  }

  try {
    const exampleContent = fs.readFileSync(fullExamplePath, 'utf8')
    const templateContent = reverseTemplate(exampleContent, EXAMPLE_VALUES)

    // Write to template file
    fs.writeFileSync(fullTemplatePath, templateContent)
    console.log(`✅ Synced: ${examplePath} → ${templatePath}`)
    return true
  } catch (error) {
    console.log(`❌ Failed to sync ${examplePath}: ${error.message}`)
    return false
  }
}

function main() {
  console.log('🔄 Syncing changes from hello-world example to templates...')

  let successCount = 0
  let totalCount = 0

  for (const [examplePath, templatePath] of Object.entries(SYNC_MAP)) {
    totalCount++
    if (syncFile(examplePath, templatePath)) {
      successCount++
    }
  }

  console.log(`\n📈 Summary: ${successCount}/${totalCount} files synced successfully`)

  if (successCount === totalCount) {
    console.log('🎉 All files synced! Run validation to ensure templates are correct.')
    console.log('💡 Next: ./_scripts/validate.sh')
  } else {
    console.log('⚠️  Some files failed to sync. Check the errors above.')
    process.exit(1)
  }
}

main()