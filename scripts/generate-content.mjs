import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

import fg from 'fast-glob'
import matter from 'gray-matter'

const DOCS_ROOT = path.resolve(process.cwd(), 'site')
const GENERATED_ROOT = path.join(DOCS_ROOT, '.vitepress', 'generated')
const SIDEBAR_OUTPUT = path.join(GENERATED_ROOT, 'sidebar.ts')
const CATALOG_OUTPUT = path.join(GENERATED_ROOT, 'catalog.json')
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

function normalizePath(filePath) {
  return filePath.split(path.sep).join('/')
}

function markdownToRoute(relativePath) {
  const normalized = normalizePath(relativePath).replace(/\.md$/i, '')
  let route = `/${normalized}`
  route = route.replace(/\/index$/, '/')
  if (route !== '/' && route.endsWith('/')) {
    route = route.slice(0, -1)
  }
  return route
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

function compareNotes(left, right) {
  const leftOrder = typeof left.order === 'number' ? left.order : Number.POSITIVE_INFINITY
  const rightOrder = typeof right.order === 'number' ? right.order : Number.POSITIVE_INFINITY

  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder
  }

  if (left.date && right.date && left.date !== right.date) {
    return left.date < right.date ? 1 : -1
  }

  if (left.date && !right.date) {
    return -1
  }

  if (!left.date && right.date) {
    return 1
  }

  return left.slug.localeCompare(right.slug, 'en')
}

function formatSegment(segment) {
  const dictionary = {
    concurrency: '并发'
  }

  const direct = dictionary[segment.toLowerCase()]
  if (direct) {
    return direct
  }

  return segment
    .split(/[-_]/g)
    .filter(Boolean)
    .map((word) => `${word[0]?.toUpperCase() ?? ''}${word.slice(1)}`)
    .join(' ')
}

function formatSectionLabel(relativeDirectory) {
  return relativeDirectory.split('/').map(formatSegment).join(' / ')
}

function buildSidebar(notes) {
  const byCategory = new Map()
  for (const note of notes) {
    if (!byCategory.has(note.category)) {
      byCategory.set(note.category, [])
    }
    byCategory.get(note.category).push(note)
  }

  const sidebar = {}

  for (const category of [...byCategory.keys()].sort((left, right) => left.localeCompare(right, 'en'))) {
    const notesInCategory = byCategory.get(category).slice().sort(compareNotes)
    const topLevelItems = []
    const groupedSections = new Map()

    for (const note of notesInCategory) {
      const directory = path.posix.dirname(note.slug)
      if (directory === category) {
        topLevelItems.push({ text: note.title, link: note.path })
        continue
      }

      const relativeDirectory = directory.slice(category.length + 1)
      if (!groupedSections.has(relativeDirectory)) {
        groupedSections.set(relativeDirectory, [])
      }
      groupedSections.get(relativeDirectory).push(note)
    }

    const sectionItems = [...groupedSections.entries()]
      .sort(([left], [right]) => left.localeCompare(right, 'en'))
      .map(([relativeDirectory, sectionNotes]) => ({
        text: formatSectionLabel(relativeDirectory),
        collapsed: false,
        items: sectionNotes.sort(compareNotes).map((note) => ({ text: note.title, link: note.path }))
      }))

    const combined = [...topLevelItems, ...sectionItems]
    if (combined.length > 0) {
      sidebar[`/${category}/`] = combined
    }
  }

  return sidebar
}

function buildSidebarModule(sidebar) {
  return `import type { DefaultTheme } from 'vitepress'

const sidebar: DefaultTheme.Config['sidebar'] = ${JSON.stringify(sidebar, null, 2)}

export default sidebar
`
}

