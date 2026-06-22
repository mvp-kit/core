#!/usr/bin/env node

import fs from 'fs'
import path from 'path'

const ROOT = process.cwd()
const HAS_NESTED_EXAMPLE = fs.existsSync(path.join(ROOT, 'examples/hello-world'))
const TEMPLATE_FILES = {
  contextMap: path.join(ROOT, 'docs/llm/context-map.md.template'),
  changePlaybooks: path.join(ROOT, 'docs/llm/change-playbooks.md.template'),
}
const EXAMPLE_FILES = {
  contextMap: HAS_NESTED_EXAMPLE
    ? path.join(ROOT, 'examples/hello-world/docs/llm/context-map.md')
    : path.join(ROOT, 'docs/llm/context-map.md'),
  changePlaybooks: HAS_NESTED_EXAMPLE
    ? path.join(ROOT, 'examples/hello-world/docs/llm/change-playbooks.md')
    : path.join(ROOT, 'docs/llm/change-playbooks.md'),
}

const templateToken = (name) => `{{${name}}}`

const VALUES = {
  template: {
    name: templateToken('name'),
    domain: templateToken('domain'),
    packageManager: templateToken('packageManager'),
  },
  example: {
    name: 'hello-world',
    domain: 'hello-world.mvpkit.dev',
    packageManager: 'bun',
  },
}

const MODULES = [
  {
    id: 'auth',
    title: 'Authentication',
    description: 'Better Auth powered auth flows with app-level sign in/up components.',
    files: [
      'apps/app/src/components/auth',
      'services/api/src/lib/auth',
      'services/api/src/lib/db/auth.schema.ts',
    ],
  },
  {
    id: 'storage',
    title: 'Storage',
    description: 'R2-backed upload and list operations exposed via tRPC.',
    files: [
      'services/api/src/lib/storage.ts',
      'services/api/src/trpc/routers/storage.ts',
    ],
  },
  {
    id: 'user-shell',
    title: 'User Shell',
    description: 'Authenticated app shell and baseline user profile contract.',
    files: [
      'apps/app/src/components/app',
      'services/api/src/trpc/routers/user.ts',
    ],
  },
]

function fail(message) {
  console.error(`❌ ${message}`)
  process.exit(1)
}

function parseMode(argv) {
  const modeIndex = argv.indexOf('--mode')
  if (modeIndex === -1 || !argv[modeIndex + 1]) {
    fail('Missing required argument: --mode write-template|write-example|check')
  }

  const mode = argv[modeIndex + 1]
  if (!['write-template', 'write-example', 'check'].includes(mode)) {
    fail(`Invalid mode: ${mode}`)
  }

  return mode
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8')
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
}

function normalize(text) {
  return text.replace(/\r\n/g, '\n').replace(/\s+$/g, '').trimEnd() + '\n'
}

function stripQuotes(text) {
  const trimmed = text.trim()
  if ((trimmed.startsWith("'") && trimmed.endsWith("'")) ||
      (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith('`') && trimmed.endsWith('`'))) {
    return trimmed.slice(1, -1)
  }
  return trimmed
}

function isIdentifier(text) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(text.trim())
}

function findMatching(source, startIndex, openChar, closeChar) {
  let depth = 0
  let quote = null

  for (let i = startIndex; i < source.length; i++) {
    const char = source[i]
    const next = source[i + 1]

    if (quote) {
      if (char === '\\') {
        i += 1
        continue
      }
      if (char === quote) {
        quote = null
      }
      continue
    }

    if (char === '/' && next === '/') {
      while (i < source.length && source[i] !== '\n') i += 1
      continue
    }

    if (char === '/' && next === '*') {
      i += 2
      while (i < source.length && !(source[i] === '*' && source[i + 1] === '/')) i += 1
      i += 1
      continue
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char
      continue
    }

    if (char === openChar) {
      depth += 1
      continue
    }

    if (char === closeChar) {
      depth -= 1
      if (depth === 0) {
        return i
      }
    }
  }

  return -1
}

