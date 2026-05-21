# Plan 1: Repo Rename — snuxt-ui → mcp-elements

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rename every brand reference from `snuxt-ui` → `mcp-elements` across packages, configs, examples, and active docs, with full build + tests green at every commit. Historical references in `WIP.md`, `docs/superpowers/specs/`, and `docs/research/` MUST be preserved.

**Architecture:** Ten atomic tasks executed in dependency order — innermost packages first (core, css), then consumers (react, angular, cli, examples), then CSS class prefix, then docs site, then README. Each task includes consumer updates so workspaces stay linked and builds stay green between commits.

**Tech Stack:** pnpm workspaces, Turborepo, tsup, Vitest, Biome, Astro/Starlight docs site, bash + GNU sed (BSD-compatible `sed -i ''` syntax for macOS).

**Spec reference:** `docs/superpowers/specs/2026-05-21-mcp-elements-design.md` §§ 8-9 (CLI changes, Migration from snuxt-ui).

**Estimated effort (solo, 10-15 hrs/week):** 5-8 hours total wall-time. Most tasks are mechanical sed + verify.

---

## Pre-flight notes

- **macOS sed in-place flag**: use `sed -i ''` (empty string argument). On Linux: `sed -i`. Plan uses macOS form because the host platform is darwin.
- **Files to LEAVE UNTOUCHED** (intentional historical references):
  - `WIP.md` (project state doc — references both brands by design)
  - `docs/superpowers/specs/2026-05-21-mcp-elements-design.md` (refs snuxt-ui as predecessor)
  - `docs/research/*.md` (research artifacts; reference both brands)
  - `.git/`, `node_modules/`, `dist/`, `pnpm-lock.yaml` (lock file regenerates)
- **Files to UPDATE**: all `packages/`, `examples/`, `README.md`, root `package.json`.

---

## Task 1: Baseline + rename-assertion script

**Files:**
- Create: `scripts/check-no-stale-brand.sh`
- Save baselines: `/tmp/build-baseline.log`, `/tmp/test-baseline.log`

- [ ] **Step 1: Verify clean working tree**

```bash
cd /Users/mayurrawte/thepsygeek/snx-ui
git status --short
```

Expected: no output (clean tree).

- [ ] **Step 2: Run the current build, save output**

```bash
pnpm build 2>&1 | tee /tmp/build-baseline.log
```

Expected: all 7 packages build; final line includes "Tasks: 7 successful". If any package fails, stop and fix before proceeding.

- [ ] **Step 3: Run tests, save output**

```bash
pnpm test 2>&1 | tee /tmp/test-baseline.log
```

Expected: all tests pass (or "no test files" if none exist). Record the pass count for comparison later.

- [ ] **Step 4: Create the rename-assertion script**

```bash
mkdir -p scripts
cat > scripts/check-no-stale-brand.sh <<'BASH'
#!/usr/bin/env bash
# Fails if any source/config/active-docs file still references snuxt-ui or snx- prefix.
# Excludes intentional historical-context files.
set -u

EXCLUDES=(
  --exclude-dir=node_modules
  --exclude-dir=dist
  --exclude-dir=.git
  --exclude-dir=.astro
  --exclude-dir=.turbo
  --exclude=pnpm-lock.yaml
  --exclude=WIP.md
)

PATHS=(packages examples README.md package.json)

# Excluded files inside docs/ (historical artifacts allowed to keep old brand)
DOC_EXCLUDES_PATTERN='docs/superpowers/specs/|docs/research/'

fail=0

scan() {
  local pattern="$1"
  local label="$2"
  local hits
  hits=$(grep -RInE "$pattern" "${EXCLUDES[@]}" "${PATHS[@]}" 2>/dev/null | grep -vE "$DOC_EXCLUDES_PATTERN" || true)
  if [ -n "$hits" ]; then
    echo "❌ Stale brand ($label):"
    echo "$hits"
    fail=1
  fi
}

scan '@snuxt-ui'           '@snuxt-ui import'
scan '"snuxt-ui"'          '"snuxt-ui" string literal'
scan '\bsnuxt-ui\b'        'bare snuxt-ui'
scan '\bsnx-'              'snx- CSS prefix'

if [ "$fail" -eq 0 ]; then
  echo "✅ No stale snuxt-ui / snx- references found."
fi
exit "$fail"
BASH
chmod +x scripts/check-no-stale-brand.sh
```

