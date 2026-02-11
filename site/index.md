---
layout: home

hero:
  name: 学习笔记
  text: Markdown 输入，静态网站输出
  tagline: 按文件夹分类管理内容，一键编译为可检索的静态站点。
  actions:
    - theme: brand
      text: 从 Go 开始
      link: /go/basic-types/
    - theme: alt
      text: 浏览 Web 笔记
      link: /web/http-basics/

features:
  - title: 目录即分类
    details: 以一级目录作为分类，同时映射为页面路由前缀。
  - title: 元数据校验
    details: 构建前会校验 Frontmatter，避免错误内容上线。
  - title: 自动部署
    details: 推送到 main 分支后自动发布到 GitHub Pages。
---

## 笔记目录

<CatalogHome />
