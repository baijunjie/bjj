import fs from 'node:fs'
import path from 'node:path'
import { merge } from 'lodash-es'

/**
 * Merge JSON files from multiple input directories into a single output directory
 * @param input - Array of input directory paths
 * @param output - Output directory path
 */
export function i18nMergeJsonFiles (input: string[], output: string): void {
  if (!Array.isArray(input) || input.length === 0) {
    throw new Error('input must be a non-empty array')
  }
  if (!output) {
    throw new Error('output cannot be empty')
  }

  const jsonFilesMap = new Map<string, Record<string, unknown>>()

  for (const dir of input) {
    if (!fs.existsSync(dir)) continue
    const stats = fs.statSync(dir)
    if (!stats.isDirectory()) continue

    const files = fs.readdirSync(dir)
    for (const file of files) {
      if (!file.endsWith('.json')) continue
      const filePath = path.join(dir, file)
      const fileStats = fs.statSync(filePath)
      if (!fileStats.isFile()) continue

      try {
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        const jsonData = JSON.parse(fileContent)
        if (jsonFilesMap.has(file)) {
          const existingData = jsonFilesMap.get(file)!
          jsonFilesMap.set(file, merge({}, existingData, jsonData))
        } else {
          jsonFilesMap.set(file, jsonData)
        }
      } catch (error) {
        console.error(`Error processing ${filePath}:`, (error as Error).message)
      }
    }
  }

  if (jsonFilesMap.size === 0) return

  if (!fs.existsSync(output)) {
    fs.mkdirSync(output, { recursive: true })
  }

  for (const [ fileName, jsonData ] of jsonFilesMap) {
    const outputPath = path.join(output, fileName)
    fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2), 'utf-8')
  }
}
