import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, extname, relative, resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const ignored = new Set(['.git', '.build', '.dart_tool', 'node_modules']);
const markdownFiles = [];

function collect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignored.has(entry.name)) continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) collect(path);
    else if (extname(entry.name).toLowerCase() === '.md') markdownFiles.push(path);
  }
}

collect(root);
const missing = [];
const markdownLink = /!?\[[^\]]*\]\(([^)]+)\)/g;

for (const markdownFile of markdownFiles) {
  const content = readFileSync(markdownFile, 'utf8');
  for (const match of content.matchAll(markdownLink)) {
    const target = match[1].trim().replace(/^<|>$/g, '').split('#', 1)[0];
    if (!target || /^(?:https?:|mailto:)/i.test(target)) continue;
    const resolved = resolve(dirname(markdownFile), decodeURIComponent(target));
    if (!existsSync(resolved)) {
      missing.push(`${relative(root, markdownFile)} -> ${target}`);
    }
  }
}

if (missing.length > 0) {
  console.error('Missing local Markdown targets:');
  for (const item of missing) console.error(`- ${item}`);
  process.exitCode = 1;
} else {
  console.log(`Checked local links in ${markdownFiles.length} Markdown files.`);
}
