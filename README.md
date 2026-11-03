# 🚀 Rank Pilot — AI-Powered SEO Analyzer & Keyword Rank Tracker

<div align="center">

![Rank Pilot Banner](https://img.shields.io/badge/Rank%20Pilot-AI%20SEO%20SaaS-6366f1?style=for-the-badge&logo=rocket&logoColor=white)
[![Vercel](https://img.shields.io/badge/Deployed%20with-Vercel-black?style=for-the-badge&logo=vercel)](https://ai-seo-rank-tracker-seven.vercel.app)
[![Render](https://img.shields.io/badge/Hosted%20on-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://ai-seo-rank-tracker-n0xd.onrender.com)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](https://opensource.org/licenses/ISC)

<br />

**A modern, production-grade AI SEO intelligence platform that combines headless web scraping, Google Gemini AI audits, and automated SERP keyword rank tracking into one unified dashboard.**

[Live Demo](https://ai-seo-rank-tracker-seven.vercel.app) • [Report Bug](https://github.com/Parinay-Chauhan/AI-SEO-Rank-Tracker/issues) • [Request Feature](https://github.com/Parinay-Chauhan/AI-SEO-Rank-Tracker/issues)

</div>

---

## 📖 Overview

**Rank Pilot** is a full-stack SaaS application built to automate technical website audits and search engine position monitoring. It scrapes web pages in real-time, feeds structured telemetry to Google Gemini AI for deep analysis, and tracks keyword positions on Google search results with historical performance graphs and competitor intelligence.

---

## ✨ Key Features

### 🔍 1. AI-Powered Comprehensive SEO Audits
- **Headless & Direct Scraping Engine:** Powered by Browserbase + Playwright with an automatic high-speed HTTP fetch fallback, guaranteeing 100% uptime regardless of cloud browser limits.
- **Deep Technical Crawling:** Inspects meta titles, descriptions, OpenGraph / Twitter cards, canonical tags, heading structure (`H1`–`H6`), broken/internal/external links, and image `alt` attributes.
- **Gemini 2.5 AI Insights:** Delivers categorized scores across **SEO**, **Performance**, **Accessibility**, and **Best Practices**, along with prioritized actionable recommendations (Critical, Warning, Info).
- **Keyword Density Analytics:** Automatically calculates frequency, percentage distribution, and content ratios without card overflow.

### 📈 2. Automated Google Keyword Rank Tracking
- **Real-Time SERP Extraction:** Monitors Google search rankings for specified domains and keywords.
- **Position Change Tracking:** Displays daily gain/loss indicators (`+2`, `-1`, stable), current page, and best recorded ranking.
- **Competitor Landscape:** Detects top-ranking competitors on the same SERP, capturing competitor titles, domains, and snippet previews.
- **Interactive Historical Charts:** Visualizes position progress over time using high-DPI HTML5 canvas graphs.
- **Automated Cron Jobs:** Scheduled background checking via `node-cron` to maintain fresh SERP data without manual refreshes.

### 🛡️ 3. Production Authentication & Security
- **Dual-Token JWT Architecture:**
  - `accessToken` valid for **3 hours** for fast stateless authorization.
  - `refreshToken` valid for **15 days** stored securely.
- **Silent Token Refresh:** Transparent client-side Axios response interceptor that seamlessly refreshes expired access tokens in the background without logging the user out.
- **Secure Cross-Origin Cookies:** Production-ready `SameSite: None` and `Secure: true` cookie configuration for decoupled frontend (Vercel) and backend (Render) architectures.
- **Dynamic CORS Whitelisting:** Auto-adapts to Vercel preview deployments, production domains, and local development ports.

### 🎨 4. Premium Dark-Mode User Experience
- **Glassmorphism Aesthetic:** Obsidian backdrop with electric neon accents, circular score gauges, and smooth transitions.
- **Fully Responsive:** Custom layout designed for mobile, tablet, and desktop viewports.

---

## 🛠️ Tech Stack

### Frontend (`client/`)
| Technology | Description |
| :--- | :--- |
| **React 19** | Modern component-driven UI architecture |
| **Vite** | Next-generation frontend build tooling |
| **TypeScript** | Type-safe, maintainable codebase |
| **Tailwind CSS v4** | Modern utility-first responsive styling |
| **Lucide React** | Clean, lightweight icon suite |
| **Axios** | HTTP client configured with request/response interceptors |
| **React Router v7** | Client-side routing with protected routes |
| **React Hot Toast** | Minimalist interactive toast notifications |

### Backend (`server/`)
| Technology | Description |
| :--- | :--- |
| **Node.js (ESM)** | Modern ES module runtime |
| **Express 5** | High-performance REST API framework |
| **MongoDB & Mongoose** | Document database for analysis history & rank metrics |
| **Google GenAI SDK** | `@google/genai` running `gemini-2.5-flash` for structured audits |
| **Browserbase & Playwright** | Cloud browser automation with CDP connection |
| **JWT & Bcrypt** | Secure password hashing and token lifecycle management |
| **Node-Cron** | Automated recurring rank tracking execution |

---

## 📁 Repository Structure

```plaintext
AI-SEO-Rank-Tracker/
├── client/                     # Frontend React + Vite application
│   ├── src/
│   │   ├── assets/             # Global schemas, prompts, and assets
│   │   ├── components/         # Reusable UI widgets (Navbar, Gauges, Cards)
│   │   ├── context/            # AppContext (Auth, Interceptors) & ThemeContext
│   │   ├── pages/              # Dashboard, Analyze, Report, RankTracker, Login
│   │   ├── App.tsx             # Route definitions and layout wrapper
│   │   └── main.tsx            # Application entry point
│   ├── vercel.json             # Vercel SPA routing fallback configuration
│   ├── vite.config.ts          # Vite plugin and environment prefix setup
│   └── package.json
│
├── server/                     # Backend Node.js + Express API
│   ├── src/
│   │   ├── controllers/        # Business logic (analysis, rank, user)
│   │   ├── cron/               # Scheduled background rank tracking cron
│   │   ├── db/                 # MongoDB connection handler
│   │   ├── middlewares/        # JWT auth verification and error middleware
│   │   ├── models/             # Mongoose schemas (User, Analysis, RankTracking)
│   │   ├── routes/             # RESTful API route declarations
│   │   ├── services/           # Browserbase scraper, fetch fallback & Gemini AI
│   │   ├── utils/              # ApiError, ApiResponse, AsyncHandler
│   │   ├── app.js              # Express app setup and CORS configuration
│   │   └── index.js            # Server entry point
│   └── package.json
│
└── README.md
```

---

## ⚡ Getting Started Locally

### Prerequisites
- **Node.js** (v20+ recommended)
- **MongoDB** instance (Local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Google Gemini API Key** ([Google AI Studio](https://aistudio.google.com/))
- **Browserbase API Key** ([Browserbase](https://browserbase.com/)) *(Optional — direct fetch scraper activates automatically if omitted)*

---

### 1. Clone the Repository
```bash
git clone https://github.com/Parinay-Chauhan/AI-SEO-Rank-Tracker.git
cd AI-SEO-Rank-Tracker
```

---

### 2. Configure Backend (`server/`)

1. Navigate to the server directory and install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Create a `.env` file in `server/.env`:
   ```env
   PORT=8000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   CORS_ORIGIN=http://localhost:5173

   # JWT Configuration
   ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_here
   ACCESS_TOKEN_EXPIRY=3h
   REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_here
   REFRESH_TOKEN_EXPIRY=15d

   # AI & Scraping
   GEMINI_API_KEY=your_gemini_api_key
   BROWSERBASE_API_KEY=your_browserbase_api_key
   ```

3. Start the server in development mode:
   ```bash
   npm run dev
   ```
   *The backend will be available at `http://localhost:8000`.*

---

### 3. Configure Frontend (`client/`)

1. In a new terminal, navigate to the client directory and install dependencies:
   ```bash
   cd client
   npm install
   ```

2. Create a `.env` file in `client/.env`:
   ```env
   VITE_BACKEND_URL=http://localhost:8000
   ```

3. Launch the Vite development server:
   ```bash
   npm run dev
   ```
   *The application will open at `http://localhost:5173`.*

---

## 📡 REST API Reference

### 🔐 Authentication (`/api/v1/users`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/register` | Register a new user and generate dual tokens | ❌ |
| `POST` | `/login` | Authenticate user and issue tokens in cookies | ❌ |
| `POST` | `/logout` | Invalidate refresh token and clear auth cookies | ✅ |
| `POST` | `/refresh-token` | Exchange valid refresh token for fresh access token | ❌ |
| `GET` | `/current-user` | Retrieve profile information of logged-in user | ✅ |

### 📊 SEO Analysis (`/api/v1/analysis`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/analyze` | Initiate background web scraping and Gemini AI audit | ✅ |
| `GET` | `/:id` | Poll analysis progress and retrieve complete audit report | ✅ |
| `GET` | `/list` | Fetch paginated historical audit scans for current user | ✅ |

### 🎯 SERP Rank Tracking (`/api/v1/rank`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/add` | Add domain & target keyword for rank tracking | ✅ |
| `GET` | `/list` | Retrieve all tracked keywords with position changes | ✅ |
| `GET` | `/:id` | Get specific keyword details, history & competitors | ✅ |
| `POST` | `/:id/refresh` | Trigger on-demand position re-check | ✅ |
| `DELETE` | `/:id` | Remove a tracked keyword | ✅ |

---

## 🌐 Production Deployment

### Backend (Render)
1. Create a **New Web Service** connected to the repository (`main` branch).
2. Set **Root Directory** to `server`.
3. Set **Build Command** to `npm install` and **Start Command** to `npm start`.
4. Add all environment variables from `server/.env` with `NODE_ENV=production`.

### Frontend (Vercel)
1. Import the repository on **Vercel**.
2. Set **Root Directory** to `client`.
3. Framework Preset: **Vite**.
4. Add Environment Variable:
   - `VITE_BACKEND_URL` = `https://your-render-service.onrender.com`
5. Deploy.

---

## 👨‍💻 Author

**Parinay Chauhan**
- GitHub: [@Parinay-Chauhan](https://github.com/Parinay-Chauhan)
- Project Repository: [AI-SEO-Rank-Tracker](https://github.com/Parinay-Chauhan/AI-SEO-Rank-Tracker)

---

## 📄 License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).
