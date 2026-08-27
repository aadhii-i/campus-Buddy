# 🚀 Campus Buddy Deployment Guide

## Deployment Stack
- **Frontend**: Vercel (React + Vite)
- **Backend**: Railway / Render (Node.js + Express)
- **AI service**: Render (Python + FastAPI, folder `ai/`) — powers the Resume Analyzer + Resume Chat
- **Database**: MongoDB Atlas (bring your own free cluster at https://cloud.mongodb.com)

## AI Service (Resume Analyzer) — Render

The Express backend does not analyze resumes itself; it forwards them to the
Python/FastAPI service in `ai/`. If that service is not deployed (or Express's
`AI_SERVICE_URL` is wrong) the Resume Analyzer shows
*"The AI service is currently unavailable."*

**Deploy it (Render → New → Blueprint, or a manual Web Service):**

| Setting | Value |
|---|---|
| Root Directory | `ai` |
| Runtime | Python 3 (`runtime.txt` pins 3.11.9) |
| Build Command | `pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt` (requirements.txt pins the CPU build of `torch==2.9.0`) |
| Start Command | `uvicorn app:app --host 0.0.0.0 --port $PORT` |
| Health Check Path | `/health` |
| Instance type | `Starter` is enough for analysis; use `Standard` (2 GB) for reliable Resume **Chat** (embeddings load ~700 MB) |

**Environment variables (AI service):**
```
GEMINI_API_KEY=<from https://aistudio.google.com/app/apikey>   # server-side secret, never in the frontend
GEMINI_MODEL=gemini-1.5-flash
EMBEDDING_MODEL=all-MiniLM-L6-v2
ALLOWED_ORIGINS=https://<your-frontend-domain>,http://localhost:3000,http://localhost:5173
PYTHON_VERSION=3.11.9
```

**Then point the backend at it** — set on the Express service:
```
AI_SERVICE_URL=https://campus-buddy-ai.onrender.com     # NO trailing slash, NO /api suffix
```
Verify: `curl https://campus-buddy-ai.onrender.com/health` → `{"status":"ok",...}`
and `curl https://<backend>/api/resume/ai-health` → shows the resolved `aiServiceUrl` + `geminiConfigured`.

> **Environment variables**: the full, authoritative list of variables each service needs lives in
> [`server/.env.example`](server/.env.example) and [`client/.env.example`](client/.env.example).
> Copy those to `.env`, fill in your own credentials, and never commit the real `.env` file.
> The snippets below show only the subset relevant to each host's dashboard.

## 📦 Quick Deploy Instructions

### Backend Deployment (Railway)

1. **Sign up for Railway**: https://railway.app/
2. **Connect GitHub**: Link your GitHub account
3. **Create New Project**: 
   - Choose "Deploy from GitHub repo"
   - Select your campus-buddy repository
   - Choose the `server` folder as root directory

4. **Environment Variables**: Add these in Railway dashboard:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://<db_user>:<db_password>@<cluster>.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=<generate-your-own-long-random-secret>
   PORT=3001
   CORS_ORIGIN=*
   ```

5. **Deploy**: Railway will automatically build and deploy your backend

### Frontend Deployment (Vercel)

1. **Sign up for Vercel**: https://vercel.com/
2. **Import Project**: 
   - Connect GitHub
   - Import campus-buddy repository
   - Set root directory to `client`
   - Framework preset: Vite

3. **Environment Variables**: Add in Vercel dashboard:
   ```
   VITE_API_URL=https://your-railway-backend-url.railway.app/api
   VITE_NODE_ENV=production
   ```

4. **Deploy**: Vercel will automatically build and deploy

## 🔧 Manual Deployment Steps

### Step 1: Build Frontend
```bash
cd client
npm install
npm run build
```

### Step 2: Test Backend Locally
```bash
cd server
npm install
npm start
```

### Step 3: Deploy Backend to Railway

1. Push code to GitHub
2. Create Railway project
3. Connect to GitHub repo
4. Set environment variables
5. Deploy automatically

### Step 4: Deploy Frontend to Vercel

1. Create Vercel project
2. Import from GitHub
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

## 🌐 Alternative: Netlify + Render

### Backend on Render
1. Sign up: https://render.com/
2. Create Web Service
3. Connect GitHub repo (server folder)
4. Set environment variables
5. Deploy

### Frontend on Netlify
1. Sign up: https://netlify.com/
2. Deploy from GitHub
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

## 📋 Pre-deployment Checklist

- [ ] MongoDB connection string is correct
- [ ] All environment variables are set
- [ ] Frontend API URL points to deployed backend
- [ ] CORS is configured for production domains
- [ ] Build scripts work locally
- [ ] No hardcoded localhost URLs in code

## 🔗 Expected URLs After Deployment

- **Frontend**: https://campus-buddy-xyz.vercel.app
- **Backend**: https://campus-buddy-abc.railway.app
- **API**: https://campus-buddy-abc.railway.app/api

## 🛠️ Troubleshooting

### Common Issues:
1. **CORS errors**: Update CORS_ORIGIN in backend environment
2. **API not found**: Check VITE_API_URL in frontend environment
3. **Build fails**: Ensure all dependencies are in package.json
4. **MongoDB connection**: Verify connection string and IP whitelist

### Debug Steps:
1. Check deployment logs
2. Verify environment variables
3. Test API endpoints manually
4. Check browser developer console

## 📱 Mobile & SEO Optimization

The app is already optimized for:
- ✅ Mobile responsive design
- ✅ Fast loading with Vite
- ✅ PWA-ready structure
- ✅ SEO-friendly routing

---

Ready to deploy? Let's make your Campus Buddy live! 🚀