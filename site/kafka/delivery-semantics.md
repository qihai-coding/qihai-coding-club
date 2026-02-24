---
title: 消息投递语义
date: 2026-02-24
tags:
  - kafka
  - semantics
summary: 理解 at-most-once、at-least-once、exactly-once 的实现方式与边界。
order: 6
---

# 消息投递语义

## 三种语义

- `at-most-once`: 最多一次，可能丢，不重复。
- `at-least-once`: 至少一次，可能重复，不轻易丢。
- `exactly-once`: 恰好一次，既不丢也不重（在明确边界内）。

## 消费端提交时机决定语义

简化理解:

- 先提交后处理 -> 崩溃后可能丢消息（偏向 at-most-once）。
- 先处理后提交 -> 崩溃后可能重复消费（偏向 at-least-once）。

```mermaid
flowchart LR
    A[Poll Messages] --> B[Process Business]
    B --> C[Commit Offset]
    C --> D[Next Poll]
```

## Exactly-Once（EOS）要点

Kafka 的 EOS 一般依赖:

- 生产者幂等（`enable.idempotence=true`）
- 事务写入（transactional producer）
- 消费端使用 `read_committed`（读取已提交事务）

注意边界:

- EOS 常见是“Kafka 内链路”或“消费-处理-回写 Kafka”链路的 exactly-once。
- 涉及外部数据库时，仍需要业务层幂等键/去重策略。

## 工程建议

1. 默认以 at-least-once 为基线，并实现业务幂等。
2. 需要 EOS 时先明确边界，再上事务与读隔离配置。
3. 出现重复时优先保障可恢复性，不要为了“绝不重复”牺牲可用性。

