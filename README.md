# 🛠️ CrisisBridge v2: Defense-Grade Crisis Response

## Overview

**CrisisBridge v2** is a mission-critical emergency response platform designed for rapid awareness and coordination during domestic and international crises. Migrated from Next.js to a performance-optimized **Vite + React SPA**, it features a "Defense-Grade" tactical UI tailored for high-pressure environments where every second counts.

### 🎯 Objective
To bridge the gap between affected citizens and emergency responders through real-time data ingestion, tactical visualization, and administrative oversight.

---

## ✨ Key Features

- **🛡️ Tactical Command Center**: A data-rich dashboard for administrators to monitor incidents in real-time.
- **🧠 Google Gemini AI Triage**: Automatically categorizes incoming emergency reports, calculating severity, mapping affected zones, identifying spread risks, and generating immediate tactical SOP checklists for responders.
- **📍 Hyper-Local Reporting**: Streamlined guest reporting interface for citizens to submit incident details, location data, and severity levels.
- **📊 Advanced Analytics**: Recharts-powered data visualizations for trend analysis and resource allocation.
- **🔐 Secure Infrastructure**: Built on Supabase for robust authentication and high-performance Postgres backend.
- **⚡ Ultra-Responsive UI**: Strict TypeScript compliant, built with Tailwind CSS v4 and Framer Motion for smooth, interrupt-free interactions.

---

## 🚀 Tech Stack

- **Frontend**: [React 19](https://react.dev/), [Vite 8](https://vitejs.dev/) (Strict TypeScript)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State/Backend**: [Supabase](https://supabase.com/) (PostgreSQL & Auth)
- **AI / LLM**: [Google Gemini 2.5 Flash](https://ai.google.dev/) (For Emergency Triage & Analysis)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Visuals**: [Lucide React](https://lucide.dev/) (Icons), [Framer Motion](https://www.framer.com/motion/) (Animations)
- **Analytics**: [Recharts](https://recharts.org/)

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18+)
- NPM or PNPM
- A Supabase Project

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd crisis-bridge-v2
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Launch Development Server**:
   ```bash
   npm run dev
   ```

---

## 📁 Project Structure

```text
src/
├── components/     # UI Components (Tactical elements, Buttons, Forms)
├── hooks/          # Custom React hooks (Supabase data fetching)
├── layouts/        # Page layouts (Admin, Auth, Guest)
├── pages/          # Full page views (Dashboard, Analytics, Reporting)
├── utils/          # Helper functions and Supabase client
└── lib/            # Shared libraries and design tokens
```

---

## 📜 Deployment

The project is optimized for high-performance static hosting and is currently configured for **Google Cloud Firebase Hosting**.

```bash
# 1. Install Firebase CLI globally (if not installed)
npm install -g firebase-tools

# 2. Login to your Firebase / Google Cloud account
npx firebase login

# 3. Generate production bundle (strict TypeScript checking applied)
npm run build

# 4. Deploy to Firebase
npx firebase deploy
```

---

## 👥 Contributors

Built with precision for the **Google Solution Challenge**.

---

> [!IMPORTANT]
> This platform is designed for emergency response coordination. Ensure all API keys are restricted to appropriate origins in the Supabase Dashboard for production use.

