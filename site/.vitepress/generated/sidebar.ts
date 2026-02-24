import type { DefaultTheme } from 'vitepress'

const sidebar: DefaultTheme.Config['sidebar'] = {
  "/kafka/": [
    {
      "text": "01 基础篇",
      "collapsed": false,
      "items": [
        {
          "text": "Kafka 概览",
          "link": "/kafka/01-foundation/overview"
        },
        {
          "text": "Topic / Partition / Offset 模型",
          "link": "/kafka/01-foundation/topic-partition"
        },
        {
          "text": "Producer 基础",
          "link": "/kafka/01-foundation/producer-basics"
        },
        {
          "text": "Consumer Group 基础",
          "link": "/kafka/01-foundation/consumer-group"
        },
        {
          "text": "副本机制与 ISR",
          "link": "/kafka/01-foundation/replication-isr"
        },
        {
          "text": "消息投递语义",
          "link": "/kafka/01-foundation/delivery-semantics"
        }
      ]
    },
    {
      "text": "02 进阶篇",
      "collapsed": false,
      "items": [
        {
          "text": "顺序性与分区键设计",
          "link": "/kafka/02-advanced/ordering-and-key"
        },
        {
          "text": "性能调优实战",
          "link": "/kafka/02-advanced/performance-tuning"
        },
        {
          "text": "运维与监控清单",
          "link": "/kafka/02-advanced/operations-and-monitoring"
        },
        {
          "text": "常见坑位与排查思路",
          "link": "/kafka/02-advanced/common-pitfalls"
        }
      ]
    },
    {
      "text": "03 工程篇",
      "collapsed": false,
      "items": [
        {
          "text": "事务与 EOS 边界",
          "link": "/kafka/03-engineering/transactions-and-eos-boundary"
        },
        {
          "text": "Rebalance 优化",
          "link": "/kafka/03-engineering/rebalance-optimization"
        },
        {
          "text": "多租户隔离设计",
          "link": "/kafka/03-engineering/multi-tenant-isolation"
        },
        {
          "text": "容量规划方法",
          "link": "/kafka/03-engineering/capacity-planning"
        }
      ]
    },
    {
      "text": "04 实战篇",
      "collapsed": false,
      "items": [
        {
          "text": "实战案例：下单事件链路",
          "link": "/kafka/04-cases/order-pipeline-case"
        },
        {
          "text": "实战案例：库存扣减链路",
          "link": "/kafka/04-cases/inventory-deduction-case"
        },
        {
          "text": "实战案例：延迟重试与死信队列",
          "link": "/kafka/04-cases/delay-retry-and-dlq-case"
        },
        {
          "text": "实战案例：消息回放与补数",
          "link": "/kafka/04-cases/replay-and-backfill-case"
        },
        {
          "text": "实战案例：迁移与切流",
          "link": "/kafka/04-cases/migration-and-cutover-case"
        }
      ]
    }
  ]
}

export default sidebar