async function main() {
  const markdownFiles = await fg(['**/*.md', '!index.md', '!.vitepress/**'], {
    cwd: DOCS_ROOT,
    onlyFiles: true
  })

  const warnings = []
  const errors = []
  const notes = []
  const routeToSource = new Map()

  for (const relativePath of markdownFiles) {
    const absolutePath = path.join(DOCS_ROOT, relativePath)
    const source = await fs.readFile(absolutePath, 'utf8')
    const { data } = matter(source)

    if (typeof data.title !== 'string' || data.title.trim() === '') {
      errors.push(`[${relativePath}] frontmatter \`title\` is required and must be a non-empty string.`)
      continue
    }

    const normalizedDate = data.date !== undefined ? normalizeDateInput(data.date) : undefined
    if (data.date !== undefined && !normalizedDate) {
      errors.push(`[${relativePath}] frontmatter \`date\` must be a string in YYYY-MM-DD format.`)
      continue
    }

    if (data.tags !== undefined) {
      const tagsValid = Array.isArray(data.tags) && data.tags.every((item) => typeof item === 'string' && item.trim() !== '')
      if (!tagsValid) {
        errors.push(`[${relativePath}] frontmatter \`tags\` must be an array of non-empty strings.`)
        continue
      }
    }

    if (data.summary !== undefined && typeof data.summary !== 'string') {
      errors.push(`[${relativePath}] frontmatter \`summary\` must be a string.`)
      continue
    }

    if (data.draft !== undefined && typeof data.draft !== 'boolean') {
      errors.push(`[${relativePath}] frontmatter \`draft\` must be a boolean.`)
      continue
    }

    if (data.order !== undefined && (typeof data.order !== 'number' || !Number.isFinite(data.order))) {
      errors.push(`[${relativePath}] frontmatter \`order\` must be a finite number.`)
      continue
    }

    if (data.draft === true) {
      continue
    }

    const slug = normalizePath(relativePath).replace(/\.md$/i, '')
    const category = slug.split('/')[0]
    if (!category) {
      errors.push(`[${relativePath}] cannot infer top-level category from file path.`)
      continue
    }

    const route = markdownToRoute(relativePath)
    if (routeToSource.has(route)) {
      errors.push(`[${relativePath}] route conflict: "${route}" already used by "${routeToSource.get(route)}".`)
      continue
    }
    routeToSource.set(route, relativePath)

    let validDate
    if (typeof normalizedDate === 'string') {
      if (isIsoDate(normalizedDate)) {
        validDate = normalizedDate
      } else {
        warnings.push(
          `[${relativePath}] frontmatter \`date\` "${normalizedDate}" is not a strict ISO date (YYYY-MM-DD) and will be ignored in date-based sorting.`
        )
      }
    }

    notes.push({
      title: data.title.trim(),
      path: route,
      category,
      date: validDate,
      tags: Array.isArray(data.tags) ? data.tags : undefined,
      summary: typeof data.summary === 'string' ? data.summary : undefined,
      order: typeof data.order === 'number' ? data.order : undefined,
      slug
    })
  }

  for (const warning of warnings) {
    console.warn(`WARN  ${warning}`)
  }

  if (errors.length > 0) {
    console.error('\nContent generation failed:\n')
    for (const error of errors) {
      console.error(`ERROR ${error}`)
    }
    process.exitCode = 1
    return
  }

  const sidebar = buildSidebar(notes)
  const catalog = notes
    .slice()
    .sort((left, right) => {
      const categoryCompare = left.category.localeCompare(right.category, 'en')
      if (categoryCompare !== 0) {
        return categoryCompare
      }
      return compareNotes(left, right)
    })
    .map(({ slug: _slug, ...note }) => note)

  await fs.mkdir(GENERATED_ROOT, { recursive: true })
  await fs.writeFile(SIDEBAR_OUTPUT, buildSidebarModule(sidebar), 'utf8')
  await fs.writeFile(
    CATALOG_OUTPUT,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        items: catalog
      },
      null,
      2
    )}\n`,
    'utf8'
  )

  console.log(`Generated sidebar and catalog for ${catalog.length} note(s).`)
}

main().catch((error) => {
  console.error('Unexpected error during content generation:')
  console.error(error)
  process.exitCode = 1
})
