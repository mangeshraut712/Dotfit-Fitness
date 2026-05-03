# Dotfit Fitness

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[![Website](https://img.shields.io/badge/Website-Live-00C853?style=for-the-badge&logo=web&logoColor=white)](https://dotfit-fitness--mbr63.replit.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/mangeshraut712/Dotfit-Fitness/pulls)
[![GitHub issues](https://img.shields.io/github/issues/mangeshraut712/Dotfit-Fitness.svg)](https://github.com/mangeshraut712/Dotfit-Fitness/issues)
[![GitHub stars](https://img.shields.io/github/stars/mangeshraut712/Dotfit-Fitness.svg)](https://github.com/mangeshraut712/Dotfit-Fitness/stargazers)

> 🚀 **Dotfit Fitness** - A modern fitness platform for Baner, Pune. Built with React, Express, PostgreSQL, and a conversion-focused single-page experience.

**🏋️‍♀️ Modern Gym Management Platform** for Dotfit Fitness in Baner, Pune. Features pricing, trainer profiles, class schedules, contact capture, SEO, and responsive UX for real member growth.

## 🌟 Highlights

- 🤖 **AI-Powered Coaching**: OpenAI support for personalized workout plans and guidance
- 📱 **Wearable Integration**: Prepared for health-tracking and recovery insights
- 🔐 **Secure Authentication**: JWT-based user management with role-based access control
- 📊 **Health Analytics**: Recovery scoring and biometric data analysis
- 🎯 **2026-Ready**: Built with modern web technologies and future-proof architecture

## 📋 Table of Contents

- [✨ Key Features](#-key-features)
- [🛠 Tech Stack](#-tech-stack)
- [📋 Prerequisites](#-prerequisites)
- [🚀 Quick Start](#-quick-start)
- [🌐 Live Deployments](#-live-deployments)
- [📜 Available Scripts](#-available-scripts)
- [🏗 Architecture](#-architecture)
- [🔮 Roadmap](#-roadmap--enhancements)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🙏 Acknowledgments](#-acknowledgments)

## ✨ Key Features

### 🚀 Core Functionality

- **Modern Gym Website**: Home page, guide pages, and admin view
- **Membership Management**: Trial booking, pricing plans, and customer onboarding
- **Trainer Profiles**: Staff showcase with certifications and expertise
- **Class Scheduling**: Timetable management and live session tracking
- **SEO Optimized**: JSON-LD structured data for search engine visibility

### 🤖 AI & Personalization

- **Adaptive Workouts**: AI-powered plan generation based on goals
- **Conversational Coaching**: OpenAI-powered assistant for workout guidance and tips
- **Form Analysis**: Ready for computer vision-based posture correction
- **Predictive Recovery**: Recovery score calculation support

### 🎯 Advanced Features

- **PWA-Ready UX**: Fast, mobile-first, app-like interface
- **Real-time Updates**: Live class bookings and trainer availability
- **Gamification**: Achievement badges, challenges, and social leaderboards
- **Accessibility**: Semantic markup and keyboard-friendly interactions
- **Multilingual-ready**: Structure supports localized content

## 🛠 Tech Stack

### Frontend (`artifacts/dotfit`)

- **React** with TypeScript
- **Vite** for fast builds and HMR
- **Tailwind CSS** with custom design system
- **Radix UI** for accessible primitives
- **Framer Motion** for animations
- **TanStack Query** for server state management
- **React Hook Form + Zod** for form validation
- **Wouter** for lightweight routing
- **Recharts** for data visualization
- **Lucide React** for icons

### Backend (`artifacts/api-server`)

- **Express.js 5** with TypeScript
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** for reliable storage
- **Pino** for structured logging
- **Zod** for runtime validation
- **Cookie Parser & CORS** for API handling

### Shared Libraries

- **API Client React**: Type-safe API integration
- **API Zod Schemas**: Centralized validation schemas
- **Database Layer**: Drizzle ORM schema definitions

### Development & Deployment

- **pnpm Workspaces** for monorepo management
- **TypeScript** across all packages
- **Prettier** for formatting
- **GitHub Actions** for CI automation
- **Replit** for collaborative development

## 📋 Prerequisites

- **Node.js** 20+ (with pnpm)
- **PostgreSQL**
- **Git**

## 🚀 Quick Start

1. **Clone and Install**

   ```bash
   git clone <repository-url>
   cd dotfit-fitness
   pnpm install
   ```

2. **Environment Setup**

   ```bash
   cp .env.example .env
   ```

3. **Database Initialization**

   ```bash
   pnpm --filter @workspace/db push
   ```

4. **Development Servers**

   ```bash
   pnpm --filter @workspace/api-server run dev
   pnpm --filter @workspace/dotfit run dev
   ```

## 🌐 Live Deployments

### Replit Deployment
- **Website**: https://dotfit-fitness--mbr63.replit.app/
- **API**: https://dotfit-fitness--mbr63.replit.app/api
- **Status**: Active ✅

### Vercel Deployment
- **Website**: https://dotfit-fitness.vercel.app
- **API**: https://dotfit-fitness.vercel.app/api

## 📜 Available Scripts

### Workspace Scripts

- `pnpm run build` - Build all packages
- `pnpm run typecheck` - Type check across workspace
- `pnpm run typecheck:libs` - Type check shared libraries
- `pnpm run format` - Format code with Prettier

### API Server Scripts

- `pnpm --filter @workspace/api-server run dev` - Start development server
- `pnpm --filter @workspace/api-server run build` - Build for production
- `pnpm --filter @workspace/api-server run start` - Start production server

### Frontend Scripts

- `pnpm --filter @workspace/dotfit run dev` - Start development server
- `pnpm --filter @workspace/dotfit run build` - Build for production
- `pnpm --filter @workspace/dotfit run serve` - Preview production build

## 🏗 Architecture

- `artifacts/dotfit/src/pages/home.tsx` - Main landing page
- `artifacts/api-server/src` - Express API server
- `lib/db` - Database schema and connection layer
- `lib/api-zod` - Shared validation schemas

## 🔮 Roadmap & Enhancements

- PWA/service worker
- Real payments/checkout
- Automated tests
- Deployment hardening
- Better analytics and conversion tracking

## 🤝 Contributing

We welcome contributions.

## 📄 License

MIT
