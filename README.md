# Daily Tracker

A premium, multi-purpose **React Native (Expo)** life dashboard that combines task management, Islamic tools (Namaz & Quran), quick notes, unit conversion, and everyday utilities in one sleek, theme-aware app.

![Stack](https://img.shields.io/badge/React%20Native-Expo-1DA5F2) ![Router](https://img.shields.io/badge/Router-Expo%20Router-8B5CF6) ![Styling](https://img.shields.io/badge/Styling-NativeWind%20%2B%20Tailwind-38BDF8) ![Auth](https://img.shields.io/badge/Auth-Firebase-FFCA28) ![Backend](https://img.shields.io/badge/Backend-Express%20%2B%20MongoDB-10B981)

## ✨ Features

| Module | Description |
| --- | --- |
| **Task Management** | Full CRUD tasks powered by a custom Express + MongoDB API. Add, toggle complete, edit, and delete tasks. Home dashboard shows today's overview with live progress bars. |
| **Namaz** | Real-time prayer times (Aladhan API, auto-locates or defaults to Dhaka) with a next-prayer countdown, plus an English/Bangla guide to the **Rules of Namaz**. |
| **Quran** | All 114 Surahs in **Bangla**, with Arabic text and Bangla translation (`bn.bengali`) per surah. Searchable by Bangla/English name, number, or meaning. |
| **Quick Notes** | Lightweight note-taking with local persistence (AsyncStorage). Add and delete notes with swipe-less simple UI. |
| **Unit Converter** | Length, Weight, Temperature, and Currency conversion (live exchange rates with an offline fallback). |
| **Calculator** | Clean tape-history calculator for quick math. |
| **Age Calculator** | Precise age in years/months/days, zodiac sign, next birthday countdown (`/stats` tab). |
| **Weather** | Real-time weather powered by OpenWeatherMap. |
| **Authentication** | Firebase Auth — Google sign-in and email/password (register/login). |
| **Personal Data** | Edit your display name from the Profile screen (Firebase `updateProfile`). |
| **Theme System** | Light / Dark / System themes persisted locally; every screen adapts its colors. |

## 🛠 Tech Stack

- **Framework:** React Native + [Expo SDK](https://expo.dev)
- **Routing:** [Expo Router](https://docs.expo.dev/router/introduction/) (file-based navigation)
- **Styling:** NativeWind / Tailwind CSS with custom design tokens (accent `#FF6B35`, card radius `20px`)
- **Icons:** `@expo/vector-icons` (Ionicons)
- **Auth:** Firebase Authentication (`firebase/auth`)
- **State:** React Context (`AuthContext`, `ThemeProvider`) + AsyncStorage persistence
- **Backend:** Custom Express server (`task-server/`) backed by MongoDB Atlas
- **External APIs:**
  - Prayer times — [Aladhan](https://aladhan.com)
  - Quran — [Alquran Cloud](https://alquran.cloud)
  - Currency — [exchangerate-api](https://www.exchangerate-api.com)
  - Weather — [OpenWeatherMap](https://openweathermap.org)

## 📁 Project Structure

```
DailyTracker/
├── daily-tracker/            # Expo (React Native) app
│   ├── app/
│   │   ├── index.tsx         # Landing / Login
│   │   ├── register.tsx      # Sign up
│   │   ├── (tabs)/           # Bottom navigation
│   │   │   ├── index.tsx     # Home dashboard
│   │   │   ├── calendar.tsx  # Calendar
│   │   │   ├── add.tsx       # Tasks (center FAB)
│   │   │   ├── stats.tsx     # Age calculator
│   │   │   └── profile.tsx   # Profile & settings
│   │   ├── namaz.tsx         # Prayer times + rules
│   │   ├── quran.tsx         # Bangla surah list (searchable)
│   │   ├── surah/[id].tsx    # Surah detail (Arabic + Bangla)
│   │   ├── notes.tsx         # Quick notes
│   │   ├── converter.tsx     # Unit converter
│   │   ├── calculator.tsx    # Calculator
│   │   ├── weather.tsx       # Weather
│   │   ├── bmi.tsx           # BMI
│   │   ├── personal-data.tsx # Edit profile
│   │   └── _layout.tsx       # Root (Theme + Auth providers)
│   ├── components/
│   │   ├── shared/theme.tsx          # Theme context (light/dark/system)
│   │   ├── shared/service/task.route.ts  # Task API client
│   │   ├── Namaz/NamazRules.tsx      # English/Bangla namaz guide
│   │   ├── Quran/quran.constants.ts  # 114 Bangla surah names
│   │   └── Firebase/                 # AuthProvider + firebase config
│   └── app.json
│
└── task-server/              # Express + MongoDB REST API
    ├── index.js              # Routes: GET/POST /tasks, PATCH/DELETE /tasks/:id
    └── .env                  # MONGO_URI
```

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 18+
- Expo CLI (`npx expo`)
- A MongoDB Atlas cluster (for the task backend)
- A Firebase web project (for authentication)

### 2. Run the app

```bash
cd daily-tracker
npm install
npx expo start
```

Scan the QR code with **Expo Go** (or press `i` for iOS simulator / `a` for Android) to run the app.

### 3. Run the task backend (optional)

```bash
cd task-server
npm install
# create .env:
#   MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/...
cp .env.example .env   # if provided
npm start
```

The server listens on `http://localhost:5000`.

## 🔧 Configuration

| Variable | Where | Purpose |
| --- | --- | --- |
| `MONGO_URI` | `task-server/.env` | MongoDB Atlas connection string |
| `weather_api` | Expo env (`.env`) | OpenWeatherMap API key |
| `FIREBASE_*` | `components/Firebase/firebase.config.js` | Firebase web app credentials |

## 🧪 Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start Expo dev server |
| `npx expo start` | Same as above (alias) |
| `npx tsc --noEmit` | Type-check the app |
| `npx expo lint` | Lint the app |

## 🤝 API Reference (task-server)

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/tasks` | List all tasks |
| `POST` | `/tasks` | Create a task (`{ title, isDone?, name?, email? }`) |
| `PATCH` | `/tasks/:id` | Update task fields (`title`, `isDone`, `name`, `email`) |
| `DELETE` | `/tasks/:id` | Delete a task |

---

*Designed and engineered with a focus on premium user experiences.*