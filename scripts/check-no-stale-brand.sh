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
