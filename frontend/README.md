# Turkcell Decision Engine - Dashboard

Modern, real-time dashboard for monitoring and managing the Turkcell Decision Engine microservices.

## Features

- **Real-time Event Stream**: Live monitoring of incoming events with auto-refresh
- **Rule Management UI**: Create, edit, and delete rules with an intuitive interface
- **Analytics & Charts**: Visual representation of user state distribution
- **Service Health**: Monitor all microservices status in the header
- **Dark Mode**: Professional dark theme optimized for enterprise use

## Tech Stack

- Next.js 16 with App Router
- Tailwind CSS v4
- shadcn/ui Components
- Recharts for data visualization
- Real-time polling (3-5 second intervals)

## Installation

\`\`\`bash
npm install
\`\`\`

## Environment Variables

Create a `.env.local` file:

\`\`\`env
NEXT_PUBLIC_EVENT_SERVICE_URL=http://localhost:3001
NEXT_PUBLIC_RULE_ENGINE_URL=http://localhost:3002
NEXT_PUBLIC_USER_STATE_URL=http://localhost:3003
\`\`\`

## Development

\`\`\`bash
npm run dev
\`\`\`

Dashboard will be available at http://localhost:3000

## Architecture

\`\`\`
Dashboard (Next.js)
    ↓ HTTP Polling
Event Service (3001) ← Real-time stats
Rule Engine (3002) ← Rule CRUD
User State (3003) ← State distribution
\`\`\`

## Components

- `dashboard-header`: Service status and navigation
- `stats-grid`: Key metrics cards with auto-refresh
- `event-stream`: Real-time event feed with status badges
- `rules-list`: Rule management with create/delete
- `create-rule-dialog`: Form for creating new rules
- `user-state-chart`: Pie chart showing user distribution

## API Integration

All components use fetch() to connect to backend microservices. Polling intervals:
- Stats: 5 seconds
- Events: 3 seconds
- User States: 5 seconds

## Design

Dark mode inspired by Vercel's observability dashboard with:
- Purple primary color (264° hue)
- Teal accent color (162° hue)
- Dark background (10% lightness)
- High contrast for readability
