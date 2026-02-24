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

  // VitePress + Shiki renders fenced mermaid blocks as:
  // <div class="language-mermaid"> ... <pre><code>...</code></pre> ... </div>
  // so we convert the whole wrapper instead of only <pre>.
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

  // Fallback for any non-Shiki markdown pipeline.
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
