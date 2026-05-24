# Native ToDo & Executive Utilities

Welcome to the **Native ToDo** application. This project is a premium, multi-purpose mobile application built specifically for productivity, lifestyle management, and advanced daily utility. It seamlessly unifies several robust modules—Task Management, Islamic Hub, Weather Dashboard, and Advanced Calculators—under one sleek, cohesive, and modern design system ("Native Todo Aesthetic").

## 🚀 Overview

Native ToDo goes beyond standard task management. It acts as a holistic "Life Dashboard." Instead of switching between multiple apps for your daily routine, this app provides:
1. **Task Board:** Keep track of your daily/weekly assignments.
2. **Islamic Hub:** Daily prayer times, next prayer countdown, and a complete library of all 114 Quranic Surahs.
3. **Advanced Age Calculator:** Precise age metrics (Years, Months, Days, Weeks), total heartbeats estimation, next birthday countdown, and zodiac sign.
4. **Weather Forecast:** Real-time global weather, 7-day forecast, air quality, visibility, and AI-like "weather sentiment" recommendations.
5. **Accounting Calculator:** A clean, tape-history based calculator for quick math.

## 🛠️ Tech Stack

- **Framework:** [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- **Routing:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation)
- **Styling:** Nativewind / Tailwind CSS (Custom "Native Todo" tokens: `#EFEFEF` background, `#FF6B35` accent, `20px` card radii)
- **Icons:** `@expo/vector-icons` (Ionicons)
- **Authentication:** Firebase Auth (`useAuth` hook)
- **Backend/API:** Custom Express server for Tasks. External APIs for Weather (OpenWeatherMap), Prayer (Aladhan), and Quran (Alquran Cloud).

## ✨ Current Features

- **Tab-Based Navigation:** A central bottom tab dock allowing fluid navigation between Home, Calendar (Islamic Hub), Add (Tasks), Stats (Age Calculator), and Profile.
- **Glassmorphism & Gradients:** Advanced styling for Hero Cards, including countdown bars and multi-stop gradients.
- **Dynamic Routing:** Real-time generation of Surah details (`app/surah/[id].tsx`).
- **Interactive Forms:** Highly responsive text inputs with validation for authentication and data entry.

## 🔮 Future Roadmap (Ideas & Enhancements)

Here are some excellent ideas to make this app even more powerful in the future:

### 1. Task Management Expansion
- **Push Notifications:** Reminders for overdue tasks or tasks approaching their deadline.
- **Categories/Tags:** Color-coded tags (e.g., Work, Personal, Health) to filter the task board.

### 2. Islamic Hub Upgrades
- **Audio Recitation:** Integrate an audio player API to listen to the Surahs directly within the app.
- **Qibla Compass:** Utilize the device's magnetometer and GPS to build a real-time Qibla direction finder.
- **Tasbih Counter:** A digital, haptic-feedback enabled Tasbih counter that tracks daily Zikr.

### 3. Weather Dashboard Enhancements
- **Location Auto-Tracking:** Automatically update the weather dashboard based on background location changes.
- **Rain Radar Map:** Integrate a small WebView or map overlay showing live precipitation.

### 4. Advanced Calculator & Health Features
- **BMI History Graph:** Allow users to save their BMI over time and visualize it on a line chart.
- **Financial/Currency Converter:** Since you have an Accounting Calculator, add live exchange rates for a quick currency conversion tab.

---

*Designed and engineered with a focus on premium user experiences.*
