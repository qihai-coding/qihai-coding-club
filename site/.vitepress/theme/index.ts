import DefaultTheme from 'vitepress/theme'
import { inBrowser } from 'vitepress'
import type { Theme } from 'vitepress'
import mermaid from 'mermaid'

import CatalogHome from './components/CatalogHome.vue'
import './custom.css'

let mermaidInitialized = false

function renderMermaid() {
  if (!inBrowser) {
    return
  }

  if (!mermaidInitialized) {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose'
    })
    mermaidInitialized = true
  }

  const wrappers = document.querySelectorAll<HTMLElement>('div.language-mermaid')
  for (const wrapper of wrappers) {
    const code = wrapper.querySelector('pre code')
    if (!code) {
      continue
    }

    const container = document.createElement('div')
    container.className = 'mermaid'
    container.textContent = code.textContent ?? ''
    wrapper.replaceWith(container)
  }

  const rawBlocks = document.querySelectorAll<HTMLElement>('pre code.language-mermaid')
  for (const code of rawBlocks) {
    const pre = code.parentElement
    if (!pre) {
      continue
    }
    const container = document.createElement('div')
    container.className = 'mermaid'
    container.textContent = code.textContent ?? ''
    pre.replaceWith(container)
  }

  mermaid.run({ querySelector: '.mermaid:not([data-processed])' }).catch((error: unknown) => {
    console.warn('[mermaid] failed to render diagrams', error)
  })
}

const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app, router }) {
    app.component('CatalogHome', CatalogHome)

    if (!inBrowser) {
      return
    }

    router.onAfterRouteChanged = () => {
      requestAnimationFrame(() => {
        renderMermaid()
      })
    }

    requestAnimationFrame(() => {
      renderMermaid()
    })
  }
}

export default theme
