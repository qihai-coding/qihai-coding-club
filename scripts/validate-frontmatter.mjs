import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

import fg from 'fast-glob'
import matter from 'gray-matter'

const DOCS_ROOT = path.resolve(process.cwd(), 'site')
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function normalizeDateInput(value) {
  if (typeof value === 'string') {
    return value
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }

  return null
}

function isIsoDate(value) {
  if (!ISO_DATE_PATTERN.test(value)) {
    return false
  }

  const parsed = new Date(`${value}T00:00:00.000Z`)
  if (Number.isNaN(parsed.getTime())) {
    return false
  }

  return parsed.toISOString().slice(0, 10) === value
}

function formatError(relativePath, message) {
  return `[${relativePath}] ${message}`
}

async function main() {
  const markdownFiles = await fg(['**/*.md', '!index.md', '!.vitepress/**'], {
    cwd: DOCS_ROOT,
    onlyFiles: true
  })

  if (markdownFiles.length === 0) {
    console.log('No markdown files found under site/.')
    return
  }

  const errors = []
  const warnings = []

  for (const relativePath of markdownFiles) {
    const absolutePath = path.join(DOCS_ROOT, relativePath)
    const source = await fs.readFile(absolutePath, 'utf8')
    const { data } = matter(source)

    if (typeof data.title !== 'string' || data.title.trim() === '') {
      errors.push(formatError(relativePath, 'frontmatter `title` is required and must be a non-empty string.'))
    }

    if (data.date !== undefined) {
      const normalizedDate = normalizeDateInput(data.date)
      if (!normalizedDate) {
        errors.push(formatError(relativePath, 'frontmatter `date` must be a string in YYYY-MM-DD format.'))
      } else if (!isIsoDate(normalizedDate)) {
        warnings.push(
          formatError(
            relativePath,
            `frontmatter \`date\` "${normalizedDate}" is not a strict ISO date (YYYY-MM-DD). It will be ignored in date-based sorting.`
          )
        )
      }
    }

    if (data.tags !== undefined) {
      const tagsValid = Array.isArray(data.tags) && data.tags.every((item) => typeof item === 'string' && item.trim() !== '')
      if (!tagsValid) {
        errors.push(formatError(relativePath, 'frontmatter `tags` must be an array of non-empty strings.'))
      }
    }

    if (data.summary !== undefined && typeof data.summary !== 'string') {
      errors.push(formatError(relativePath, 'frontmatter `summary` must be a string.'))
    }

    if (data.draft !== undefined && typeof data.draft !== 'boolean') {
      errors.push(formatError(relativePath, 'frontmatter `draft` must be a boolean.'))
    }

    if (data.order !== undefined) {
      if (typeof data.order !== 'number' || !Number.isFinite(data.order)) {
        errors.push(formatError(relativePath, 'frontmatter `order` must be a finite number.'))
      }
    }
  }

  for (const warning of warnings) {
    console.warn(`WARN  ${warning}`)
  }

  if (errors.length > 0) {
    console.error('\nFrontmatter validation failed:\n')
    for (const error of errors) {
      console.error(`ERROR ${error}`)
    }
    process.exitCode = 1
    return
  }

  console.log(`Frontmatter validation passed (${markdownFiles.length} file(s)).`)
}

main().catch((error) => {
  console.error('Unexpected error during frontmatter validation:')
  console.error(error)
  process.exitCode = 1
})
