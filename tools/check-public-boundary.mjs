import { readdirSync, readFileSync } from 'node:fs';
import { extname, relative, resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const ignoredDirectories = new Set([
  '.git',
  '.build',
  '.dart_tool',
  'build',
  'coverage',
  'node_modules',
]);
const forbiddenExtensions = new Set([
  '.env', '.jks', '.keystore', '.p8', '.p12', '.pem', '.ttf', '.otf',
]);
const rules = [
  ['private-key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ['github-token', /\bgh[pousr]_[A-Za-z0-9]{30,}\b/],
  ['cloud-access-key', /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
  ['credential-database-uri', /mongodb(?:\+srv)?:\/\/[^:\s/"']+:[^@\s/"']+@/],
  ['production-identifier', /com\.wakamo\.korail/i],
  ['production-domain', /korail\.wakamo\.moe/i],
  ['provider-domain', /smart\.letskorail\.com|gis\.korail\.com|rail\.blue/i],
];

const violations = [];

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const path = resolve(directory, entry.name);
    const displayPath = relative(root, path);
    if (entry.isDirectory()) {
      walk(path);
      continue;
    }

    const lowerName = entry.name.toLowerCase();
    if (lowerName === '.env' || lowerName.startsWith('.env.')) {
      violations.push({ path: displayPath, rule: 'environment-file' });
    }
    if (forbiddenExtensions.has(extname(lowerName))) {
      violations.push({ path: displayPath, rule: 'sensitive-or-unlicensed-file' });
    }

    const content = readFileSync(path);
    if (content.length > 2_000_000 || content.includes(0)) continue;
    const text = content.toString('utf8');
    for (const [rule, pattern] of rules) {
      if (pattern.test(text)) violations.push({ path: displayPath, rule });
    }
  }
}

walk(root);

if (violations.length > 0) {
  console.error('Public boundary violations:');
  for (const violation of violations) {
    console.error(`- ${violation.path}: ${violation.rule}`);
  }
  process.exitCode = 1;
} else {
  console.log('Public boundary check passed.');
}
