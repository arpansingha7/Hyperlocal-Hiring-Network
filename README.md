# 🚀 Hyperlocal Hiring Network

A fully modernized, high-performance web platform built to revolutionize the local job market. This platform completely bridges the gap connecting neighborhood employers with local talent via real-time spatial calculations, dynamic application tracking, and an ultra-premium React interface.

---

## 🔥 Key Features

- **📍 Haversine Hyperlocal Tracking**: Automatically calculates real-time Euclidean distance between applicants and job locations globally.
- **⚡ Application Kanban Pipelines**: Employers can dynamically "Accept" or "Reject" applicants, which triggers live UI pulses for Job Seekers via WebSockets (`Socket.IO`).
- **🎙️ AI Voice-to-Text Registration**: Incorporates intelligent NLP dictation via Groq APIs allowing users to populate complex forms simply by speaking.
- **🌓 Global Dark Mode**: Fully synchronized persistent Light/Dark environments executed without UI flash vulnerabilities using LocalStorage and Tailwind framework triggers.
- **📱 Glassmorphism Interface**: Utilitizes 60FPS fluid entrance staggers, spring physics, and frosted-glass panels natively driven by `Framer Motion`.

---

## 💻 Tech Stack

- **Frontend Core**: React.js (Vite), React Router
- **Animations & Styling**: Tailwind CSS (v3), Framer Motion, React-Leaflet (Maps)
- **Backend Architecture**: Node.js, Express.js
- **Database & Geospatial**: MongoDB Atlas (leveraging `2dsphere` location indexes)
- **Real-Time Communication**: Socket.IO
- **Security Protocols**: JWT HTTP-Only Cookies, Express-Rate-Limit, Helmet

---

## 🚀 Deployment Instructions

This repository is explicitly configured and ready for CI/CD Cloud deployments.

### 1. Backend (Render / Node Server)
Ensure the following variable definitions exist within your cloud provider's environment variables:
```env
PORT=4000
FRONTEND_URL=https://your-frontend-domain.com
DB_URL=mongodb+srv://<auth>@<cluster>.mongodb.net/<db>
JWT_SECRET_KEY=your_secure_string
JWT_EXPIRE=7d
COOKIE_EXPIRE=7
GROQ_API_KEY=your_groq_key
```

### 2. Frontend (Vercel / Netlify)
The frontend utilizes dynamic API routing perfectly preparing it for deployment.
Ensure you assign the production backend root to Vite:
```env
VITE_API_BASE_URL=https://your-backend-domain.com/api/v1
```

---

## ⚙️ Local Development

### Prerequisites
- Node.js `v18+`
- MongoDB Instance 

### Setup Commands
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/Hyperlocal-Hiring-Network.git
   ```
2. **Install Backend Dependencies & Bootup:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
3. **Install Frontend Dependencies & Bootup:**
   ```bash
   cd frontend
   npm install --legacy-peer-deps
   npm run dev
   ```

---

*Open Sourced and built to scale. Feel free to Fork, Star, and contribute!*
