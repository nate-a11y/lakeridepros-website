#!/usr/bin/env node

/**
 * Color Audit Script for Lake Ride Pros
 *
 * Scans codebase for hardcoded color values that should use CSS variables.
 * Run with: npm run lint:colors
 *
 * Exit codes:
 *   0 - No violations found
 *   1 - Violations found (will fail CI)
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

// LRP Brand colors that should use variables instead
const BRAND_COLOR_PATTERNS = [
  { pattern: /#4cbb17/gi, variable: 'var(--primary)' },
  { pattern: /#60e421/gi, variable: 'var(--primary-light)' },
  { pattern: /#3a8e11/gi, variable: 'var(--primary-dark)' },
  { pattern: /#060606/gi, variable: 'var(--lrp-black)' },
  { pattern: /#e6e6e6/gi, variable: 'var(--lrp-gray-light)' },
  // Common hardcoded grays/whites that appear in the codebase
  { pattern: /#0f0f0f/gi, variable: 'var(--dark-bg-secondary)' },
  { pattern: /#1a1a1a/gi, variable: 'var(--dark-bg-tertiary)' },
  // rgba patterns for primary color
  { pattern: /rgba\(76,\s*187,\s*23,\s*[\d.]+\)/gi, variable: 'var(--primary-alpha-XX)' },
];

// File extensions to check
const EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js', '.css', '.scss'];

// Directories to skip
const SKIP_DIRS = [
  'node_modules',
  '.next',
  '.git',
  'out',
  'build',
  'coverage',
  '.vercel',
];

// Files to skip (these define the variables)
const SKIP_FILES = [
  'globals.css',
  'audit-colors.js',
  'tailwind.config.ts',
  'tailwind.config.js',
];

// Paths to skip (email templates can't use CSS variables - they're HTML strings)
const SKIP_PATHS = [
  '/api/email/',
  '/lib/email.ts',
  '/lib/notifications/',
];

// Allowed patterns (e.g., in comments or definitions)
const ALLOWED_CONTEXTS = [
  /--primary:\s*#4cbb17/,
  /--primary-light:\s*#60e421/,
  /--primary-dark:\s*#3a8e11/,
  /--lrp-black:\s*#060606/,
  /\/\*.*\*\//s, // CSS comments
  /\/\/.*/,      // JS comments
];

function getAllFiles(dir, files = []) {
  const items = readdirSync(dir);

  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      if (!SKIP_DIRS.includes(item)) {
        getAllFiles(fullPath, files);
      }
    } else if (stat.isFile()) {
      const ext = extname(item);
      if (EXTENSIONS.includes(ext) && !SKIP_FILES.includes(item)) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

function isInAllowedContext(content, match, index) {
  // Check if match is in a variable definition line
  const lineStart = content.lastIndexOf('\n', index) + 1;
  const lineEnd = content.indexOf('\n', index);
  const line = content.slice(lineStart, lineEnd === -1 ? undefined : lineEnd);

  // Skip if it's a CSS variable definition
  if (line.includes('--') && line.includes(':')) {
    return true;
  }

  // Skip if in a comment
  if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*')) {
    return true;
  }

  // Skip if in Tailwind arbitrary value syntax (shadow-[...], focus:shadow-[...], etc.)
  // These are acceptable because Tailwind arbitrary values can't easily reference CSS variables
  if (line.includes('shadow-[') || line.includes('ring-[') || line.includes('outline-[')) {
    return true;
  }

  return false;
}

function auditFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const violations = [];

  for (const { pattern, variable } of BRAND_COLOR_PATTERNS) {
    let match;
    // Reset regex lastIndex
    pattern.lastIndex = 0;

    while ((match = pattern.exec(content)) !== null) {
      if (!isInAllowedContext(content, match[0], match.index)) {
        const lineNumber = content.slice(0, match.index).split('\n').length;
        violations.push({
          file: filePath,
          line: lineNumber,
          found: match[0],
          suggestion: variable,
        });
      }
    }
  }

  return violations;
}

function main() {
  console.log('\n🎨 Lake Ride Pros - Color Audit\n');
  console.log('Scanning for hardcoded color values...\n');

  const projectRoot = process.cwd();
  const allFiles = getAllFiles(projectRoot);

  // Filter out email templates (can't use CSS variables)
  const files = allFiles.filter(file => {
    const relativePath = file.replace(projectRoot, '');
    return !SKIP_PATHS.some(skipPath => relativePath.includes(skipPath));
  });

  let totalViolations = [];

  for (const file of files) {
    const violations = auditFile(file);
    if (violations.length > 0) {
      totalViolations = totalViolations.concat(violations);
    }
  }

  if (totalViolations.length === 0) {
    console.log('✅ No hardcoded color violations found!\n');
    console.log('All colors are using CSS variables correctly.\n');
    process.exit(0);
  } else {
    console.log(`❌ Found ${totalViolations.length} color violation(s):\n`);

    // Group by file
    const byFile = {};
    for (const v of totalViolations) {
      if (!byFile[v.file]) {
        byFile[v.file] = [];
      }
      byFile[v.file].push(v);
    }

    for (const [file, violations] of Object.entries(byFile)) {
      const relativePath = file.replace(projectRoot + '/', '');
      console.log(`📄 ${relativePath}`);
      for (const v of violations) {
        console.log(`   Line ${v.line}: ${v.found} → Use ${v.suggestion}`);
      }
      console.log('');
    }

    console.log('💡 Fix: Replace hardcoded colors with CSS variables from globals.css\n');
    process.exit(1);
  }
}

main();