- [ ] **Step 5: Run the assertion script (expect FAIL)**

```bash
./scripts/check-no-stale-brand.sh
```

Expected: exits non-zero, prints many `❌ Stale brand` lines. This is the failing test we'll drive to pass through tasks 2-9.

- [ ] **Step 6: Commit**

```bash
git add scripts/check-no-stale-brand.sh
git commit -m "chore: add stale-brand assertion script for mcp-elements rename"
```

---

## Task 2: Rename `@snuxt-ui/core` → `@mcp-elements/core`

**Files:**
- Modify: `packages/core/package.json` (name field)
- Modify: `packages/react/package.json`, `packages/angular/package.json`, `packages/cli/package.json` (dependencies map)
- Modify: any source file importing `@snuxt-ui/core`

- [ ] **Step 1: Verify which consumers import @snuxt-ui/core**

```bash
grep -rln '@snuxt-ui/core' packages/ --include='*.ts' --include='*.tsx' --include='*.json' | sort
```

Expected: package.json files for react/angular/cli and `.tsx` files in `packages/react/src/` importing the cn utility.

- [ ] **Step 2: Update core's package.json name**

```bash
sed -i '' 's|"@snuxt-ui/core"|"@mcp-elements/core"|g' packages/core/package.json
```

- [ ] **Step 3: Update consumer package.json dependencies**

```bash
sed -i '' 's|"@snuxt-ui/core"|"@mcp-elements/core"|g' \
  packages/react/package.json \
  packages/angular/package.json \
  packages/cli/package.json
```

- [ ] **Step 4: Update all source imports of @snuxt-ui/core**

```bash
grep -rln '@snuxt-ui/core' packages/ --include='*.ts' --include='*.tsx' \
  | xargs sed -i '' 's|@snuxt-ui/core|@mcp-elements/core|g'
```

- [ ] **Step 5: Reinstall to re-link workspaces**

```bash
pnpm install
```

Expected: pnpm reports linking `@mcp-elements/core` into react/angular/cli.

- [ ] **Step 6: Build and verify**

```bash
pnpm build
```

Expected: all 7 tasks successful (same as baseline).

- [ ] **Step 7: Run tests**

```bash
pnpm test
```

Expected: same pass count as baseline.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "refactor: rename @snuxt-ui/core to @mcp-elements/core"
```

---

## Task 3: Rename `@snuxt-ui/css` → `@mcp-elements/css`

**Files:**
- Modify: `packages/css/package.json` (name field)
- Modify: any consumer importing `@snuxt-ui/css/...`

- [ ] **Step 1: Find consumers**

```bash
grep -rln '@snuxt-ui/css' packages/ examples/ --include='*.ts' --include='*.tsx' --include='*.css' --include='*.json' --include='*.mdx' --include='*.html'
```

Expected: example apps + docs + maybe internal docs.

- [ ] **Step 2: Update css's package.json name**

```bash
sed -i '' 's|"@snuxt-ui/css"|"@mcp-elements/css"|g' packages/css/package.json
```

- [ ] **Step 3: Update all consumer references**

```bash
grep -rln '@snuxt-ui/css' packages/ examples/ --include='*.ts' --include='*.tsx' --include='*.css' --include='*.json' --include='*.mdx' --include='*.html' \
  | xargs sed -i '' 's|@snuxt-ui/css|@mcp-elements/css|g'
```

- [ ] **Step 4: Reinstall**

```bash
pnpm install
```

- [ ] **Step 5: Build**

```bash
pnpm build
```

Expected: all 7 tasks successful.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: rename @snuxt-ui/css to @mcp-elements/css"
```

---

## Task 4: Rename `@snuxt-ui/react` → `@mcp-elements/react`

