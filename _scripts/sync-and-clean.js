#!/usr/bin/env node

/**
 * Sync changes from examples/hello-world back to template files and clean artifacts
 *
 * This script combines sync-from-example.js and cleanup-template.sh functionality:
 * 1. Syncs all changes from working example to template
 * 2. Cleans up build artifacts from template (preserving examples/)
 * 3. Preserves important template files like .templateignore
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

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

// Files/patterns to exclude from sync (contains actual secrets/IDs or generated content)
const EXCLUDE_PATTERNS = [
  'node_modules/',
  '.git/',
  '.wrangler/',
  '.turbo/',
  'dist/',
  'build/',
  'coverage/',
  '.env',
  '.env.local',
  '.env.production',
  'pnpm-lock.yaml',
  'package-lock.json',
  'yarn.lock',
  'bun.lockb',
  '*.tsbuildinfo',
  '*.log/',
  '.DS_Store',
  '.dev.vars',
  '_scripts/', // Protect build/sync scripts
  '.github/', // Protect GitHub workflows and configurations
  '.serena/' // Ignore Serena AI assistant directory
]

// Files to preserve during cleanup (never delete from template)
const PRESERVE_FILES = [
  '.templateignore',
  '_scripts/',
  '.github/',
  '.serena/',
  'examples/',
  '.gitignore',
  'README.md'
]

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')
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

  // 7. Handle baseUrl in vite.config.mts (construct from domainName)
  if (result.includes(`https://${values.domainName}`)) {
    result = result.replace(
      new RegExp(`'https://${escapeRegex(values.domainName)}'`, 'g'),
      "'https://{{domainName}}'"
    )
  }

  // 8. Handle domain URLs in HTML and other files (without quotes)
  if (result.includes(`https://${values.domainName}`)) {
    result = result.replace(
      new RegExp(`https://${escapeRegex(values.domainName)}`, 'g'),
      'https://{{domainName}}'
    )
  }

  return result
}

function shouldExclude(filePath) {
  return EXCLUDE_PATTERNS.some(pattern => {
    if (pattern.endsWith('/')) {
      return filePath.startsWith(pattern) || filePath.includes(`/${pattern}`)
    }
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'))
      return regex.test(filePath)
    }
    return filePath === pattern || filePath.endsWith(pattern)
  })
}

function getAllFiles(dir, baseDir = dir) {
  const files = []

  if (!fs.existsSync(dir)) return files

  for (const item of fs.readdirSync(dir)) {
    const itemPath = path.join(dir, item)
    const relativePath = path.relative(baseDir, itemPath)

    try {
      const stat = fs.statSync(itemPath)
      if (stat.isDirectory()) {
        files.push(...getAllFiles(itemPath, baseDir))
      } else {
        files.push(relativePath)
      }
    } catch (error) {
      // Skip broken symlinks and other stat errors
      console.log(`⚠️  Skipping ${relativePath}: ${error.message}`)
      continue
    }
  }

  return files
}

function getTemplatePath(examplePath) {
  // Handle package manager specific files - put them in _packageManagers/
  if (examplePath === 'pnpm-workspace.yaml') {
    return '_packageManagers/pnpm/pnpm-workspace.yaml'
  }

  // Handle other package manager files in the future
  if (examplePath.startsWith('bun.') && examplePath !== 'bun.lockb') {
    return `_packageManagers/bun/${examplePath}`
  }

  // For files that should have .template extension
  const shouldBeTemplate = (/\.(json|toml|ya?ml|config\.(js|ts|mjs)|html|env\.example|sh)$/.test(examplePath) &&
                           !examplePath.includes('/src/') &&
                           !examplePath.includes('/public/') &&
                           !examplePath.startsWith('_packageManagers/')) || // Package manager files handled above
                           examplePath.endsWith('vite.config.mts') || // Vite config contains project-specific URLs
                           examplePath.includes('src/lib/auth/index.ts') || // Auth config contains domain
                           examplePath.endsWith('setup-remote.sh') || // Setup script contains project names
                           examplePath.endsWith('wrangler.toml') // Cloudflare config contains project-specific names

  if (shouldBeTemplate) {
    return `${examplePath}.template`
  }

  return examplePath
}

function syncFile(examplePath) {
  const fullExamplePath = path.join(EXAMPLE_DIR, examplePath)
  const templatePath = getTemplatePath(examplePath)
  const fullTemplatePath = path.join(TEMPLATE_ROOT, templatePath)

  if (!fs.existsSync(fullExamplePath)) {
    console.log(`❌ Example file not found: ${examplePath}`)
    return false
  }

  try {
    // Ensure template directory exists
    const templateDir = path.dirname(fullTemplatePath)
    if (!fs.existsSync(templateDir)) {
      fs.mkdirSync(templateDir, { recursive: true })
    }

    // Read example file content
    const stat = fs.statSync(fullExamplePath)
    if (stat.isDirectory()) {
      // Skip directories, they'll be created as needed
      return true
    }

    // Check if it's a binary file
    const isBinary = ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.woff', '.woff2', '.ttf', '.eot'].some(ext =>
      examplePath.toLowerCase().endsWith(ext)
    )

    if (isBinary) {
      // Copy binary files directly
      fs.copyFileSync(fullExamplePath, fullTemplatePath)
      console.log(`📁 Copied: ${examplePath} → ${templatePath}`)
    } else {
      // Process text files
      const exampleContent = fs.readFileSync(fullExamplePath, 'utf8')

      // Apply reverse templating if this is a template file
      const templateContent = templatePath.endsWith('.template')
        ? reverseTemplate(exampleContent, EXAMPLE_VALUES)
        : exampleContent

      fs.writeFileSync(fullTemplatePath, templateContent)

      const action = templatePath.endsWith('.template') ? '🔄 Templated' : '📄 Copied'
      console.log(`${action}: ${examplePath} → ${templatePath}`)
    }

    return true
  } catch (error) {
    console.log(`❌ Failed to sync ${examplePath}: ${error.message}`)
    return false
  }
}

function cleanupOrphanedTemplateFiles(exampleFiles) {
  const expectedTemplatePaths = new Set(exampleFiles.map(f => getTemplatePath(f)))

  console.log('\n🧹 Cleaning up orphaned template files...')

  // Get all existing template files
  function getAllTemplateFiles(dir = TEMPLATE_ROOT) {
    const files = []

    if (!fs.existsSync(dir)) return files

    for (const item of fs.readdirSync(dir)) {
      if (item === 'examples' || item === 'node_modules' || item === '.git') continue

      const itemPath = path.join(dir, item)
      const relativePath = path.relative(TEMPLATE_ROOT, itemPath)

      const stat = fs.statSync(itemPath)
      if (stat.isDirectory()) {
        files.push(...getAllTemplateFiles(itemPath))
      } else if (!relativePath.includes('_scripts/') &&
                 !relativePath.includes('.serena/') &&
                 !relativePath.includes('.github/') &&
                 !PRESERVE_FILES.includes(relativePath)) {
        files.push(relativePath)
      }
    }

    return files
  }

  const existingTemplateFiles = getAllTemplateFiles()
  let cleanedCount = 0

  for (const templateFile of existingTemplateFiles) {
    // Don't remove preserved files
    if (PRESERVE_FILES.some(preserve => templateFile.startsWith(preserve))) {
      continue
    }

    // Preserve package manager files for other package managers
    const currentPM = EXAMPLE_VALUES.packageManager
    if (templateFile.startsWith('_packageManagers/') &&
        !templateFile.startsWith(`_packageManagers/${currentPM}/`)) {
      console.log(`🔒 Preserved: ${templateFile} (different package manager)`)
      continue
    }

    if (!expectedTemplatePaths.has(templateFile)) {
      const fullPath = path.join(TEMPLATE_ROOT, templateFile)
      try {
        fs.unlinkSync(fullPath)
        console.log(`🗑️  Removed orphaned: ${templateFile}`)
        cleanedCount++
      } catch (error) {
        console.log(`❌ Failed to remove ${templateFile}: ${error.message}`)
      }
    }
  }

  if (cleanedCount === 0) {
    console.log('✨ No orphaned files to clean up')
  } else {
    console.log(`🗑️  Cleaned up ${cleanedCount} orphaned template files`)
  }
}

function cleanupTemplateArtifacts() {
  console.log('\n🎯 Cleaning template build artifacts...')

  const cleanupPatterns = [
    { pattern: '**/dist', exclude: 'examples/**' },
    { pattern: '**/.turbo', exclude: 'examples/**' },
    { pattern: '**/*.tsbuildinfo', exclude: 'examples/**' },
    { pattern: '**/.wrangler', exclude: 'examples/**' },
    { pattern: '**/node_modules', exclude: 'examples/**' },
    { pattern: 'pnpm-lock.yaml', exclude: 'examples/**' },
    { pattern: 'package-lock.json', exclude: 'examples/**' },
    { pattern: 'yarn.lock', exclude: 'examples/**' },
    { pattern: 'bun.lock', exclude: 'examples/**' },
    { pattern: '**/.DS_Store', exclude: 'examples/**' },
    { pattern: '**/*.log', exclude: 'examples/**' },
    { pattern: '**/*.tmp', exclude: 'examples/**' },
    { pattern: '.env', exclude: 'examples/**' },
    { pattern: '.env.local', exclude: 'examples/**' },
    { pattern: '.env.development', exclude: 'examples/**' },
    { pattern: '.env.production', exclude: 'examples/**' }
  ]

  let cleanedCount = 0

  function cleanupFiles(dir = TEMPLATE_ROOT, basePath = '') {
    if (!fs.existsSync(dir)) return

    for (const item of fs.readdirSync(dir)) {
      const itemPath = path.join(dir, item)
      const relativePath = basePath ? path.join(basePath, item) : item

      // Skip examples directory entirely
      if (relativePath === 'examples' || relativePath.startsWith('examples/')) {
        continue
      }

      const stat = fs.statSync(itemPath)

      if (stat.isDirectory()) {
        // Check for directory cleanup patterns
        for (const { pattern } of cleanupPatterns) {
          if (pattern.endsWith('/**') && relativePath === pattern.slice(0, -3)) {
            // Skip - this is handled by file patterns
            continue
          }
          if ((pattern === '**/dist' && item === 'dist') ||
              (pattern === '**/.turbo' && item === '.turbo') ||
              (pattern === '**/.wrangler' && item === '.wrangler') ||
              (pattern === '**/node_modules' && item === 'node_modules')) {
            try {
              fs.rmSync(itemPath, { recursive: true, force: true })
              console.log(`🗑️  Removed: ${relativePath}/`)
              cleanedCount++
              continue
            } catch (error) {
              console.log(`❌ Failed to remove ${relativePath}: ${error.message}`)
            }
          }
        }

        // Recursively clean subdirectories
        cleanupFiles(itemPath, relativePath)
      } else {
        // Check for file cleanup patterns
        for (const { pattern } of cleanupPatterns) {
          let shouldClean = false

          if (pattern.startsWith('**/') && item === pattern.slice(3)) {
            shouldClean = true
          } else if (pattern.includes('*') && new RegExp(pattern.replace(/\*/g, '.*')).test(item)) {
            shouldClean = true
          } else if (relativePath === pattern) {
            shouldClean = true
          }

          if (shouldClean) {
            try {
              fs.unlinkSync(itemPath)
              console.log(`🗑️  Removed: ${relativePath}`)
              cleanedCount++
              break
            } catch (error) {
              console.log(`❌ Failed to remove ${relativePath}: ${error.message}`)
            }
          }
        }
      }
    }
  }

  cleanupFiles()

  if (cleanedCount === 0) {
    console.log('✨ No build artifacts to clean up')
  } else {
    console.log(`🧹 Cleaned up ${cleanedCount} build artifacts`)
  }
}

// Main execution
const cleanupOnly = process.argv.includes('--cleanup-only')

if (cleanupOnly) {
  console.log('🧹 Cleanup mode: Removing build artifacts only...')
  cleanupTemplateArtifacts()
  console.log('🎉 Cleanup complete!')
} else {
  console.log('🔄 Syncing ALL changes from hello-world example to templates...')

  // Get all files from example directory
  const exampleFiles = getAllFiles(EXAMPLE_DIR)
    .filter(f => !shouldExclude(f))

  console.log(`📊 Found ${exampleFiles.length} files to sync`)

  // Sync each file
  let successCount = 0
  for (const file of exampleFiles) {
    if (syncFile(file)) {
      successCount++
    }
  }

  // Clean up orphaned template files (but preserve important files)
  cleanupOrphanedTemplateFiles(exampleFiles)

  // Clean up build artifacts from template
  cleanupTemplateArtifacts()

  console.log(`\n📈 Summary: ${successCount}/${exampleFiles.length} files synced successfully`)
  console.log('🎉 Template sync and cleanup complete!')
  console.log('\n✅ Template is ready for distribution')
  console.log('📁 Examples directory preserved for development work')
  console.log('🔒 Important template files (.templateignore, scripts) preserved')
}