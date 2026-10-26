# AI Cybersecurity Data Lake: Next.js + Express + MongoDB

## 1. Backend (port 5000)
```bash
cd backend
npm install
cp .env.example .env     # set MONGO_URI and a long random JWT_SECRET
npm run seed             # loads demo hosts and incidents into MongoDB
npm run dev
```

## 2. Frontend (port 3000)
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```
Open http://localhost:3000.

## API
| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | /api/auth/signup | no | Create account, set session cookie |
| POST | /api/auth/login | no | Log in, set session cookie |
| GET | /api/auth/me | yes | Current user |
| POST | /api/auth/logout | yes | Clear session cookie |
| GET | /api/dashboard | yes | KPIs, risky hosts, attack distribution, incidents |

Sessions use a JWT in an httpOnly cookie. For production, set NODE_ENV=production
(secure cookies), set CLIENT_URL to your frontend origin, and use HTTPS.

## Connecting your ML pipeline
The dashboard reads the `hosts` and `incidents` collections. Have your Gold-tier
scoring job write host risk scores and detected incidents into those collections
(see backend/models) and the dashboard updates without code changes.
