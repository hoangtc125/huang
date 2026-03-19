import { Project, QA, Video, BlogPost } from './types';

export const projects: Project[] = [
  {
    id: 'everminute',
    title: 'EverMinute',
    type: 'app',
    shortDesc: 'So no minute is wasted. A simple, focused app to set and review your time spent on each task.',
    longDesc: 'A simple, focused app to set and review your time spent on each task throughout the day. EverMinute tracks every task you set and puts them in a calendar so you can see exactly where your time goes.',
    imageUrl: 'https://picsum.photos/seed/everminute/800/450',
    iconUrl: 'https://picsum.photos/seed/everminute-icon/128/128',
    link: 'https://apps.apple.com/app/everminute',
    status: 'Waiting for review from Apple',
    features: [
      { title: 'Visualize your day', desc: 'Tasks logged to a calendar so you see exactly where your time goes.' },
      { title: 'Common tasks, one tap', desc: 'Save frequent tasks to check in instantly, no typing needed.' },
      { title: 'Ever watches over you', desc: 'Your mascot bounces while you focus, even when the app is closed.' }
    ],
    architecture: 'Built with React Native for cross-platform compatibility. Uses SQLite for local, privacy-first data storage. The backend sync is handled via Firebase when the user opts-in. The mascot animation is driven by Reanimated for 60fps smooth performance.',
    techStack: ['React Native', 'Expo', 'SQLite', 'Reanimated', 'Zustand'],
    screenshots: [
      'https://picsum.photos/seed/em-sc1/400/800',
      'https://picsum.photos/seed/em-sc2/400/800',
      'https://picsum.photos/seed/em-sc3/400/800'
    ]
  },
  {
    id: 'dev-tools-pro',
    title: 'DevTools Pro',
    type: 'extension',
    shortDesc: 'A suite of essential tools for web developers right in your browser.',
    longDesc: 'DevTools Pro is a browser extension that bundles the most common tools developers need daily: JSON formatter, Base64 encoder/decoder, JWT inspector, and color picker, all accessible via a quick popup.',
    imageUrl: 'https://picsum.photos/seed/devtools/800/450',
    iconUrl: 'https://picsum.photos/seed/devtools-icon/128/128',
    link: 'https://chrome.google.com/webstore/detail/devtools-pro',
    status: 'Published',
    features: [
      { title: 'Instant JSON Formatting', desc: 'Paste raw JSON and get it beautifully formatted and syntax-highlighted.' },
      { title: 'JWT Decoder', desc: 'Quickly inspect the payload of any JWT without sending it to a third-party server.' },
      { title: 'Color Picker', desc: 'Grab colors from any webpage with a built-in eyedropper tool.' }
    ],
    architecture: 'Developed using the Manifest V3 API. The UI is built with Preact for a tiny footprint and fast load times. Uses a background service worker to handle state across tabs.',
    techStack: ['TypeScript', 'Preact', 'Tailwind CSS', 'Manifest V3'],
    screenshots: [
      'https://picsum.photos/seed/dt-sc1/800/600',
      'https://picsum.photos/seed/dt-sc2/800/600'
    ]
  },
  {
    id: 'huang-workspace',
    title: 'Huang Workspace',
    type: 'web',
    shortDesc: 'My personal portfolio and digital garden.',
    longDesc: 'The site you are currently browsing. It serves as a central hub for my projects, thoughts, and professional identity. Designed with a minimalist, dark-themed aesthetic.',
    imageUrl: 'https://picsum.photos/seed/workspace/800/450',
    iconUrl: 'https://picsum.photos/seed/workspace-icon/128/128',
    link: 'https://huangwork.space',
    status: 'Live',
    features: [
      { title: 'Universal View', desc: 'A clean, dark-themed interface inspired by modern developer tools.' },
      { title: 'Project Showcase', desc: 'Detailed breakdowns of my work, including architecture and features.' },
      { title: 'Responsive Design', desc: 'Looks great on desktop, tablet, and mobile devices.' }
    ],
    architecture: 'Built with Next.js and Tailwind CSS. Uses the App Router for server-side rendering and Framer Motion for smooth page transitions and element reveals.',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    screenshots: [
      'https://picsum.photos/seed/hw-sc1/1200/800',
      'https://picsum.photos/seed/hw-sc2/1200/800'
    ]
  }
];