**Files:**
- Modify: `packages/react/package.json` (name field)
- Modify: `examples/react-app/package.json` + sources (all `from '@snuxt-ui/react'`)
- Modify: `examples/docs/package.json` + sources

- [ ] **Step 1: Find consumers**

```bash
grep -rln '@snuxt-ui/react' packages/ examples/ --include='*.ts' --include='*.tsx' --include='*.json' --include='*.mdx' --include='*.astro' --include='*.html'
```

- [ ] **Step 2: Update react's package.json name**

```bash
sed -i '' 's|"@snuxt-ui/react"|"@mcp-elements/react"|g' packages/react/package.json
```

- [ ] **Step 3: Update all consumer references (sources + package.jsons + docs)**

```bash
grep -rln '@snuxt-ui/react' packages/ examples/ --include='*.ts' --include='*.tsx' --include='*.json' --include='*.mdx' --include='*.astro' --include='*.html' \
  | xargs sed -i '' 's|@snuxt-ui/react|@mcp-elements/react|g'
```

- [ ] **Step 4: Reinstall**

```bash
pnpm install
```

- [ ] **Step 5: Build**

```bash
pnpm build
```

Expected: all 7 tasks successful.

- [ ] **Step 6: Smoke-test the React example app**

```bash
pnpm --filter react-app dev &
SERVER_PID=$!
sleep 5
curl -sf http://localhost:5173 > /dev/null && echo "✅ react-app serving" || echo "❌ react-app DOWN"
kill $SERVER_PID
```

Expected: `✅ react-app serving`. If down, inspect the dev output before proceeding.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "refactor: rename @snuxt-ui/react to @mcp-elements/react"
```

---

## Task 5: Rename `@snuxt-ui/angular` → `@mcp-elements/angular`

**Files:**
- Modify: `packages/angular/package.json` (name field)
- Modify: `examples/angular-app/package.json` + sources

- [ ] **Step 1: Find consumers**

```bash
grep -rln '@snuxt-ui/angular' packages/ examples/ --include='*.ts' --include='*.json' --include='*.html' --include='*.mdx'
```

- [ ] **Step 2: Update angular's package.json name**

```bash
sed -i '' 's|"@snuxt-ui/angular"|"@mcp-elements/angular"|g' packages/angular/package.json
```

- [ ] **Step 3: Update all consumer references**

```bash
grep -rln '@snuxt-ui/angular' packages/ examples/ --include='*.ts' --include='*.json' --include='*.html' --include='*.mdx' \
  | xargs sed -i '' 's|@snuxt-ui/angular|@mcp-elements/angular|g'
```

- [ ] **Step 4: Reinstall + build**

```bash
pnpm install && pnpm build
```

Expected: all 7 tasks successful.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: rename @snuxt-ui/angular to @mcp-elements/angular"
```

---

## Task 6: Rename CLI package, bin, config file, registry URL

**Files:**
- Modify: `packages/cli/package.json` (`name`, `bin`)
- Modify: any `packages/cli/src/**/*.ts` referencing `snuxt-ui` or `snuxt-ui.json`
- Modify: `packages/cli/src/registry/registry.json` (`meta.baseUrl`)

- [ ] **Step 1: Update CLI package.json — name and bin**

```bash
sed -i '' 's|"name": "snuxt-ui"|"name": "mcp-elements"|' packages/cli/package.json
sed -i '' 's|"snuxt-ui": "./dist/index.js"|"mcp-elements": "./dist/index.js"|' packages/cli/package.json
```

- [ ] **Step 2: Update internal source references**

```bash
grep -rln '\bsnuxt-ui\b' packages/cli/src --include='*.ts' \
  | xargs sed -i '' 's|\bsnuxt-ui\b|mcp-elements|g'
```

- [ ] **Step 3: Update CLI config file name (`snuxt-ui.json` → `mcp-elements.json`)**

```bash
grep -rln '"snuxt-ui.json"' packages/cli/src --include='*.ts' \
  | xargs sed -i '' "s|snuxt-ui.json|mcp-elements.json|g"
```

