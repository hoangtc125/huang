export const entry = {
  "file": "tech-stack.md",
  "data": {
    "question": "Tech stack chính của bạn là gì?",
    "slug": "tech-stack",
    "category": "technical",
    "tags": [
      "tech",
      "stack"
    ],
    "published": true,
    "featured": true,
    "order": 2,
    "date": "2026-03-18"
  },
  "content": "Tôi làm việc chủ yếu với JavaScript/TypeScript ecosystem.\n\n**Frontend**: React, Next.js (App Router), Tailwind CSS. Tôi quan tâm nhiều đến performance và UX — Server Components, code splitting, và animation có chủ đích.\n\n**Mobile**: React Native + Expo. Cross-platform nhưng native feel.\n\n**Backend**: Node.js với Express hoặc Fastify. Với database: PostgreSQL cho relational data, Redis cho caching và real-time features, Firebase khi cần quick prototyping.\n\n**Tools**: TypeScript everywhere, Git, Docker cho local dev, Vercel/Railway cho deployment.\n\nTôi chọn tools dựa trên bài toán — không phải hype. Và tôi đủ linh hoạt để học thêm khi dự án cần."
} as const;
export default entry;
