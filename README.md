# Elderly Care Solutions

Elderly Care Solutions is a comprehensive, accessibility-first platform designed to improve the quality of life for seniors. It fosters social connection, simplifies healthcare tracking, and provides a robust support network by connecting elderly users with family caregivers and medical professionals.

## 🌟 Key Features

### 1. Care Circle Ecosystem
- **Elderly-Centric Model:** Connects seniors with a dedicated circle of caregivers and professionals.
- **Role-Based Access:** Tailored interfaces for Elderly Users, Caregivers, Professionals, and Administrators.
- **Secure Linking:** Caregivers can join a circle using a unique Elderly ID or email.

### 2. Health & Medication Management
- **Medication Tracker:** Real-time logging of prescriptions, dosages, and frequencies.
- **Smart Reminders:** Automated in-app alerts with "Confirm Intake" and "Snooze" functionality.
- **Health Logger:** Track vitals, mood, sleep, and activity levels with real-time sync across the Care Circle.
- **Adherence Monitoring:** Caregivers can view medication history to ensure safety.

### 3. AI-Powered Insights (Gemini AI)
- **Knowledge Hub:** Access curated health information and elderly care best practices.
- **Empathy Lab:** Interactive tools for caregivers to better understand the elderly experience.
- **Intelligent Assistance:** AI-driven suggestions for care improvements and health trend analysis.

### 4. Service Marketplace
- **Verified Providers:** Directory of transport, home help, and specialized healthcare services.
- **Booking System:** Manage service requests with status tracking (Pending, Confirmed, Completed).
- **Admin Verification:** Ensuring all listed services meet quality standards.

### 5. Social & Community
- **Event Discovery:** Find and register for local social gatherings and activities.
- **Social Feed:** Stay connected with community updates and shared experiences.

### 6. Accessibility First
- **Dynamic Scaling:** User-controlled font sizes (sm to 2xl) via `AccessibilityContext`.
- **High Contrast:** Designed for legibility and ease of use for those with visual impairments.
- **Simplified Navigation:** Large touch targets and intuitive layouts.

## 🛠 Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS (Mobile-first, responsive)
- **Animations:** Framer Motion (`motion/react`)
- **Icons:** Lucide React
- **Backend:** Firebase (Auth, Firestore)
- **AI Integration:** Google Gemini AI (`@google/genai`)
- **Server:** Express (Node.js) for full-stack capabilities

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration
1. **Firebase:** Ensure `firebase-applet-config.json` is present in the root directory with your project credentials.
2. **Environment Variables:** Create a `.env` file based on `.env.example`:
   ```env
   GEMINI_API_KEY="your_api_key_here"
   APP_URL="your_app_url_here"
   ```

### Running the App
- **Development:**
  ```bash
  npm run dev
  ```
- **Production Build:**
  ```bash
  npm run build
  npm start
  ```

## 🔒 Security & Privacy

The platform implements a "Default Deny" security model via Firestore Security Rules:
- **Ownership Protection:** Users can only modify their own profile data.
- **Care Circle Privacy:** Health data is restricted to authorized circle members.
- **PII Lockdown:** Sensitive information (emails, health alerts) is never exposed publicly.
- **Input Validation:** Strict schema enforcement for all database writes.

## 📁 Project Structure

- `/src/pages`: Core views (Home, Social, Services, Knowledge Hub, Empathy Lab).
- `/src/components`: Feature-specific UI (MedicationTracker, HealthLogger, CareCircleMembers).
- `/src/contexts`: Global state management (Accessibility, Auth).
- `/firestore.rules`: Authoritative security definitions.
- `/firebase-blueprint.json`: Database schema IR.

---
*Built with care for the elderly community.*
