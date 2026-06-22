#!/usr/bin/env node

/**
 * Sync changes from core template back to examples/hello-world
 *
 * This script is the reverse of sync-and-clean.js:
 * 1. Reads template files from the root directory
 * 2. Processes handlebars variables with actual values
 * 3. Writes processed files to examples/hello-world/
 *
 * Use this when the core template is ahead of the example.
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const TEMPLATE_ROOT = ".";
const EXAMPLE_DIR = "examples/hello-world";

// Variables used in hello-world example
const EXAMPLE_VALUES = {
	name: "hello-world",
	description:
		"Live demo of MVPKit - a modern full-stack TypeScript starter with React, tRPC, Cloudflare Workers, and authentication. Build and deploy MVPs faster.",
	domain: "hello-world.mvpkit.dev",
	tagline: "Build and deploy MVPs faster.",
	projectName: "hello-world",
	projectDescription:
		"Live demo of MVPKit - a modern full-stack TypeScript starter with React, tRPC, Cloudflare Workers, and authentication. Build and deploy MVPs faster.",
	domainName: "hello-world.mvpkit.dev",
	packageManager: "bun",
	packageManagerVersion: "1.3.10",
};

const REQUIRED_LLM_TEMPLATE_DOCS = [
	"docs/llm/context-map.md.template",
	"docs/llm/change-playbooks.md.template",
];

// Files/patterns to exclude from template sync (system files, build artifacts)
const EXCLUDE_PATTERNS = [
	"node_modules/",
	".git/",
	".wrangler/",
	".turbo/",
	"dist/",
	"build/",
	"coverage/",
	".env",
	".env.local",
	".env.production",
	"pnpm-lock.yaml",
	"package-lock.json",
	"yarn.lock",
	"bun.lockb",
	"*.tsbuildinfo",
	"*.log/",
	".DS_Store",
	".dev.vars",
	"_scripts/", // Don't sync build/sync scripts to example
	".github/", // Don't sync GitHub workflows to example
	".serena/", // Don't sync AI assistant directory
	"examples/", // Don't sync examples to example
	"template.json",
	".templateignore",
	"README.md", // Core readme is different from example readme
];

function escapeRegex(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function processHandlebarsConditionals(content, values) {
	let result = content;

	// Handle {{#if (eq packageManager 'pnpm')}} conditionals
	result = result.replace(
		/\{\{#if \(eq packageManager 'pnpm'\)\}\}(.*?)\{\{\/if\}\}/gs,
		(match, content) => {
			return values.packageManager === "pnpm" ? content : "";
		},
	);

	result = result.replace(
		/\{\{#if \(eq packageManager 'bun'\)\}\}(.*?)\{\{\/if\}\}/gs,
		(match, content) => {
			return values.packageManager === "bun" ? content : "";
		},
	);

	result = result.replace(
		/\{\{#if \(eq packageManager 'yarn'\)\}\}(.*?)\{\{\/if\}\}/gs,
		(match, content) => {
			return values.packageManager === "yarn" ? content : "";
		},
	);

	result = result.replace(
		/\{\{#if \(eq packageManager 'npm'\)\}\}(.*?)\{\{\/if\}\}/gs,
		(match, content) => {
			return values.packageManager === "npm" ? content : "";
		},
	);

	return result;
}

function applyTemplate(content, values) {
	let result = content;

	// Process handlebars conditionals first
	result = processHandlebarsConditionals(result, values);

	// Replace template variables with actual values.
	// Keep support for both legacy and current variable names.
	const replacements = [
		["name", values.name],
		["description", values.description],
		["domain", values.domain],
		["tagline", values.tagline],
		["projectName", values.projectName],
		["projectDescription", values.projectDescription],
		["domainName", values.domainName],
		["packageManager", values.packageManager],
		["packageManagerVersion", values.packageManagerVersion],
	];

	for (const [key, value] of replacements) {
		const pattern = new RegExp(`\\{\\{\\s*${escapeRegex(key)}\\s*\\}\\}`, "g");
		result = result.replace(pattern, value);
	}

	return result;
}

function shouldExclude(filePath) {
	return EXCLUDE_PATTERNS.some((pattern) => {
		if (pattern.endsWith("/")) {
			return filePath.startsWith(pattern) || filePath.includes(`/${pattern}`);
		}
		if (pattern.includes("*")) {
			const regex = new RegExp(pattern.replace(/\*/g, ".*"));
			return regex.test(filePath);
		}
		return filePath === pattern || filePath.endsWith(pattern);
	});
}

