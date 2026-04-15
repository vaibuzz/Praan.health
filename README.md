# Praan Health – WhatsApp Automation & Booking System

A state-machine-driven WhatsApp onboarding workflow and automated scheduling backend built with FastAPI, Twilio Content Template API, Next.js, and Supabase.

## Architecture

This project consists of two primary components:
1. **FastAPI Backend (Root):** Handles Twilio webhook routing, state-machine tracking (e.g. Welcome -> Series Selection -> Time Selection -> Registered), and automated background push notifications via APScheduler.
2. **Next.js Frontend (`/praan_health_vp`):** A booking modal that collects user information seamlessly, injecting them into the Supabase database and tracking onboarding.

---

## Prerequisites

- **Python 3.10+** (Backend)
- **Node.js 18+** (Frontend)
- **Twilio Account:** Ensure your WhatsApp Sandbox/Production number is configured.
- **Supabase Project:** With `users` and `daily_tracking` tables initialized.

---

## Local Development Setup

### 1. Backend Setup (FastAPI)

1. **Activate the virtual environment:**
   ```powershell
   .\.venv\Scripts\Activate.ps1
   ```
2. **Install requirements:**
   ```powershell
   pip install -r requirements.txt
   ```
3. **Configure Environment:**
   Start by copying the `.env.example` to `.env` in the root folder, and fill in your Supabase credentials and exact Twilio Content Template SIDs (e.g. `HX...`).

4. **Run the Backend:**
   ```powershell
   uvicorn app.main:app --reload
   ```
   *(Runs continuously on `http://localhost:8000`)*

### 2. Frontend Setup (Next.js)

1. **Open a separate terminal and navigate into the frontend:**
   ```powershell
   cd praan_health_vp
   ```
2. **Install Node dependencies:**
   ```powershell
   npm install
   ```
3. **Configure Environment:**
   Ensure `praan_health_vp/.env.local` is mapping your API requests directly to the backend:
   `NEXT_PUBLIC_API_URL=http://localhost:8000`
4. **Run the Frontend:**
   ```powershell
   npm run dev
   ```
   *(Runs continuously on `http://localhost:3000`)*

---

## Production Deployment (Render.com)

The backend is perfectly optimized for a direct deployment on Render using native Python Web Services.

### Deployment Steps
1. Push this repository to GitHub.
2. Log into Render and create a new **Web Service**.
3. Connect the repository.
4. Set the **Build Command** to:
   ```bash
   pip install -r requirements.txt
   ```
5. Set the **Start Command** to:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 10000
   ```
6. Copy every variable from your local `.env` and paste them into Render's **Environment Variables** tab.

**Important Note for the Scheduler**: The backend runs `APScheduler` on an internal 24/7 clock. Because Render's Free Tier spins down servers after 15 minutes of inactivity, the 6:30 AM and 5:00 PM automated messages will fail to trigger if the server is asleep. **Deploying on a paid tier ($7/mo) guarantees the scheduler fires consistently.**

### Post-Deployment Link Swaps

Once your backend is live (e.g. `https://praan-backend.onrender.com`):
1. **Update Twilio:** Log into the Twilio Sandbox / WhatsApp Sender config and update your Webhook URL to:  
   `https://praan-backend.onrender.com/webhook`
2. **Update Frontend:** In your Vercel or Netlify frontend environment variables, set:  
   `NEXT_PUBLIC_API_URL=https://praan-backend.onrender.com`

---

## Modifying WhatsApp Media (Important)

If you ever need to change the embedded images inside the WhatsApp Flow (like the Onboarding Menu image), you **must** use raw payload URLs (e.g., pulling directly from Google Drive, or using a Github "Raw" link `raw.githubusercontent.com/...`). 
Using HTML-wrapped URLs (like standard Github viewer links or `postimg` wrappers) will cause WhatsApp/Meta to instantly drop the entire template in transit.
