import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const ROOT = 'web-dist';

const hasExplicitExtension = (specifier) =>
  specifier.endsWith('.js') ||
  specifier.endsWith('.mjs') ||
  specifier.endsWith('.cjs') ||
  specifier.endsWith('.json') ||
  specifier.endsWith('.css');

const resolveSpecifier = (filePath, specifier) => {
  if (hasExplicitExtension(specifier) || specifier.endsWith('/')) return specifier;

  const baseDir = dirname(filePath);
  const absTarget = resolve(baseDir, specifier);

  if (existsSync(`${absTarget}.js`)) {
    return `${specifier}.js`;
  }

  if (existsSync(absTarget) && statSync(absTarget).isDirectory() && existsSync(join(absTarget, 'index.js'))) {
    return `${specifier}/index.js`;
  }

  return `${specifier}.js`;
};

const rewriteImports = (filePath, content) => {
  const fromRe = /(from\s+['"])(\.\.?\/[^'"\n]+)(['"])/g;
  const importRe = /(import\(\s*['"])(\.\.?\/[^'"\n]+)(['"]\s*\))/g;

  const apply = (_, prefix, specifier, suffix) => {
    return `${prefix}${resolveSpecifier(filePath, specifier)}${suffix}`;
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
    const updated = rewriteImports(fullPath, original);
    if (original !== updated) {
      writeFileSync(fullPath, updated, 'utf8');
    }
  }
};

walk(ROOT);
console.log('Relative ESM imports fixed in web-dist/*.js');