function getAllTemplateFiles(dir = TEMPLATE_ROOT, baseDir = TEMPLATE_ROOT) {
	const files = [];

	if (!fs.existsSync(dir)) return files;

	for (const item of fs.readdirSync(dir)) {
		const itemPath = path.join(dir, item);
		const relativePath = path.relative(baseDir, itemPath);

		// Skip excluded patterns
		if (shouldExclude(relativePath)) continue;

		try {
			const stat = fs.statSync(itemPath);
			if (stat.isDirectory()) {
				files.push(...getAllTemplateFiles(itemPath, baseDir));
			} else {
				files.push(relativePath);
			}
		} catch (error) {
			// Skip broken symlinks and other stat errors
			console.log(`⚠️  Skipping ${relativePath}: ${error.message}`);
		}
	}

	return files;
}

function getExamplePath(templatePath) {
	// Handle package manager specific files from _packageManagers/
	// Only process files for the current package manager
	const currentPM = EXAMPLE_VALUES.packageManager;

	if (templatePath.startsWith(`_packageManagers/${currentPM}/`)) {
		return templatePath.replace(`_packageManagers/${currentPM}/`, "");
	}

	// Skip files for other package managers
	if (templatePath.startsWith("_packageManagers/")) {
		return null; // Signal to skip this file
	}

	// Remove .template extension
	if (templatePath.endsWith(".template")) {
		return templatePath.slice(0, -9); // Remove '.template'
	}

	return templatePath;
}

function assertRequiredTemplateDocsExist() {
	const missing = REQUIRED_LLM_TEMPLATE_DOCS.filter((file) => !fs.existsSync(path.join(TEMPLATE_ROOT, file)));
	if (missing.length === 0) return;

	console.error("\n❌ Missing required LLM template docs. Cleanup aborted to prevent accidental deletion:");
	for (const file of missing) {
		console.error(`   - ${file}`);
	}
	console.error("Run: node docs/scripts/context-sync.mjs --mode write-template");
	process.exit(1);
}

function syncTemplateToExample(templatePath) {
	const fullTemplatePath = path.join(TEMPLATE_ROOT, templatePath);
	const examplePath = getExamplePath(templatePath);

	// Skip files for other package managers
	if (examplePath === null) {
		console.log(`⏭️  Skipped: ${templatePath} (different package manager)`);
		return true; // Return true so it doesn't count as an error
	}

	const fullExamplePath = path.join(EXAMPLE_DIR, examplePath);

	if (!fs.existsSync(fullTemplatePath)) {
		console.log(`❌ Template file not found: ${templatePath}`);
		return false;
	}

	try {
		// Ensure example directory exists
		const exampleDir = path.dirname(fullExamplePath);
		if (!fs.existsSync(exampleDir)) {
			fs.mkdirSync(exampleDir, { recursive: true });
		}

		// Read template file content
		const stat = fs.statSync(fullTemplatePath);
		if (stat.isDirectory()) {
			// Skip directories, they'll be created as needed
			return true;
		}

		// Check if it's a binary file
		const isBinary = [
			".png",
			".jpg",
			".jpeg",
			".gif",
			".ico",
			".svg",
			".woff",
			".woff2",
			".ttf",
			".eot",
		].some((ext) => templatePath.toLowerCase().endsWith(ext));

		if (isBinary) {
			// Copy binary files directly
			fs.copyFileSync(fullTemplatePath, fullExamplePath);
			console.log(`📁 Copied: ${templatePath} → ${examplePath}`);
		} else {
			// Process text files
			const templateContent = fs.readFileSync(fullTemplatePath, "utf8");

			// Always apply template replacement for known tokens on text files.
			// This prevents leaked placeholders when a source file accidentally isn't marked as .template.
			const exampleContent = applyTemplate(templateContent, EXAMPLE_VALUES);

			fs.writeFileSync(fullExamplePath, exampleContent);

			const action = templatePath.endsWith(".template")
				? "🔄 Processed"
				: "📄 Copied";
			console.log(`${action}: ${templatePath} → ${examplePath}`);
		}

		return true;
	} catch (error) {
		console.log(`❌ Failed to sync ${templatePath}: ${error.message}`);
		return false;
	}
}

