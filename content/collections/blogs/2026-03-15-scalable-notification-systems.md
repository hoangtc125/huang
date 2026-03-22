---
title: "Thiết kế hệ thống thông báo chịu tải hàng triệu tin nhắn mỗi ngày"
slug: "scalable-notification-systems"
description: "Phân tích kiến trúc để xây dựng notification system có thể xử lý hàng triệu messages/ngày — từ message queue, delivery guarantees, đến retry mechanism và dead letter queues."
cover: "/images/blog/notification-system.jpg"
topic: "system-design"
tags:
  - "System Design"
  - "Kafka"
  - "Architecture"
  - "Backend"
related_projects: []
related_blogs:
  - "xin-chao-the-gioi"
published: true
featured: false
date: "2026-03-15"
reading_time: 9
---

# Thiết kế hệ thống thông báo chịu tải hàng triệu tin nhắn mỗi ngày

Notification system là một trong những bài toán kinh điển trong system design. Nghe đơn giản — "gửi thông báo cho user" — nhưng khi scale lên hàng triệu users, mọi thứ trở nên phức tạp hơn rất nhiều.

## Yêu cầu bài toán

**Functional requirements:**
- Gửi thông báo qua nhiều kênh: push notification (iOS/Android), email, SMS, in-app
- Hỗ trợ scheduled notifications
- Đảm bảo delivery (at-least-once guarantee)

**Non-functional requirements:**
- Throughput: 1 triệu messages/ngày (~11.5 messages/giây trung bình, peak có thể 10x)
- Latency: notification đến tay user trong vòng 5 giây kể từ event
- Availability: 99.9% uptime

## Kiến trúc tổng quan

```
                    ┌─────────────────┐
                    │   API Services  │  (user registration, preferences)
                    └────────┬────────┘
                             │ publish event
                    ┌────────▼────────┐
                    │   Kafka Topic   │  (notification.events)
                    └────────┬────────┘
                             │ consume
              ┌──────────────┼──────────────┐
              │              │              │
    ┌─────────▼──┐  ┌────────▼──┐  ┌───────▼───┐
    │Push Worker │  │Email Wrkr │  │ SMS Worker │
    └─────────┬──┘  └────────┬──┘  └───────┬───┘
              │              │              │
    ┌─────────▼──┐  ┌────────▼──┐  ┌───────▼───┐
    │APNs / FCM  │  │ SendGrid  │  │  Twilio   │
    └────────────┘  └───────────┘  └───────────┘
```

## Lựa chọn Message Queue: Kafka vs. RabbitMQ vs. SQS

Đây là quyết định kiến trúc quan trọng nhất.

### Kafka
- **Pros**: Throughput cực cao (millions messages/sec), retention lâu dài, consumer groups, replay capability
- **Cons**: Phức tạp hơn để vận hành, không có message-level ACK tự động

### RabbitMQ
- **Pros**: Dễ setup, message-level ACK, flexible routing (fanout, topic, direct)
- **Cons**: Throughput thấp hơn Kafka, không có retention lâu

### Quyết định
Với yêu cầu 1M messages/ngày và cần replay capability (gửi lại notification khi provider down), **Kafka** là lựa chọn phù hợp hơn.

## Delivery Guarantees

Một trong những thách thức lớn nhất: đảm bảo notification được gửi đến user dù provider có lỗi.

### At-least-once Delivery

```python
def process_notification(message):
    try:
        send_to_provider(message)
        # CHỈ commit offset sau khi gửi thành công
        consumer.commit()
    except ProviderError as e:
        # Không commit — message sẽ được retry
        log.error(f"Failed to send: {e}")
        raise
```

Với Kafka, chỉ commit consumer offset sau khi gửi thành công. Nếu worker crash giữa chừng, Kafka sẽ deliver lại message từ offset chưa commit.

### Idempotency

At-least-once nghĩa là user có thể nhận notification 2 lần trong trường hợp lỗi. Để tránh điều này, cần idempotency key:

```sql
CREATE TABLE notification_sent (
    notification_id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    channel VARCHAR(20) NOT NULL,
    sent_at TIMESTAMP NOT NULL
);
```

Trước khi gửi, kiểm tra xem notification đã được gửi chưa. Nếu rồi, skip.

## Retry Mechanism với Exponential Backoff

Provider APIs (APNs, SendGrid...) có thể bị rate limit hoặc tạm thời không available. Retry ngay lập tức sẽ làm vấn đề tệ hơn.

```typescript
async function sendWithRetry(
  notification: Notification,
  maxAttempts = 5
): Promise<void> {
  let attempt = 0;

  while (attempt < maxAttempts) {
    try {
      await provider.send(notification);
      return; // Success!
    } catch (err) {
      if (!isRetryable(err)) throw err; // Permanent error — don't retry

      attempt++;
      if (attempt === maxAttempts) throw err;

      const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s, 16s...
      const jitter = Math.random() * 1000; // Tránh thundering herd
      await sleep(delay + jitter);
    }
  }
}
```

## Dead Letter Queue (DLQ)

Sau khi hết số lần retry, messages thất bại được đưa vào Dead Letter Queue để xử lý thủ công:

```
Normal Queue → [retry 1] → [retry 2] → [retry 5] → Dead Letter Queue
                                                           │
                                                    ┌──────▼──────┐
                                                    │ Alert team  │
                                                    │ Manual fix  │
                                                    │ Replay      │
                                                    └─────────────┘
```

Team nhận alert, điều tra nguyên nhân, sửa, rồi replay messages từ DLQ.

## User Preference và Rate Limiting

Không phải user nào cũng muốn nhận mọi loại notification. Cần lưu preferences và enforce chúng:

```typescript
interface NotificationPreference {
  userId: string;
  channel: "push" | "email" | "sms";
  category: "marketing" | "transactional" | "social";
  enabled: boolean;
  quietHours?: { start: number; end: number }; // 22:00 - 08:00
}
```

Rate limiting cũng quan trọng: không spam user. Ví dụ: tối đa 10 push notifications/ngày cho marketing category.

## Bài học rút ra

1. **Start simple**: Bắt đầu với một queue đơn giản, scale khi cần
2. **Observe everything**: Log mọi event (sent, failed, retried) để debug
3. **Test failure scenarios**: Simulate provider failures trong staging trước khi đưa lên prod
4. **User control**: Cho user quyền kiểm soát notification preferences — đây là UX tốt và giảm unsubscribe rate

Notification system tưởng đơn giản nhưng ẩn chứa nhiều edge case thú vị. Nếu bạn đang thiết kế một hệ thống tương tự, hy vọng bài viết này có ích.
