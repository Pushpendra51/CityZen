# Smart City Complaint System 🏙️

A full-stack MERN web application that allows citizens to submit urban complaints (potholes, lights, garbage, etc.) and enables city authorities to manage and resolve them through an admin panel.

## 🚀 Features

- 🔐 JWT-based authentication (login, signup, role-based access)
- 👤 Citizen portal to submit and track complaints
- 🛠️ Admin dashboard to view, filter, update status, and delete complaints
- ⚡ Urgency-based priority scoring
- 📊 Real-time complaint status (Pending → In Progress → Resolved)
- 🌐 Production-ready with environment variable configuration

## 🗂 Project Structure

```
smart-city-complaint-system/
├── backend/          # Express.js REST API
│   ├── config/       # MongoDB connection
│   ├── middleware/   # JWT auth middleware
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   ├── .env          # Environment variables (not committed)
│   └── server.js     # Entry point
│
└── frontend/         # React.js SPA
    ├── src/
    │   ├── components/   # Navbar, ProtectedRoute
    │   ├── pages/        # LandingPage, Login, Signup, Dashboard, AdminDashboard
    │   └── services/     # Axios API instance
    ├── .env              # REACT_APP_API_URL
    └── public/
```

## ⚙️ Setup & Run Locally

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```

Backend runs at: `http://localhost:5000`

### 2. Frontend

```bash
cd frontend
cp .env.example .env
# Set REACT_APP_API_URL=http://localhost:5000
npm install
npm start
```

Frontend runs at: `http://localhost:3001`

## 🌍 Deployment

### Backend — Render / Railway

1. Create a new Web Service
2. Set root directory to `backend/`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables:
   - `MONGO_URI` → your MongoDB Atlas URI
   - `JWT_SECRET` → a long random string
   - `FRONTEND_URL` → your deployed frontend URL
   - `PORT` → (set automatically by platform)

### Frontend — Vercel / Netlify

1. Set root directory to `frontend/`
2. Build command: `npm run build`
3. Output directory: `build`
4. Add environment variable:
   - `REACT_APP_API_URL` → your deployed backend URL

## 🔑 Environment Variables

### Backend (`backend/.env`)
| Variable       | Description                          |
|----------------|--------------------------------------|
| `PORT`         | Server port (default: 5000)          |
| `MONGO_URI`    | MongoDB connection string            |
| `JWT_SECRET`   | Secret key for JWT signing           |
| `FRONTEND_URL` | Allowed CORS origin (frontend URL)   |

### Frontend (`frontend/.env`)
| Variable              | Description                     |
|-----------------------|---------------------------------|
| `REACT_APP_API_URL`   | Backend API base URL            |

## 👑 Creating an Admin User

Register a user normally, then update their role directly in MongoDB:

```js
// In MongoDB shell or Compass
db.users.updateOne({ email: "admin@city.gov" }, { $set: { role: "admin" } })
```

## 📡 API Endpoints

| Method | Endpoint                      | Auth     | Description              |
|--------|-------------------------------|----------|--------------------------|
| POST   | `/api/auth/signup`            | Public   | Register new user        |
| POST   | `/api/auth/login`             | Public   | Login, receive JWT       |
| GET    | `/api/auth/me`                | User     | Get current user profile |
| POST   | `/api/complaint`              | User     | Submit complaint         |
| GET    | `/api/complaint/my`           | User     | Get my complaints        |
| GET    | `/api/complaint`              | Admin    | Get all complaints       |
| PUT    | `/api/complaint/status/:id`   | Admin    | Update complaint status  |
| PUT    | `/api/complaint/resolve/:id`  | Admin    | Resolve complaint        |
| DELETE | `/api/complaint/:id`          | Admin    | Delete complaint         |

## 🛡️ Tech Stack

- **Frontend**: React.js, React Router v7, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Auth**: JWT (jsonwebtoken), bcryptjs
- **Styling**: CSS-in-JS (inline styles with Inter font)
