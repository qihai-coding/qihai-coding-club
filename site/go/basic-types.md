---
title: Go 基础类型
date: 2026-02-01
tags:
  - go
  - basics
summary: 内置类型、零值与声明方式的速查笔记。
order: 1
---

# Go 基础类型

## 数值类型

- 常见类型有 `int`、`int64`、`float64`、`complex128`。
- `rune` 常用于 Unicode 码点，`byte` 常用于原始字节。

## 字符串

- 字符串是不可变的 UTF-8 字节序列。
- 需要按“字符”处理时，用 `[]rune`。

## 零值

- 数值类型默认是 `0`。
- `bool` 默认是 `false`。
- `string` 默认是 `""`。
- 指针、切片、映射、通道、接口默认是 `nil`。
