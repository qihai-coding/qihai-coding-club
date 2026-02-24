<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'

import catalogData from '../../generated/catalog.json'

interface CatalogItem {
  title: string
  path: string
  category: string
  date?: string
  tags?: string[]
  summary?: string
  order?: number
}

const notes = ((catalogData as { items?: CatalogItem[] }).items ?? []) as CatalogItem[]

function formatCategory(value: string): string {
  const dictionary: Record<string, string> = {
    ai: 'AI',
    go: 'Go',
    web: 'Web',
    kafka: 'Kafka'
  }

  if (dictionary[value]) {
    return dictionary[value]
  }

  return value
    .split(/[-_/]/g)
    .filter(Boolean)
    .map((segment) => segment)
    .join(' / ')
}

function compareItems(left: CatalogItem, right: CatalogItem): number {
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

  return left.title.localeCompare(right.title, 'en')
}

const categoryGroups = computed(() => {
  const grouped = new Map<string, CatalogItem[]>()
  for (const note of notes) {
    if (!grouped.has(note.category)) {
      grouped.set(note.category, [])
    }
    grouped.get(note.category)?.push(note)
  }

  return [...grouped.entries()]
    .sort(([left], [right]) => left.localeCompare(right, 'zh-Hans-CN'))
    .map(([category, items]) => ({
      category,
      items: items.slice().sort(compareItems).slice(0, 10)
    }))
})

const recentNotes = computed(() => {
  return notes
    .filter((item) => typeof item.date === 'string')
    .slice()
    .sort((left, right) => {
      const leftDate = left.date ?? ''
      const rightDate = right.date ?? ''
      if (leftDate === rightDate) {
        return left.title.localeCompare(right.title, 'zh-Hans-CN')
      }
      return leftDate < rightDate ? 1 : -1
    })
    .slice(0, 8)
})
</script>

<template>
  <section class="catalog-home">
    <div class="catalog-grid">
      <article v-for="group in categoryGroups" :key="group.category" class="catalog-card">
        <h3>{{ formatCategory(group.category) }}</h3>
        <ul>
          <li v-for="note in group.items" :key="note.path">
            <a :href="withBase(note.path)">{{ note.title }}</a>
            <small v-if="note.date">{{ note.date }}</small>
          </li>
        </ul>
      </article>
    </div>

    <section v-if="recentNotes.length > 0" class="catalog-recent">
      <h3>最近更新</h3>
      <ul>
        <li v-for="note in recentNotes" :key="note.path">
          <a :href="withBase(note.path)">{{ note.title }}</a>
          <small>{{ note.date }}</small>
        </li>
      </ul>
    </section>
  </section>
</template>
