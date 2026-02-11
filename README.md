# 学习笔记静态站（VitePress）

一个基于 Markdown 的学习记录静态站，按目录分类并编译为 HTML 页面。

## 技术栈

- VitePress
- gray-matter（解析 Frontmatter）
- fast-glob（扫描内容文件）
- Mermaid（流程图渲染）

## 目录结构

```text
.
├─ scripts/
│  ├─ generate-content.mjs
│  └─ validate-frontmatter.mjs
├─ site/
│  ├─ .vitepress/
│  │  ├─ config.ts
│  │  ├─ generated/
│  │  │  ├─ sidebar.ts
│  │  │  └─ catalog.json
│  │  └─ theme/
│  ├─ ai/
│  ├─ go/
│  ├─ web/
│  └─ index.md
└─ .github/workflows/deploy.yml
```

## Frontmatter 约定

```yaml
---
title: 必填，字符串
date: 可选，字符串（YYYY-MM-DD）
tags: 可选，字符串数组
summary: 可选，字符串
draft: 可选，布尔值
order: 可选，数字
---
```

`draft: true` 的笔记不会进入自动生成的侧边栏和目录索引。

## 常用命令

- `npm run content:check`：校验所有 md 的 Frontmatter。
- `npm run content:gen`：生成 `sidebar.ts` 与 `catalog.json`。
- `npm run docs:dev`：生成内容并启动本地开发服务。
- `npm run docs:build`：校验 + 生成 + 构建静态站。
- `npm run docs:preview`：本地预览构建结果。

## 新增笔记

1. 在 `site/<category>/.../*.md` 下新建文件。
2. 至少补齐 `title` Frontmatter。
3. 执行 `npm run content:gen`。
4. 执行 `npm run docs:dev` 或 `npm run docs:build`。

路由按目录自动映射，例如：

- `site/go/basic-types.md` -> `/go/basic-types/`
- `site/go/concurrency/goroutine.md` -> `/go/concurrency/goroutine/`

## GitHub Pages 部署

`.github/workflows/deploy.yml` 会在推送 `main` 分支时自动构建并部署。

仓库设置检查项：

1. 进入 `Settings -> Pages`。
2. Source 选择 `GitHub Actions`。
3. 推送代码到 `main` 分支。
