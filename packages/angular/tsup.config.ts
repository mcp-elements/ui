import { defineConfig } from 'tsup'

// NOTE: This is a JIT-style transpile, NOT an Angular AOT build.
// esbuild (which tsup uses) does not run the Angular AOT / Ivy compiler, so the
// emitted JS is decorator-metadata source that Angular compiles at runtime (JIT)
// or via the consuming app's own AOT pipeline. The proper AOT-compatible tool for
// an Angular library is ng-packagr (Angular Package Format), but ng-packagr /
// @angular/compiler-cli are not part of this workspace, so we mirror the
// react/vue tsup setup here. `experimentalDecorators` + `emitDecoratorMetadata`
// are enabled in tsconfig.json so the @Component/@Input/@Output decorator
// metadata survives transpilation.
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  target: 'es2022',
  external: ['@angular/core', '@angular/common', '@angular/forms', '@mcp-elements/core'],
})
