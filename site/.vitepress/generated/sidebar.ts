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
    }
  ]
}

export default sidebar
