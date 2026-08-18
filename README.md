# 🌸 CycleCare — Menstrual Cycle & Wellness Tracker

> **Health Disclaimer:** CycleCare is a tracking and estimation tool only. All predictions are estimates based on data you provide and may not always be accurate. This application is **not a substitute for professional medical advice, diagnosis, or treatment.** Always consult a qualified healthcare provider for medical concerns.

---

## 📋 Overview

CycleCare is a full-stack menstrual cycle tracking and wellness application that helps users:
- Log and manage period records
- Receive smart cycle predictions based on historical data
- Track daily hydration goals
- Visualize cycle patterns through interactive charts
- Maintain secure, private health data

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Secure Authentication | JWT-based auth with bcrypt password hashing |
| 📅 Period Tracking | Log start/end dates, auto-calculate duration |
| 🔮 Cycle Prediction | Weighted average algorithm with confidence levels |
| 📊 Cycle Charts | Area chart (cycle lengths) + Bar chart (durations) |
| 💧 Hydration Tracker | Interactive glass UI with daily goal and history |
| 🌙 Dark Mode | Toggle and persist theme preference |
| 📱 Fully Responsive | Works on mobile (320px) through desktop (1440px+) |
| 🔒 Data Privacy | Users can only access their own records |

---

## 🛠 Tech Stack

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS v4**
- **React Router v6** (protected routes)
- **Axios** (centralized API client)
- **Recharts** (cycle charts)
- **Lucide React** (icons)
- **react-hot-toast** (notifications)
- **date-fns** (date utilities)

### Backend
- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **JWT** (JSON Web Tokens)
- **bcryptjs** (password hashing)
- **express-validator** (input validation)
- **express-rate-limit** (rate limiting)
- **helmet** (security headers)

---

## 📁 Folder Structure

```
dharvin/
├── cyclecare-frontend/
│   └── src/
│       ├── api/          ← All API calls (authApi, periodApi, etc.)
│       ├── components/   ← Reusable UI + layout components
│       ├── context/      ← AuthContext, ThemeContext
│       ├── pages/        ← All page components
│       └── utils/        ← dateUtils, helpers
│
├── cyclecare-backend/
│   └── src/
│       ├── controllers/  ← Route handlers
│       ├── models/       ← Mongoose models
│       ├── routes/       ← Express routers
│       ├── services/     ← predictionService (business logic)
│       ├── middleware/   ← auth, error, rate limiter
│       └── utils/        ← responseHelper, seed script
└── women.png             ← App logo
```

---

## ⚙️ Environment Variables

### Backend (`cyclecare-backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cyclecare
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (`cyclecare-frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🚀 Installation & Running

### Prerequisites
- Node.js 18+
- MongoDB (local) or MongoDB Atlas (cloud)

### 1. Clone / Open the project
```bash
cd dharvin
```

### 2. Setup Backend
```bash
cd cyclecare-backend
copy .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```
Backend runs at: `http://localhost:5000`

### 3. Setup Frontend
```bash
cd cyclecare-frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:5173`

### 4. (Optional) Seed demo data
```bash
cd cyclecare-backend
npm run seed
# Login: demo_user / Demo@1234
```

---

## 🔌 API Documentation

### Auth
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login (userId or email + password) | No |
| POST | `/api/auth/logout` | Logout | Yes |
| GET  | `/api/auth/me` | Get current user | Yes |

### User
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET  | `/api/user/profile` | Get profile | Yes |
| PUT  | `/api/user/profile` | Update profile | Yes |
| PUT  | `/api/user/password` | Change password | Yes |
| PUT  | `/api/user/notifications` | Update notification prefs | Yes |

### Periods
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET  | `/api/periods` | Get all user periods | Yes |
| POST | `/api/periods` | Create period record | Yes |
| PUT  | `/api/periods/:id` | Update period record | Yes |
| DELETE | `/api/periods/:id` | Delete period record | Yes |

### Prediction & Cycles
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET  | `/api/prediction` | Get cycle prediction | Yes |
| GET  | `/api/cycles` | Get cycle statistics | Yes |

### Hydration
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET  | `/api/hydration` | Get today's hydration | Yes |
| PUT  | `/api/hydration` | Update hydration | Yes |
| POST | `/api/hydration/reset` | Reset today's hydration | Yes |
| GET  | `/api/hydration/history` | Get hydration history | Yes |

---

## 🔒 Security Notes

- Passwords are hashed with **bcrypt** (salt rounds: 12) — plain-text passwords are never stored
- JWT tokens expire in 7 days (configurable)
- All protected routes verify ownership before returning data
- Rate limiting is applied to auth routes (20 req/15 min) and general API (200 req/15 min)
- CORS is restricted to the frontend URL
- Security headers via **helmet**
- Never commit your `.env` file

---

## ⚕️ Health Disclaimer

CycleCare is designed as a wellness tracking and estimation tool. **It is not a medical device.**

- All period predictions are **estimates only** based on user-provided data
- Prediction accuracy improves with more cycle history
- CycleCare **cannot diagnose** medical conditions
- If you have concerns about your cycle, consult a qualified healthcare professional

---

## 📄 License

For educational/portfolio use only. Not intended for production medical use.