function splitTopLevel(text) {
  const entries = []
  let start = 0
  let quote = null
  let braces = 0
  let brackets = 0
  let parens = 0

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const next = text[i + 1]

    if (quote) {
      if (char === '\\') {
        i += 1
        continue
      }
      if (char === quote) {
        quote = null
      }
      continue
    }

    if (char === '/' && next === '/') {
      while (i < text.length && text[i] !== '\n') i += 1
      continue
    }

    if (char === '/' && next === '*') {
      i += 2
      while (i < text.length && !(text[i] === '*' && text[i + 1] === '/')) i += 1
      i += 1
      continue
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char
      continue
    }

    if (char === '{') braces += 1
    if (char === '}') braces -= 1
    if (char === '[') brackets += 1
    if (char === ']') brackets -= 1
    if (char === '(') parens += 1
    if (char === ')') parens -= 1

    if (char === ',' && braces === 0 && brackets === 0 && parens === 0) {
      const entry = text.slice(start, i).trim()
      if (entry) entries.push(entry)
      start = i + 1
    }
  }

  const finalEntry = text.slice(start).trim()
  if (finalEntry) entries.push(finalEntry)

  return entries
}

function splitKeyValue(entry) {
  let quote = null
  let braces = 0
  let brackets = 0
  let parens = 0

  for (let i = 0; i < entry.length; i++) {
    const char = entry[i]
    const next = entry[i + 1]

    if (quote) {
      if (char === '\\') {
        i += 1
        continue
      }
      if (char === quote) {
        quote = null
      }
      continue
    }

    if (char === '/' && next === '/') {
      while (i < entry.length && entry[i] !== '\n') i += 1
      continue
    }

    if (char === '/' && next === '*') {
      i += 2
      while (i < entry.length && !(entry[i] === '*' && entry[i + 1] === '/')) i += 1
      i += 1
      continue
    }

    if (char === '"' || char === "'" || char === '`') {
      quote = char
      continue
    }

    if (char === '{') braces += 1
    if (char === '}') braces -= 1
    if (char === '[') brackets += 1
    if (char === ']') brackets -= 1
    if (char === '(') parens += 1
    if (char === ')') parens -= 1

    if (char === ':' && braces === 0 && brackets === 0 && parens === 0) {
      return {
        key: stripQuotes(entry.slice(0, i).trim()),
        value: entry.slice(i + 1).trim(),
      }
    }
  }

  const shorthand = entry.trim().replace(/,$/, '')
  return {
    key: stripQuotes(shorthand),
    value: shorthand,
  }
}

function extractFirstObjectLiteral(text) {
  const objectStart = text.indexOf('{')
  if (objectStart === -1) return null

  const objectEnd = findMatching(text, objectStart, '{', '}')
  if (objectEnd === -1) return null

  return text.slice(objectStart, objectEnd + 1)
}

function extractObjectFromAssignment(source, assignmentPattern) {
  const match = assignmentPattern.exec(source)
  if (!match || match.index === undefined) {
    return null
  }

  const openBrace = source.indexOf('{', match.index)
  if (openBrace === -1) return null

  const closeBrace = findMatching(source, openBrace, '{', '}')
  if (closeBrace === -1) return null

  return source.slice(openBrace, closeBrace + 1)
}

function detectAuth(value) {
  if (/\bprotectedProcedure\b/.test(value)) return 'protected'
  if (/\bpublicProcedure\b/.test(value)) return 'public'
  if (/\bt\.procedure\b/.test(value)) return 'unknown'
  return 'unknown'
}

