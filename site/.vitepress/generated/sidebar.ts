import type { DefaultTheme } from 'vitepress'

const sidebar: DefaultTheme.Config['sidebar'] = {
  "/ai/": [
    {
      "text": "LLM 概览",
      "link": "/ai/llm-overview/"
    }
  ],
  "/go/": [
    {
      "text": "Go 基础类型",
      "link": "/go/basic-types/"
    },
    {
      "text": "并发",
      "collapsed": false,
      "items": [
        {
          "text": "Goroutine 入门",
          "link": "/go/concurrency/goroutine/"
        }
      ]
    }
  ],
  "/web/": [
    {
      "text": "HTTP 基础",
      "link": "/web/http-basics/"
    }
  ]
}

export default sidebar
