import type { DefaultTheme } from 'vitepress'

const sidebar: DefaultTheme.Config['sidebar'] = {
  "/kafka/": [
    {
      "text": "Kafka 概览",
      "link": "/kafka/overview"
    },
    {
      "text": "Topic / Partition / Offset 模型",
      "link": "/kafka/topic-partition"
    },
    {
      "text": "Producer 基础",
      "link": "/kafka/producer-basics"
    },
    {
      "text": "Consumer Group 基础",
      "link": "/kafka/consumer-group"
    },
    {
      "text": "副本机制与 ISR",
      "link": "/kafka/replication-isr"
    },
    {
      "text": "消息投递语义",
      "link": "/kafka/delivery-semantics"
    },
    {
      "text": "顺序性与分区键设计",
      "link": "/kafka/ordering-and-key"
    },
    {
      "text": "性能调优实战",
      "link": "/kafka/performance-tuning"
    },
    {
      "text": "运维与监控清单",
      "link": "/kafka/operations-and-monitoring"
    },
    {
      "text": "常见坑位与排查思路",
      "link": "/kafka/common-pitfalls"
    },
    {
      "text": "事务与 EOS 边界",
      "link": "/kafka/transactions-and-eos-boundary"
    },
    {
      "text": "Rebalance 优化",
      "link": "/kafka/rebalance-optimization"
    },
    {
      "text": "多租户隔离设计",
      "link": "/kafka/multi-tenant-isolation"
    },
    {
      "text": "容量规划方法",
      "link": "/kafka/capacity-planning"
    },
    {
      "text": "实战案例：下单事件链路",
      "link": "/kafka/order-pipeline-case"
    },
    {
      "text": "实战案例：库存扣减链路",
      "link": "/kafka/inventory-deduction-case"
    },
    {
      "text": "实战案例：延迟重试与死信队列",
      "link": "/kafka/delay-retry-and-dlq-case"
    },
    {
      "text": "实战案例：消息回放与补数",
      "link": "/kafka/replay-and-backfill-case"
    },
    {
      "text": "实战案例：迁移与切流",
      "link": "/kafka/migration-and-cutover-case"
    }
  ]
}

export default sidebar