export const videos: Video[] = [
  {
    id: 'react-performance-masterclass',
    title: 'Mastering React Performance in 2026',
    description: 'A deep dive into advanced techniques for identifying and fixing performance bottlenecks in large-scale React applications. We cover concurrent rendering, memoization strategies, and the new React Compiler.',
    thumbnailUrl: 'https://picsum.photos/seed/vid-react/800/450',
    videoUrl: 'https://youtube.com',
    duration: '45:20',
    publishedAt: 'Mar 12, 2026',
    views: '12.5K'
  },
  {
    id: 'building-scalable-backends',
    title: 'Building Scalable Backends with Go & Redis',
    description: 'Learn how to architect high-throughput backend services. This tutorial walks through building a notification system capable of handling millions of messages per day using Go routines and Redis streams.',
    thumbnailUrl: 'https://picsum.photos/seed/vid-go/800/450',
    videoUrl: 'https://youtube.com',
    duration: '32:15',
    publishedAt: 'Feb 28, 2026',
    views: '8.2K'
  },
  {
    id: 'tailwind-css-best-practices',
    title: 'Tailwind CSS: From Messy to Maintainable',
    description: 'Stop writing spaghetti utility classes. Discover patterns and tools (like tailwind-merge and cva) to keep your Tailwind CSS clean, reusable, and scalable in enterprise codebases.',
    thumbnailUrl: 'https://picsum.photos/seed/vid-tw/800/450',
    videoUrl: 'https://youtube.com',
    duration: '18:40',
    publishedAt: 'Jan 15, 2026',
    views: '24K'
  }
];

export const blogs: BlogPost[] = [
  {
    id: 'designing-scalable-notification-systems',
    title: 'Designing Scalable Notification Systems',
    excerpt: 'An architectural deep dive into building a high-throughput notification service capable of handling millions of messages per day.',
    content: `
# Introduction
Building a notification system that scales to millions of users is a classic engineering challenge. It requires careful consideration of message queues, delivery guarantees, and database schema design.

## The Architecture
At the core of our system is a distributed message queue. We chose Kafka for its high throughput and durability. When an event occurs (e.g., a user receives a message), a payload is published to a specific Kafka topic.

### Key Components:
1. **Event Producers**: Microservices that generate events.
2. **Message Queue (Kafka)**: Buffers events to handle traffic spikes.
3. **Notification Workers**: Consumers that process events and format them for delivery.
4. **Delivery Providers**: Integrations with APNs, FCM, SendGrid, etc.

## Handling Failures
Network partitions and third-party API outages are inevitable. We implemented a robust retry mechanism with exponential backoff. If a notification fails to deliver after 5 attempts, it's routed to a Dead Letter Queue (DLQ) for manual inspection.

## Conclusion
By decoupling the event generation from the delivery mechanism using a message queue, we achieved a highly resilient and scalable architecture.
    `,
    readTime: '8 min read',
    publishedAt: 'Mar 05, 2026',
    tags: ['System Design', 'Architecture', 'Kafka']
  },
  {
    id: 'the-future-of-frontend-tooling',
    title: 'The Future of Frontend Tooling: Rust and Beyond',
    excerpt: 'Why the JavaScript ecosystem is rewriting its core infrastructure in systems languages like Rust and Go.',
    content: `
# The Need for Speed
For years, frontend tooling (bundlers, linters, formatters) was written in JavaScript. While convenient, as codebases grew, the performance bottlenecks became undeniable. Waiting 30 seconds for a local dev server to start is a massive drain on productivity.

## Enter Rust and Go
Tools like Vite (esbuild/Go), SWC (Rust), and Turbopack (Rust) have revolutionized the developer experience. By leveraging systems languages, these tools can parallelize tasks and manage memory far more efficiently than Node.js.

### What this means for developers
1. **Instant Feedback**: Hot Module Replacement (HMR) now happens in milliseconds.
2. **Reduced CI Times**: Build pipelines that used to take 15 minutes now finish in 3.
3. **Complexity Shift**: While the tools are faster, contributing to them now requires knowledge of Rust or Go, shifting the ecosystem's skill requirements.

## Looking Ahead
The transition is still ongoing. We are likely to see even more tools, like ESLint and Prettier, fully replaced or heavily augmented by Rust-based alternatives in the coming years.
    `,
    readTime: '5 min read',
    publishedAt: 'Feb 12, 2026',
    tags: ['Frontend', 'Rust', 'Tooling']
  }
];

export const qas: QA[] = [
  {
    question: 'What is your primary tech stack?',
    answer: 'I primarily work with the JavaScript/TypeScript ecosystem. For the frontend, I love React and Next.js. For mobile, React Native. On the backend, I use Node.js, Express, and often pair them with PostgreSQL or Firebase depending on the project requirements.'
  },
  {
    question: 'Are you available for freelance work?',
    answer: 'I am currently open to select freelance opportunities, particularly those involving complex web applications or cross-platform mobile apps. Feel free to reach out via email to discuss.'
  },
  {
    question: 'What inspired the design of this site?',
    answer: 'I wanted a "workspace universal" feel—something that looks like a high-end developer tool or a modern IDE. Dark gray backgrounds, subtle lighting, and a focus on content rather than flashy distractions. I drew inspiration from sites like Lydia Hallie\'s and various minimalist SaaS landing pages.'
  }
];
