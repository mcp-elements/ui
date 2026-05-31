import path from 'node:path'
import fs from 'node:fs'

const BASE_URL = 'https://raw.githubusercontent.com/mcp-elements/ui/main/packages'

export async function fetchFile(relativePath: string, local = false): Promise<string> {
  if (local) {
    const localPath = path.join(__dirname, '..', '..', '..', relativePath)
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
