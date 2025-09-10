#!/usr/bin/env node
/*
  update-package-versions.js

  Updates the version field across all package.json files under cms/cms/packages.

  Usage:
    node scripts/update-package-versions.js --bump patch
    node scripts/update-package-versions.js --bump minor
    node scripts/update-package-versions.js --bump major
    node scripts/update-package-versions.js --set 1.2.3

  Options:
    --bump [patch|minor|major]    Bump the current version (default: patch if neither --bump nor --set provided)
    --set <version>                Set all packages to the specific version
    --packagesDir <path>           Override packages directory (default: cms/cms/packages)
    --dry                          Show changes without writing files
*/

const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = { bump: null, set: null, packagesDir: null, dry: false };
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--bump') {
      args.bump = argv[i + 1];
      i += 1;
      continue;
    }
    if (a === '--set') {
      args.set = argv[i + 1];
      i += 1;
      continue;
    }
    if (a === '--packagesDir') {
      args.packagesDir = argv[i + 1];
      i += 1;
      continue;
    }
    if (a === '--dry') {
      args.dry = true;
      continue;
    }
    if (a === '--help' || a === '-h') {
      printHelp();
      process.exit(0);
    }
  }
  return args;
}

function printHelp() {
  console.log(
    `\nUpdate versions for all packages under cms/cms/packages.\n\nUsage:\n  node scripts/update-package-versions.js --bump patch\n  node scripts/update-package-versions.js --bump minor\n  node scripts/update-package-versions.js --bump major\n  node scripts/update-package-versions.js --set 1.2.3\n\nOptions:\n  --bump [patch|minor|major]    Bump the current version (default: patch if neither --bump nor --set provided)\n  --set <version>                Set all packages to the specific version\n  --packagesDir <path>           Override packages directory (default: cms/cms/packages)\n  --dry                          Show changes without writing files\n`
  );
}

function isSemver(version) {
  return /^\d+\.\d+\.\d+(-[0-9A-Za-z-.]+)?(\+[0-9A-Za-z-.]+)?$/.test(version);
}

function bumpVersion(current, bump) {
  const match = current.match(/^(\d+)\.(\d+)\.(\d+)(.*)?$/);
  if (!match) {
    throw new Error(`Invalid semver: ${current}`);
  }
  let major = parseInt(match[1], 10);
  let minor = parseInt(match[2], 10);
  let patch = parseInt(match[3], 10);
  const remainder = match[4] || '';

  if (bump === 'major') {
    major += 1;
    minor = 0;
    patch = 0;
  } else if (bump === 'minor') {
    minor += 1;
    patch = 0;
  } else {
    // patch default
    patch += 1;
  }
  return `${major}.${minor}.${patch}`; // drop prerelease/build on bump
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  const content = JSON.stringify(data, null, 2) + '\n';
  fs.writeFileSync(filePath, content, 'utf8');
}

function main() {
  const args = parseArgs(process.argv);
  const repoRoot = path.resolve(__dirname, '..');
  const defaultPackagesDir = path.join(repoRoot, 'packages');
  const packagesDir = path.resolve(args.packagesDir || defaultPackagesDir);

  if (!fs.existsSync(packagesDir) || !fs.statSync(packagesDir).isDirectory()) {
    console.error(`Packages directory not found: ${packagesDir}`);
    process.exit(1);
  }

  const mode = args.set ? 'set' : args.bump ? 'bump' : 'bump';
  const bumpKind = args.bump || 'patch';
  const targetVersion = args.set || null;

  if (mode === 'set' && (!targetVersion || !isSemver(targetVersion))) {
    console.error(`Invalid --set version: ${targetVersion}`);
    process.exit(1);
  }
  if (mode === 'bump' && !['patch', 'minor', 'major'].includes(bumpKind)) {
    console.error(`Invalid --bump value: ${bumpKind}. Use patch|minor|major`);
    process.exit(1);
  }

  const packageDirs = fs
    .readdirSync(packagesDir)
    .map((name) => path.join(packagesDir, name))
    .filter((p) => fs.statSync(p).isDirectory());

  const changes = [];

  for (const dir of packageDirs) {
    const pkgPath = path.join(dir, 'package.json');
    if (!fs.existsSync(pkgPath)) continue;
    const pkg = readJson(pkgPath);
    const currentVersion = pkg.version;
    if (!currentVersion) continue;

    let nextVersion = currentVersion;
    if (mode === 'set') {
      nextVersion = targetVersion;
    } else {
      nextVersion = bumpVersion(currentVersion, bumpKind);
    }

    if (currentVersion !== nextVersion) {
      changes.push({
        name: pkg.name || path.basename(dir),
        from: currentVersion,
        to: nextVersion,
        pkgPath,
      });
      if (!args.dry) {
        pkg.version = nextVersion;
        writeJson(pkgPath, pkg);
      }
    }
  }

  if (changes.length === 0) {
    console.log('No packages updated.');
  } else {
    console.log(args.dry ? 'Planned updates:' : 'Updated packages:');
    for (const c of changes) {
      console.log(` - ${c.name}: ${c.from} -> ${c.to}`);
    }
  }
}

try {
  main();
} catch (err) {
  console.error(err.message || err);
  process.exit(1);
}
