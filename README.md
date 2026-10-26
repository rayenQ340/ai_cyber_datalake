# AI Cybersecurity Data Lake

**An AI-assisted Mini-SOC platform.** It turns thousands of raw network alerts into a short, prioritized and explained list of risky hosts.

Big Data & Deep Learning project, TEK-UP University.

---

## Table of contents

1. [The problem](#the-problem)
2. [The solution](#the-solution)
3. [Architecture](#architecture)
4. [Tech stack](#tech-stack)
5. [Project structure](#project-structure)
6. [Getting started](#getting-started)
7. [Environment variables](#environment-variables)
8. [API reference](#api-reference)
9. [Connecting the ML pipeline](#connecting-the-ml-pipeline)
10. [Troubleshooting](#troubleshooting)
11. [Team](#team)

---

## The problem

Modern infrastructures generate huge volumes of security data: network connections, authentications, DNS queries and system logs. Analysts cannot read it all.

> How can we automatically detect known **and** unknown malicious behavior, and turn it into incidents an analyst can act on?

## The solution

A Mini-SOC platform that collects, stores, processes and analyzes security data to detect, correlate and visualize incidents.

| Capability | What it gives the analyst |
|---|---|
| **Centralized events** | One place for all security events |
| **Data lake** | Bronze (raw), Silver (cleaned and normalized), Gold (ready for analysis) tiers |
| **Known attack detection** | XGBoost / LightGBM classification of labeled attacks |
| **Unknown behavior detection** | Autoencoder / Isolation Forest anomaly detection |
| **Host risk score** | Automatic prioritization: what to handle first |
| **Explainable decisions** | The factors that made a host dangerous, so each decision can be justified |

The model work uses the **Suricata alert dataset** (Kaggle): 199,361 records, 9 columns (`Date and Time`, `Sid`, `Msg`, `Class`, `Protocol`, `Origen`, `Dest`, `Port`, `Priority`).

## Architecture

```
Suricata logs (Kaggle)
        |
    Ingestion
        |
   Data Lake:  Bronze  ->  Silver  ->  Gold
        |
 Feature engineering
     /          \
Classification   Anomaly detection
(known attacks)  (unknown behavior)
     \          /
  Host risk score
        |
   SOC dashboard   <-- this web application
```

This repository contains the **web application** (the last block). It reads hosts and incidents from MongoDB and displays them in the dashboard.

```
Browser (Next.js)  <--HTTP + cookie-->  Express API  <-->  MongoDB
   localhost:3000                       localhost:5000
```

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router), React, plain CSS, Canvas animations |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose |
| Auth | JWT stored in an httpOnly cookie, passwords hashed with bcrypt |
| Security middleware | Helmet, CORS (restricted to the frontend origin) |
| Project tooling | Git and GitHub, DVC, MLflow, Docker |

## Project structure

```
.
├── backend/
│   ├── server.js              # Express app and MongoDB connection
│   ├── seed.js                # Loads demo hosts and incidents
│   ├── middleware/auth.js     # Protects routes (checks the session cookie)
│   ├── models/                # User, Host, Incident
│   └── routes/
│       ├── auth.js            # signup, login, me, logout
│       └── dashboard.js       # KPIs, hosts, distribution, incidents
└── frontend/
    ├── app/
    │   ├── page.js            # Home page
    │   ├── login/page.js
    │   ├── signup/page.js
    │   ├── dashboard/page.js
    │   ├── layout.js
    │   └── globals.css
    ├── components/            # Navbar, AuthProvider, NetworkCanvas,
    │                          # LiveFeed, CountUp, Reveal
    └── lib/api.js             # Fetch helper (sends the session cookie)
```

## Getting started

### Prerequisites

- **Node.js 20.9 or newer** (check with `node -v`)
- **MongoDB**, either:
  - installed locally (Community Server), running on `mongodb://127.0.0.1:27017`, or
  - a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (use its connection string)

### 1. Start the backend

```powershell
cd backend
npm install
copy .env.example .env
```

Open `backend/.env` and set `MONGO_URI` and a long random `JWT_SECRET` (see [Environment variables](#environment-variables)). Then:

```powershell
npm run seed     # fills MongoDB with demo hosts and incidents
npm run dev      # API on http://localhost:5000
```

You should see `API running on http://localhost:5000`. Check it at http://localhost:5000/api/health.

### 2. Start the frontend

In a second terminal:

```powershell
cd frontend
npm install
copy .env.local.example .env.local
npm run dev      # app on http://localhost:3000
```

On macOS or Linux, use `cp` instead of `copy`.

### 3. Use the app

1. Open http://localhost:3000.
2. Click **Sign up** and create an account.
3. You land on the **dashboard**: KPIs, hosts ranked by risk score, attack distribution and the latest incidents. It refreshes every 8 seconds.

### Production build

```powershell
cd frontend
npm run build
npm start
```

For production, also set `NODE_ENV=production` on the backend (secure cookies), set `CLIENT_URL` to your real frontend origin, and serve both over HTTPS.

## Environment variables

**`backend/.env`**

| Variable | Example | Description |
|---|---|---|
| `PORT` | `5000` | Port of the API |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/ai_cyber_datalake` | MongoDB connection string |
| `JWT_SECRET` | *(long random string)* | Secret used to sign session tokens. Never commit it. |
| `CLIENT_URL` | `http://localhost:3000` | Frontend origin allowed by CORS |

Generate a secret with: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

**`frontend/.env.local`**

| Variable | Example | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000/api` | Base URL of the API |

## API reference

| Method | Route | Auth | Purpose |
|---|---|---|---|
| `GET` | `/api/health` | no | Check that the API is up |
| `POST` | `/api/auth/signup` | no | Create an account and start a session |
| `POST` | `/api/auth/login` | no | Log in and start a session |
| `GET` | `/api/auth/me` | yes | Get the current user |
| `POST` | `/api/auth/logout` | yes | End the session |
| `GET` | `/api/dashboard` | yes | KPIs, risky hosts, attack distribution, latest incidents |

## Connecting the ML pipeline

The dashboard is driven by two MongoDB collections, so your models can feed it without any frontend change.

**`hosts`**: one document per host, written by the risk scoring step.

```json
{ "ip": "192.168.1.14", "risk": 94, "factors": "Repeated exploit signatures, rare destination ports", "status": "Investigate" }
```

**`incidents`**: one document per detected incident.

```json
{ "src": "192.168.1.14", "dst": "203.0.113.8", "port": 445, "attackClass": "Generic Protocol Command Decode", "detectedBy": "Classifier", "open": true }
```

`detectedBy` is `Classifier` (XGBoost / LightGBM) or `Anomaly model` (Autoencoder / Isolation Forest). The seeded demo data lives in `backend/seed.js`. Replace it by writing your real Gold-tier output into these collections.

## Troubleshooting

**`npm audit` reports vulnerabilities in Next.js.** Upgrade Next and React together, from `frontend/`:
```powershell
npm install next@latest react@latest react-dom@latest
```
Avoid `npm audit fix --force` on its own: it upgrades Next without React.

**The dashboard shows "Check that the API is running and the database is seeded."** Make sure the backend terminal is running, `MONGO_URI` is correct, and you ran `npm run seed`.

**`MongoDB connection failed`.** Start the MongoDB service (or check your Atlas IP allow-list and credentials).

**Login works but you are sent back to the login page.** `CLIENT_URL` in `backend/.env` must exactly match the address in your browser (`http://localhost:3000`), and `NEXT_PUBLIC_API_URL` must point to the API. Restart both servers after changing `.env` files.

**Port already in use.** Change `PORT` in `backend/.env` and update `NEXT_PUBLIC_API_URL` to match.

## Team

- Nawres Ben Mustapha
- Mariem Baalouch
- Rayen Aribi

Presented at TEK-UP University, International Office.
