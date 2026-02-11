---
title: Goroutine 入门
date: 2026-02-03
tags:
  - go
  - concurrency
summary: 理解 goroutine 与 channel 如何协同执行任务。
order: 1
---

# Goroutine 入门

## 最小示例

```go
func worker(out chan<- string) {
    out <- "done"
}

func main() {
    out := make(chan string)
    go worker(out)
    msg := <-out
    fmt.Println(msg)
}
```

## 执行流程

```mermaid
flowchart LR
    A[main 创建 channel] --> B[启动 worker goroutine]
    B --> C[worker 发送结果]
    C --> D[main 接收结果]
    D --> E[程序退出]
```
