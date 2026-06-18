import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const BASE_URL = 'https://raw.githubusercontent.com/mcp-elements/ui/main/packages'

// `__dirname` is undefined in ESM output. Derive it from import.meta.url so
// `--local` works against the monorepo. The bundle lives in packages/cli/dist,
// so two levels up is the `packages/` dir that registry paths are relative to.
const HERE = path.dirname(fileURLToPath(import.meta.url))

export async function fetchFile(relativePath: string, local = false): Promise<string> {
  if (local) {
    const localPath = path.join(HERE, '..', '..', relativePath)
    if (!fs.existsSync(localPath)) {
      throw new Error(`Local file not found: ${localPath}`)
    }
    return fs.readFileSync(localPath, 'utf-8')
  }

  const url = `${BASE_URL}/${relativePath}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${relativePath} (HTTP ${response.status}). ` +
      `Make sure the file exists at ${url}`
    )
  }

  return response.text()
}