function cleanupOrphanedExampleFiles(templateFiles) {
	const expectedExamplePaths = new Set(
		templateFiles.map((f) => getExamplePath(f)),
	);

	console.log("\n🧹 Cleaning up orphaned example files...");

	const ARTIFACT_DIRECTORIES = new Set([
		"node_modules",
		".turbo",
		"dist",
		"build",
	]);

	function cleanupExampleArtifacts(dir = EXAMPLE_DIR) {
		if (!fs.existsSync(dir)) return;

		for (const item of fs.readdirSync(dir)) {
			const itemPath = path.join(dir, item);
			const relativePath = path.relative(EXAMPLE_DIR, itemPath);

			try {
				const stat = fs.statSync(itemPath);
				if (stat.isDirectory()) {
					if (ARTIFACT_DIRECTORIES.has(item)) {
						fs.rmSync(itemPath, { recursive: true, force: true });
						console.log(`🗑️  Removed artifact directory: ${relativePath}/`);
						continue;
					}

					cleanupExampleArtifacts(itemPath);
					continue;
				}

				if (
					item.endsWith(".tsbuildinfo") ||
					item.endsWith(".log") ||
					item.endsWith(".tmp")
				) {
					fs.unlinkSync(itemPath);
					console.log(`🗑️  Removed artifact file: ${relativePath}`);
				}
			} catch (error) {
				console.log(`⚠️  Skipping artifact cleanup for ${relativePath}: ${error.message}`);
			}
		}
	}

	cleanupExampleArtifacts();

	// Files/patterns that should be preserved in example after template sync.
	const PRESERVE_IN_EXAMPLE = [
		".wrangler/",
		".DS_Store",
		".env",
		".env.example",
		".env.local",
		".env.development",
		".env.production",
		"pnpm-lock.yaml",
		"package-lock.json",
		"yarn.lock",
		"bun.lock",
		"bun.lockb",
		".dev.vars",
		"README.md", // Example might have its own README
	];

	function shouldPreserveInExample(filePath) {
		return PRESERVE_IN_EXAMPLE.some((pattern) => {
			if (pattern.endsWith("/")) {
				return filePath.startsWith(pattern) || filePath.includes(`/${pattern}`);
			}
			if (pattern.includes("*")) {
				const regex = new RegExp(pattern.replace(/\*/g, ".*"));
				return regex.test(filePath);
			}
			return filePath === pattern || filePath.endsWith(pattern);
		});
	}

	// Get all existing example files (excluding preserved ones)
	function getAllExampleFiles(dir = EXAMPLE_DIR) {
		const files = [];

		if (!fs.existsSync(dir)) return files;

		for (const item of fs.readdirSync(dir)) {
			const itemPath = path.join(dir, item);
			const relativePath = path.relative(EXAMPLE_DIR, itemPath);

			// Skip preserved files and directories
			if (shouldPreserveInExample(relativePath)) {
				continue;
			}

			try {
				const stat = fs.statSync(itemPath);
				if (stat.isDirectory()) {
					files.push(...getAllExampleFiles(itemPath));
				} else {
					files.push(relativePath);
				}
			} catch (error) {
				// Skip broken symlinks and other stat errors
				console.log(`⚠️  Skipping ${relativePath}: ${error.message}`);
			}
		}

		return files;
	}

	const existingExampleFiles = getAllExampleFiles();
	let cleanedCount = 0;

	for (const exampleFile of existingExampleFiles) {
		if (!expectedExamplePaths.has(exampleFile)) {
			const fullPath = path.join(EXAMPLE_DIR, exampleFile);
			try {
				fs.unlinkSync(fullPath);
				console.log(`🗑️  Removed orphaned: ${exampleFile}`);
				cleanedCount++;
			} catch (error) {
				console.log(`❌ Failed to remove ${exampleFile}: ${error.message}`);
			}
		}
	}

	if (cleanedCount === 0) {
		console.log("✨ No orphaned files to clean up");
	} else {
		console.log(`🗑️  Cleaned up ${cleanedCount} orphaned example files`);
	}
}

// Main execution
console.log(
	"🔄 Syncing ALL changes from core template to hello-world example...",
);

// Ensure example directory exists
if (!fs.existsSync(EXAMPLE_DIR)) {
	fs.mkdirSync(EXAMPLE_DIR, { recursive: true });
}

// Get all template files
const templateFiles = getAllTemplateFiles().filter((f) => !shouldExclude(f));

console.log(`📊 Found ${templateFiles.length} template files to sync`);

// Sync each file
let successCount = 0;
for (const file of templateFiles) {
	if (syncTemplateToExample(file)) {
		successCount++;
	}
}

// Clean up orphaned example files (disabled - too aggressive for now)
assertRequiredTemplateDocsExist();
cleanupOrphanedExampleFiles(templateFiles);

console.log(
	`\n📈 Summary: ${successCount}/${templateFiles.length} files synced successfully`,
);
console.log("🎉 Template to example sync complete!");
console.log("\n✅ Hello-world example is now up to date with core template");
console.log("🔧 Example is ready for development and testing");
