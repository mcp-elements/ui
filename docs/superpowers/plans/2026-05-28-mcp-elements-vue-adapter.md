# Plan: mcp-elements Vue 3 Adapter Bootstrap

**Date:** 2026-05-28  
**Branch:** feat/vue-adapter  
**Stage:** C

## File Map

```
packages/vue/
├── package.json
├── tsconfig.json
├── tsup.config.ts
└── src/
    ├── index.ts
    ├── button.ts
    ├── card.ts
    ├── badge.ts
    ├── input.ts
    ├── textarea.ts
    ├── select.ts
    ├── switch.ts
    ├── dialog.ts
    ├── alert.ts
    └── tabs.ts
```

## Tasks

1. [x] Write plan doc
2. [x] Create `packages/vue/package.json`
3. [x] Create `packages/vue/tsconfig.json`
4. [x] Create `packages/vue/tsup.config.ts`
5. [x] Create 10 Vue components as `.ts` files using `defineComponent` + render functions
6. [x] Create `packages/vue/src/index.ts` barrel export
7. [x] Install deps + build
8. [x] Commit

## Implementation Notes

- All components use `defineComponent` + `setup()` returning render function (no `.vue` SFCs)
- v-model support via `emits: ['update:modelValue']` pattern
- CSS classes match React/Angular: `mcpe-{component}-{modifier}`
- External deps: `vue`, `@mcp-elements/core`