- [ ] **Step 4: Update registry baseUrl**

Find the current value:

```bash
grep baseUrl packages/cli/src/registry/registry.json
```

Then replace `thepsygeek/snuxt-ui` → `mcp-elements/mcp-elements` (NOTE: GitHub org is `mcp-elements`, repo is `mcp-elements`):

```bash
sed -i '' 's|thepsygeek/snuxt-ui|mcp-elements/mcp-elements|g' packages/cli/src/registry/registry.json
```

- [ ] **Step 5: Build the CLI**

```bash
pnpm --filter mcp-elements build
```

Expected: builds successfully.

- [ ] **Step 6: Smoke-test the CLI bin name**

```bash
node packages/cli/dist/index.js --version
```

Expected: prints version number (no errors). If the entry name handling is broken, fix it before commit.

- [ ] **Step 7: Full build**

```bash
pnpm build
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "refactor: rename CLI package, bin, config file, registry URL to mcp-elements"
```

---

## Task 7: Rename CSS classes `snx-*` → `mcpe-*`

**Files:**
- All `packages/css/components/*.css` (define classes)
- All `packages/css/base.css`, `packages/css/themes/*.css` (may include selectors)
- All `packages/react/src/**/*.tsx` (className strings)
- All `packages/angular/src/**/*.ts` (class strings in templates)
- All `examples/**/*.tsx`, `examples/**/*.mdx`, `examples/**/*.html`, `examples/**/*.astro` (any string literal `snx-*`)

- [ ] **Step 1: Snapshot count of `snx-` occurrences before**

```bash
grep -rln 'snx-' packages/ examples/ | grep -v node_modules | grep -v dist | wc -l
```

Record the number. Used as sanity check after rename.

- [ ] **Step 2: Rename in CSS files**

```bash
grep -rln 'snx-' packages/css examples/docs/src/styles --include='*.css' \
  | xargs sed -i '' 's|snx-|mcpe-|g'
```

- [ ] **Step 3: Rename in React TSX files (className strings)**

```bash
grep -rln 'snx-' packages/react examples --include='*.tsx' --include='*.ts' \
  | xargs sed -i '' 's|snx-|mcpe-|g'
```

- [ ] **Step 4: Rename in Angular TS files (templates inline class strings)**

```bash
grep -rln 'snx-' packages/angular --include='*.ts' --include='*.html' \
  | xargs sed -i '' 's|snx-|mcpe-|g'
```

- [ ] **Step 5: Rename in MDX/HTML/Astro docs**

```bash
grep -rln 'snx-' examples/docs --include='*.mdx' --include='*.astro' --include='*.html' \
  | xargs sed -i '' 's|snx-|mcpe-|g'
```

- [ ] **Step 6: Verify no `snx-` left**

```bash
remaining=$(grep -rln 'snx-' packages/ examples/ | grep -v node_modules | grep -v dist | grep -v WIP.md | grep -v docs/superpowers | grep -v docs/research || true)
if [ -z "$remaining" ]; then
  echo "✅ No snx- references left in active code"
else
  echo "❌ Remaining:"
  echo "$remaining"
fi
```

Expected: `✅ No snx- references left in active code`.

- [ ] **Step 7: Full build + smoke test React example**

```bash
pnpm build
pnpm --filter react-app dev &
SERVER_PID=$!
sleep 5
curl -sf http://localhost:5173 > /dev/null && echo "✅ react-app serving" || echo "❌ react-app DOWN"
kill $SERVER_PID
```

