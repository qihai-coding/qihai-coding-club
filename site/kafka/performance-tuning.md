---
title: 性能调优实战
date: 2026-02-24
tags:
  - kafka
  - performance
summary: 围绕吞吐、延迟与稳定性目标，给出 Producer、Consumer、Broker 的调优抓手。
order: 8
---

# 性能调优实战

## 先定目标再调参

调优前先定义目标:

- 吞吐优先: 每秒消息量、带宽利用率。
- 延迟优先: 端到端 P95/P99。
- 稳定性优先: 堆积控制、重试率、可恢复性。

不同目标需要不同参数组合，不存在“万能最优值”。

## Producer 侧

高吞吐常见抓手:

- 增大 `batch.size`
- 适度增加 `linger.ms`
- 启用压缩（`snappy`/`lz4`）

高可靠基线:

- `acks=all`
- `enable.idempotence=true`
- 避免把 `retries` 调得过小

## Consumer 侧

消费者调优核心在“拉取与处理平衡”:

- `max.poll.records`: 控制单批处理量
- `fetch.min.bytes` 与 `fetch.max.wait.ms`: 影响拉取粒度与等待
- `max.poll.interval.ms`: 给业务处理留足窗口

若消费端慢于生产端，任何客户端调参都无法从根本消除堆积。

## Broker 侧关键面

- 磁盘: 顺序写快，但随机 I/O、磁盘满会快速恶化延迟。
- 网络: 大流量下网卡与跨机房 RTT 抖动明显影响复制与消费。
- 分区数: 过少限制并行，过多增加元数据和调度开销。

```mermaid
flowchart LR
    P[Producer Batch/Compress] --> B[Broker Disk & Network]
    B --> C[Consumer Fetch/Process]
    C --> O[Offset Commit]
```

## 观测优先级

1. 端到端延迟（生产到消费完成）。
2. Consumer Lag（是否持续增长）。
3. 请求错误率、重试率、超时率。
4. Broker 资源指标（CPU、磁盘、网络）。

## 调优流程建议

1. 固定压测流量模型。
2. 每次只改一组参数，记录前后指标。
3. 对比吞吐与延迟，选择符合业务目标的配置。
4. 在接近线上规模下做回归压测，再发布。

