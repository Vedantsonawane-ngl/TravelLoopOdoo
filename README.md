# Traveloop

An AI-powered travel planner that generates personalized multi-city itineraries. You enter your destination, travel dates, budget, and style — and Gemini builds out a full day-by-day plan with activities, timings, and estimated costs.

---

## What it does

- Generates detailed trip itineraries using Google Gemini 1.5 Flash
- Lets you drag and reorder activities, with the budget updating in real time
- Includes a weekend getaway mode for quick 48-hour escapes
- Shows your trips on an interactive map via React Leaflet
- Lets you export any trip as a `.ics` calendar file
- Has a dashboard with travel stats and budget charts
- Falls back to a template-based generator if the Gemini API is unavailable, so demos never break

---

## Tech stack

**Frontend** — Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion, Lucide React, React Leaflet, Recharts, @hello-pangea/dnd

**Backend** — Next.js API Routes, NextAuth.js, Prisma ORM, bcrypt

**Database** — MySQL

**AI** — Google Generative AI SDK (`@google/generative-ai`), Gemini 1.5 Flash

**Other** — `ics` for calendar exports, PostCSS, ESLint

---

## Requirements

- Node.js v18 or higher
- npm
- A running MySQL instance (local or hosted — PlanetScale, Aiven, Railway all work)
- A Google Gemini API key (optional — mock fallback activates if missing)

---

## Setup

Clone the repo and install dependencies:

```bash
cd traveloop
npm install
```

Create a `.env` file in the root:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
GEMINI_API_KEY="your-gemini-key-here"
```

Push the schema to your database:

```bash
npx prisma db push
```

Start the dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

---

## Scripts

```bash
npm run dev      # development server
npm run build    # prisma generate + next build
npm run start    # production server
npm run lint     # eslint
```

---

## Notes

- `GEMINI_API_KEY` is server-side only, never sent to the client.
- Passwords are hashed with bcrypt before being stored.
- If the Gemini key is missing or invalid, the app automatically switches to the mock generator — itineraries still get created, just from templates instead of the live AI.