Expected: build green, app serves. Visually verify in a browser that components still render correctly — the CSS prefix change should be invisible because both class names and CSS rules updated together.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "refactor: rename CSS class prefix snx-* to mcpe-*"
```

---

## Task 8: Update docs site references (examples/docs/)

**Files:**
- `examples/docs/astro.config.mjs` (site title, social links)
- `examples/docs/package.json` (name + description)
- `examples/docs/src/content/docs/**/*.mdx` (content references to "snuxt-ui" in prose, install commands like `npx snuxt-ui add ...`)
- `examples/docs/src/components/*.tsx` (any string)

- [ ] **Step 1: List remaining docs-site references**

```bash
grep -rln 'snuxt-ui\|snuxt' examples/docs/ --include='*.ts' --include='*.tsx' --include='*.mdx' --include='*.mjs' --include='*.json' --include='*.astro' --include='*.html'
```

- [ ] **Step 2: Replace text references in MDX / Astro / mjs / tsx / json / html**

```bash
grep -rln 'snuxt-ui' examples/docs/ --include='*.ts' --include='*.tsx' --include='*.mdx' --include='*.mjs' --include='*.json' --include='*.astro' --include='*.html' \
  | xargs sed -i '' 's|snuxt-ui|mcp-elements|g'
```

- [ ] **Step 3: Replace capitalized brand mentions (`snuxt-ui` → `mcp-elements`, then handle hero/title casing)**

The `sed` above already handles lowercase. Some content might use "Snuxt UI" as a title — search for it:

```bash
grep -rln 'Snuxt\b\|snuxt[^-]' examples/docs/ --include='*.mdx' --include='*.tsx' --include='*.astro'
```

If any hits, replace them manually with "mcp-elements" (the brand stays lowercase per § 1 of the spec).

```bash
grep -rln 'Snuxt' examples/docs/ \
  | xargs sed -i '' 's|Snuxt UI|mcp-elements|g; s|Snuxt|mcp-elements|g; s|Snuxt-UI|mcp-elements|g'
```

- [ ] **Step 4: Update docs site URL references**

The current site is `snuxt-ui.dev`. Replace with `mcp-elements.dev`:

```bash
grep -rln 'snuxt-ui\.dev' examples/docs/ \
  | xargs sed -i '' 's|snuxt-ui\.dev|mcp-elements.dev|g' || true
```

- [ ] **Step 5: Update Astro config (homepage title, social, custom domain)**

Open `examples/docs/astro.config.mjs` and verify the `title:`, `social:`, `customDomain:` (if any), `base:` fields read `mcp-elements`. Adjust any that the sed missed.

```bash
cat examples/docs/astro.config.mjs
```

- [ ] **Step 6: Build the docs site**

```bash
pnpm --filter docs build
```

Expected: builds successfully (Astro emits to `examples/docs/dist/`).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "docs(site): rename brand references in docs site from snuxt-ui to mcp-elements"
```

---

## Task 9: Update README + root package.json

**Files:**
- `README.md` (heading, badges, install commands, all brand mentions)
- `package.json` (root name + description)

- [ ] **Step 1: Update root package.json**

```bash
cat package.json | head -10
```

Replace name and description fields:

```bash
sed -i '' 's|"name": "snuxt-ui"|"name": "mcp-elements"|' package.json
# Description rewrite — manual edit recommended; suggested new value:
# "MCP UI for any framework. Beautifully designed components that copy into your project."
```

Manually edit `package.json` description to: `"MCP UI for any framework. Beautifully designed components that copy into your project."`

- [ ] **Step 2: Update README brand references via sed**

```bash
sed -i '' 's|snuxt-ui|mcp-elements|g; s|Snuxt UI|mcp-elements|g; s|Snuxt-UI|mcp-elements|g; s|Snuxt|mcp-elements|g' README.md
```

- [ ] **Step 3: Update README hero / tagline**

Manually edit `README.md` to:
- Change the `<h1>` to `mcp-elements`
- Update the tagline to: `MCP-native UI components that copy into your project. Multi-framework. Open Source. Open Code.`
- Update CLI examples to use `npx mcp-elements ...`
- Keep the install/usage/architecture structure intact

- [ ] **Step 4: Verify**

```bash
grep -n 'snuxt' README.md package.json || echo "✅ No snuxt references in README/root package.json"
```

Expected: `✅` line.

- [ ] **Step 5: Build**

```bash
pnpm build
```

- [ ] **Step 6: Commit**

```bash
git add README.md package.json
git commit -m "docs: rename brand in README and root package.json"
```

---

## Task 10: Final verification + cleanup

**Files:** none modified — verification only.

- [ ] **Step 1: Run the stale-brand assertion script**

```bash
./scripts/check-no-stale-brand.sh
```

Expected: `✅ No stale snuxt-ui / snx- references found.`

If hits remain: inspect them, classify as (a) a missed source/active-doc file → fix and re-commit, or (b) intentional historical artifact (WIP.md, specs/, research/) → add an `--exclude` to the script.

- [ ] **Step 2: Full build**

```bash
pnpm build
```

Expected: 7/7 tasks successful, identical structure to `/tmp/build-baseline.log` minus brand strings.

- [ ] **Step 3: Full test suite**

```bash
pnpm test
```

Expected: identical pass count to `/tmp/test-baseline.log`.

- [ ] **Step 4: Smoke-test the React example dev server**

```bash
pnpm --filter react-app dev &
SERVER_PID=$!
sleep 5
curl -sf http://localhost:5173 > /dev/null && echo "✅ react-app" || echo "❌ react-app"
kill $SERVER_PID
```

Expected: `✅ react-app`.

- [ ] **Step 5: Smoke-test the docs site preview**

```bash
pnpm --filter docs build && pnpm --filter docs preview &
SERVER_PID=$!
sleep 5
curl -sf http://localhost:4321 > /dev/null && echo "✅ docs site" || echo "❌ docs site"
kill $SERVER_PID
```

Expected: `✅ docs site`.

- [ ] **Step 6: Visually browse the React app and docs site**

- Open `http://localhost:5173` (after starting `pnpm --filter react-app dev`) in a real browser.
- Visit at least: Button demo, Dialog demo, Tabs demo, Prompt Input demo.
- Confirm all visuals are unchanged from baseline (same OKLCH colors, same layout).
- Open `http://localhost:4321` (after starting `pnpm --filter docs dev`).
- Confirm homepage hero reads `mcp-elements` and sidebar navigation works.

If visual regressions appear: the CSS prefix change likely missed a selector. Re-run `grep -rln 'snx-' packages/`. Fix the missed file, recommit, repeat verification.

- [ ] **Step 7: Update WIP.md decision log**

Add an entry to `WIP.md` § Decision Log:

```markdown
| 2026-05-21 | Stage B (rename) complete | All package names, CLI bin, CSS prefix, docs, README renamed. Build + tests green. Historical refs preserved in WIP.md/specs/research/. |
```

(Hand-edit `WIP.md`; do NOT use sed because WIP.md intentionally contains "snuxt-ui" references.)

- [ ] **Step 8: Mark Stage B done in WIP.md pipeline**

Find the `Stage B: Repo restructure` section in `WIP.md` and check off completed items (B1-B5).

- [ ] **Step 9: Commit WIP update**

```bash
git add WIP.md
git commit -m "docs: mark Stage B (rename) complete in WIP pipeline"
```

- [ ] **Step 10: Final summary**

Run:

```bash
git log --oneline -15
```

Expected: see ~9 commits from this plan, all chained off the prior `d2fff04` pivot commit.

Run:

```bash
./scripts/check-no-stale-brand.sh && pnpm build && pnpm test && echo "🎉 Rename plan 1 complete"
```

Expected: `🎉 Rename plan 1 complete`.

---

## Recovery / Rollback Notes

If a task fails midway:
- `git status` to see uncommitted changes
- `git diff` to inspect
- If rename was misapplied: `git restore .` to revert uncommitted changes; re-read the task; re-run

If a build breaks AFTER a commit:
- Identify the broken commit: `git log --oneline -10`
- Revert it: `git revert <sha>`
- Re-attempt the task with the bug fix

If pnpm workspaces stop linking after a rename:
- `rm -rf node_modules pnpm-lock.yaml && pnpm install` (last resort — slow)
- Or: `pnpm install --force`

---

## Next plan

After Plan 1 completes, draft **Plan 2: MCP Core Utilities** — implement `packages/core/src/mcp/{types,oauth,schema-form,tool-state,app-bridge,scope}.ts` with Vitest unit tests. Spec reference: § 4.2.
