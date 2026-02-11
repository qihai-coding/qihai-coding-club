import DefaultTheme from 'vitepress/theme'
import { inBrowser } from 'vitepress'
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

  const blocks = document.querySelectorAll<HTMLElement>('pre code.language-mermaid')
  for (const code of blocks) {
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

export default {
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
