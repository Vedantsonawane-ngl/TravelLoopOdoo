# Traveloop | AI-Powered Travel Planner

Traveloop is a state-of-the-art AI travel platform designed to craft personalized multi-city itineraries in seconds. Built for speed, aesthetics, and intelligence.

## 🚀 Key Features
- **AI Itinerary Generator**: Dynamic generation of detailed daily schedules.
- **Smart Budget Optimizer**: AI-driven cost reduction (Save ~20% per trip).
- **Weekend Getaway Express**: Quick 48-hour escape planner based on your current city.
- **Interactive Drag-and-Drop**: Fully customizable schedules with real-time budget updates.
- **Global Search**: Autocomplete support for cities worldwide.
- **Visual Dashboards**: Track upcoming trips, travel stats, and budget distribution.

---

## 🛠️ Requirements & Setup

### 1. Prerequisites
- **Node.js**: v18.x or higher
- **npm** or **yarn**
- **MySQL**: A running MySQL instance (local or hosted like PlanetScale/Aiven)

### 2. Environment Variables (`.env`)
Create a `.env` file in the root directory and add the following:

```env
# Database Connection
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-random-string"

# AI Configuration (Optional - Mock Fallback is enabled)
GEMINI_API_KEY="your-google-gemini-api-key"
```

### 3. Installation
```bash
# Clone the repository
cd traveloop

# Install dependencies
npm install

# Push the schema to your database
npx prisma db push
```

### 4. Running the Project
```bash
# Start the development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🧪 Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: MySQL via Prisma ORM
- **Authentication**: NextAuth.js
- **Icons**: Lucide React
- **Animations**: Framer Motion / Tailwind Animate
- **Maps**: React-Leaflet

---

## 💡 Presentation Note (The Hackathon "Edge")
Traveloop implements a **Mock AI Fallback System**. If an API key is missing or rate-limited, the system seamlessly switches to a dynamic template-based generator. This ensures your live demo **never fails**, regardless of internet connectivity or API status.
