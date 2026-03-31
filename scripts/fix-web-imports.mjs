import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'web-dist';

const isJsLikeSpecifier = (specifier) =>
  specifier.endsWith('.js') ||
  specifier.endsWith('.mjs') ||
  specifier.endsWith('.cjs') ||
  specifier.endsWith('.json') ||
  specifier.endsWith('.css');

const rewriteImports = (content) => {
  const fromRe = /(from\s+['"])(\.\.?\/[^'"\n]+)(['"])/g;
  const importRe = /(import\(\s*['"])(\.\.?\/[^'"\n]+)(['"]\s*\))/g;

  const apply = (_, prefix, specifier, suffix) => {
    if (isJsLikeSpecifier(specifier) || specifier.endsWith('/')) return `${prefix}${specifier}${suffix}`;
    return `${prefix}${specifier}.js${suffix}`;
  };

  return content.replace(fromRe, apply).replace(importRe, apply);
};

const walk = (dir) => {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const st = statSync(fullPath);
    if (st.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!fullPath.endsWith('.js')) continue;

    const original = readFileSync(fullPath, 'utf8');
    const updated = rewriteImports(original);
    if (original !== updated) {
      writeFileSync(fullPath, updated, 'utf8');
    }
  }
};

walk(ROOT);
console.log('Relative ESM imports fixed in web-dist/*.js');