function isRouterValue(value, sourceKind) {
  if (sourceKind === 'api') {
    return /\brouter\s*\(/.test(value)
  }
  return /\b(?:t\.)?router\s*\(/.test(value)
}

function isProcedureValue(value, sourceKind) {
  if (sourceKind === 'api') {
    return /\b(?:publicProcedure|protectedProcedure)\b/.test(value)
  }
  return /\bt\.procedure\b/.test(value)
}

function parseRouterObject(objectLiteral, options) {
  const { sourceKind, prefix = '', routerMap = new Map() } = options
  const body = objectLiteral.slice(1, -1)
  const entries = splitTopLevel(body)
  const procedures = []

  for (const entryText of entries) {
    if (!entryText || entryText.startsWith('...')) continue

    const { key, value } = splitKeyValue(entryText)
    if (!key) continue

    const fullName = prefix ? `${prefix}.${key}` : key

    if (isRouterValue(value, sourceKind)) {
      const nestedObject = extractFirstObjectLiteral(value)
      if (!nestedObject) continue

      const nestedProcedures = parseRouterObject(nestedObject, {
        sourceKind,
        prefix: fullName,
        routerMap,
      })
      procedures.push(...nestedProcedures)
      continue
    }

    if (isProcedureValue(value, sourceKind)) {
      procedures.push({ name: fullName, auth: detectAuth(value) })
      continue
    }

    if (isIdentifier(value) && routerMap.has(value.trim())) {
      for (const nested of routerMap.get(value.trim())) {
        procedures.push({
          name: `${fullName}.${nested.name}`,
          auth: nested.auth,
        })
      }
    }
  }

  return procedures
}

function parseApiRouters() {
  const routersDir = path.join(ROOT, 'services/api/src/trpc/routers')
  const routerMap = new Map()

  if (fs.existsSync(routersDir)) {
    const routerFiles = fs.readdirSync(routersDir).filter((file) => file.endsWith('.ts')).sort()

    for (const fileName of routerFiles) {
      const content = readText(path.join(routersDir, fileName))
      const exportRegex = /export\s+const\s+(\w+)\s*=\s*router\s*\(/g

      for (const match of content.matchAll(exportRegex)) {
        const assignment = new RegExp(`${match[1]}\\s*=\\s*router\\s*\\(`)
        const objectLiteral = extractObjectFromAssignment(content, assignment)
        if (!objectLiteral) continue
        routerMap.set(
          match[1],
          parseRouterObject(objectLiteral, {
            sourceKind: 'api',
            prefix: '',
            routerMap,
          })
        )
      }
    }
  }

  const apiIndex = readText(path.join(ROOT, 'services/api/src/trpc/index.ts'))
  const rootObject = extractObjectFromAssignment(apiIndex, /appRouter\s*=\s*router\s*\(/)

  if (!rootObject) {
    fail('Unable to parse services/api/src/trpc/index.ts appRouter object.')
  }

  return parseRouterObject(rootObject, {
    sourceKind: 'api',
    prefix: '',
    routerMap,
  })
}

function parseTypeRouter() {
  const contractSource = readText(path.join(ROOT, 'packages/types/src/router.ts'))
  const rootObject = extractObjectFromAssignment(contractSource, /appRouter\s*=\s*t\.router\s*\(/)

  if (!rootObject) {
    fail('Unable to parse packages/types/src/router.ts appRouter object.')
  }

  return parseRouterObject(rootObject, {
    sourceKind: 'types',
    prefix: '',
    routerMap: new Map(),
  })
}

function uniqueSorted(items) {
  return Array.from(new Set(items)).sort((a, b) => a.localeCompare(b))
}

function crossCheckContracts(apiProcedures, typeProcedures) {
  const apiNames = uniqueSorted(apiProcedures.map((item) => item.name))
  const typeNames = uniqueSorted(typeProcedures.map((item) => item.name))

  const missingInTypes = apiNames.filter((name) => !typeNames.includes(name))
  const missingInApi = typeNames.filter((name) => !apiNames.includes(name))

  if (missingInTypes.length === 0 && missingInApi.length === 0) {
    return
  }

  const lines = ['Procedure contract mismatch between API router and type contract.']
  if (missingInTypes.length > 0) {
    lines.push(`Missing in packages/types/src/router.ts: ${missingInTypes.join(', ')}`)
  }
  if (missingInApi.length > 0) {
    lines.push(`Missing in services/api/src/trpc/index.ts + routers: ${missingInApi.join(', ')}`)
  }

  fail(lines.join('\n'))
}

function renderModuleSections() {
  return MODULES.map((module) => {
    const fileLines = module.files.map((file) => `- \`${file}\``).join('\n')
    return `## ${module.title}\n\n${module.description}\n\n${fileLines}`
  }).join('\n\n')
}

function renderContextMap(values, templateVersion, procedureNames) {
  const procedureList = procedureNames.map((name) => `- \`${name}\``).join('\n')

	  return `<!-- Generated by docs/scripts/context-sync.mjs. Do not edit manually. -->\n\n# Context Map\n\nTemplate: \`${values.name}\`\nTemplate version: \`${templateVersion}\`\n\n## Runtime Surfaces\n\n- \`apps/web\`: public marketing surface (routes: \`apps/web/src/routes/*\`)\n- \`apps/app\`: authenticated product surface (signed-in boundary: \`apps/app/src/routes/_app.tsx\`)\n- \`services/api\`: Cloudflare Worker API (pipeline: \`services/api/src/app.ts\`)\n- \`packages/*\`: shared schemas, UI, and bootstrap helpers\n\n## Boundaries\n\n- Public API shape and \`AppRouter\`: \`services/api/src/trpc\`\n- Shared request/response schemas: \`packages/types/src/schemas\` and \`packages/types/src/types\`\n- Cloudflare bindings, auth, database, and storage: \`services/api/src/lib\`\n- Browser access to backend behavior: typed clients in \`apps/*/src/lib\`\n\n## Key Libraries (Where They Live)\n\n- Hono (Worker HTTP): \`services/api/src/app.ts\`\n- tRPC router + context: \`services/api/src/trpc/index.ts\`\n- Contract router (\`AppRouter\`): \`services/api/src/trpc/index.ts\`\n- Better Auth (server): \`services/api/src/lib/auth\`\n- Better Auth (client): \`apps/app/src/lib/auth-client.tsx\`\n- TanStack Router: \`apps/*/src/routes/*\`\n- TanStack Query + tRPC client: \`apps/*/src/lib/providers/index.tsx\` and \`packages/config/src/trpc-client.ts\`\n- Cloudflare bindings: \`services/api/src/lib/context.ts\`\n- Drizzle schema/migrations: \`services/api/src/lib/db\` and \`services/api/drizzle.config.ts\`\n- Shared UI (shadcn style): \`packages/ui/src/components/ui\`\n\n## Baseline Modules\n\n${renderModuleSections()}\n\n## Router Contract (Procedure Names)\n\n${procedureList}\n`
}

function renderPlaybooks(values, apiProcedures, templateVersion) {
  const authMapLines = uniqueSorted(apiProcedures.map((item) => `${item.name} (${item.auth})`))
    .map((line) => `- \`${line}\``)
    .join('\n')

  const moduleSections = MODULES.map((module) => {
    const files = module.files.map((file) => `   - \`${file}\``).join('\n')
	    return `## ${module.title}\n\n1. Read module files:\n${files}\n2. Update \`packages/types\` schemas or shared types when public inputs or outputs change.\n3. Validate with \`${values.packageManager} typecheck\`.`
  }).join('\n\n')

	  return `<!-- Generated by docs/scripts/context-sync.mjs. Do not edit manually. -->\n\n# Change Playbooks\n\nTemplate: \`${values.name}\`\nTemplate version: \`${templateVersion}\`\n\nUse these when a change crosses app, API, package, or Cloudflare runtime boundaries.\n\n## Command Baseline\n\n- Dev: \`${values.packageManager} dev\`\n- Check: \`${values.packageManager} run check\`\n- Typecheck: \`${values.packageManager} typecheck\`\n- Lint: \`${values.packageManager} lint\`\n- Build: \`${values.packageManager} build\`\n\n## Add Or Change A tRPC Procedure\n\n1. API: implement the procedure in \`services/api/src/trpc\`\n2. Shared schemas: update \`packages/types\` when public inputs or outputs should be reused outside the API\n3. Client: call it through the existing tRPC client in \`apps/app\` or \`apps/web\`\n4. Validate: run \`${values.packageManager} typecheck\`\n\n## Make A Procedure Auth-Protected\n\n1. Use \`protectedProcedure\` in \`services/api/src/trpc/procedures.ts\`\n2. Keep cookie forwarding in \`packages/config/src/trpc-client.ts\`\n3. Confirm frontend callers still type against \`AppRouter\` from \`@repo/api\`\n\n## Add Persistence Or File Storage\n\n1. D1 schema and migrations belong in \`services/api/src/lib/db\`\n2. KV and R2 access belongs behind helpers in \`services/api/src/lib\`\n3. Frontends should call tRPC procedures instead of importing storage or database code\n\n## Current Procedure Auth Map\n\n${authMapLines}\n\n${moduleSections}\n\n## Validation Checklist\n\n1. Procedure names are parsed from \`services/api/src/trpc\`.\n2. Shared schemas in \`packages/types\` are reused by API procedures when applicable.\n3. Generated docs are in sync: \`node docs/scripts/context-sync.mjs --mode check\`.\n4. Release-ready changes pass \`${values.packageManager} run check\`.\n`
}

function buildArtifacts(target) {
	const templateJsonPath = path.join(ROOT, 'template.json')
	const templateVersion = fs.existsSync(templateJsonPath)
		? JSON.parse(readText(templateJsonPath)).version
		: '0.1.0'

	  const apiProcedures = parseApiRouters()

  const procedureNames = uniqueSorted(apiProcedures.map((item) => item.name))
  const values = VALUES[target]

  return {
    contextMap: normalize(renderContextMap(values, templateVersion, procedureNames)),
    changePlaybooks: normalize(renderPlaybooks(values, apiProcedures, templateVersion)),
  }
}

function writeArtifacts(target) {
  const outputs = target === 'template' ? TEMPLATE_FILES : EXAMPLE_FILES
  const artifacts = buildArtifacts(target)

  ensureDir(outputs.contextMap)
  ensureDir(outputs.changePlaybooks)

  fs.writeFileSync(outputs.contextMap, artifacts.contextMap)
  fs.writeFileSync(outputs.changePlaybooks, artifacts.changePlaybooks)

  console.log(`✅ Wrote ${target} LLM docs:`)
  console.log(`   - ${path.relative(ROOT, outputs.contextMap)}`)
  console.log(`   - ${path.relative(ROOT, outputs.changePlaybooks)}`)
}

function checkArtifacts() {
  const expectedExample = buildArtifacts('example')

  const checks = [
    { file: EXAMPLE_FILES.contextMap, expected: expectedExample.contextMap },
    { file: EXAMPLE_FILES.changePlaybooks, expected: expectedExample.changePlaybooks },
  ]

  if (fs.existsSync(TEMPLATE_FILES.contextMap) && fs.existsSync(TEMPLATE_FILES.changePlaybooks)) {
    const expectedTemplate = buildArtifacts('template')
    checks.unshift(
      { file: TEMPLATE_FILES.changePlaybooks, expected: expectedTemplate.changePlaybooks },
      { file: TEMPLATE_FILES.contextMap, expected: expectedTemplate.contextMap },
    )
  }

  const failures = []

  for (const check of checks) {
    if (!fs.existsSync(check.file)) {
      failures.push(`Missing file: ${path.relative(ROOT, check.file)}`)
      continue
    }

    const current = normalize(readText(check.file))
    if (current !== check.expected) {
      failures.push(`Outdated file: ${path.relative(ROOT, check.file)} (run context-sync write modes)`)
    }
  }

  if (failures.length > 0) {
    fail(failures.join('\n'))
  }

  console.log('✅ LLM docs are up to date and contracts are aligned.')
}

function main() {
  const mode = parseMode(process.argv.slice(2))

  if (mode === 'write-template') {
    writeArtifacts('template')
    return
  }

  if (mode === 'write-example') {
    writeArtifacts('example')
    return
  }

  checkArtifacts()
}

main()
