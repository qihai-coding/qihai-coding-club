import { defineConfig } from 'vitepress'

import sidebar from './generated/sidebar'

const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {}
const repositoryName = env.GITHUB_REPOSITORY?.split('/')[1] ?? ''
const isGitHubActions = env.GITHUB_ACTIONS === 'true'
const isUserOrOrgSite = repositoryName.endsWith('.github.io')

const base = isGitHubActions && repositoryName && !isUserOrOrgSite ? `/${repositoryName}/` : '/'

export default defineConfig({
  lang: 'zh-CN',
  title: '学习笔记',
  description: '按目录组织 Markdown 学习内容并编译为静态网页。',
  cleanUrls: true,
  base,
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: 'Kafka 笔记', link: '/kafka/overview' }
    ],
    sidebar,
    outlineTitle: '本页目录',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
    darkModeSwitchLabel: '切换主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索',
            buttonAriaLabel: '搜索'
          },
          modal: {
            noResultsText: '未找到相关结果',
            resetButtonTitle: '清空查询',
            displayDetails: '显示详情',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    },
    outline: {
      level: [2, 3]
    }
  },
  markdown: {
    lineNumbers: true,
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  }
})
