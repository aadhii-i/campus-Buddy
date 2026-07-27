# 🆓 Free Deployment Guide - Campus Companion

## 🎯 Completely FREE Deployment Options

Your Campus Companion can be deployed 100% FREE using these platforms:

### Option 1: Render + Vercel (Recommended)
- **Backend**: Render (750 hours/month free)
- **Frontend**: Vercel (unlimited personal projects)
- **Database**: MongoDB Atlas (512MB free)

### Option 2: Netlify + Render
- **Backend**: Render (free tier)
- **Frontend**: Netlify (100GB bandwidth/month)

### Option 3: Full Vercel (Serverless)
- **Both**: Vercel (frontend + serverless functions)

---

## 🚀 Deploy to Render + Vercel (FREE)

### Backend: Render

1. **Sign up**: https://render.com (free, no credit card)
2. **New Web Service** → Connect GitHub
3. **Settings**:
   ```
   Repository: sakshyasinha/campus-companion
   Root Directory: server
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Environment Variables**:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://sakshya:9971881011aA@@cluster0.nzha7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=campus_companion_super_secret_production_key_2024
   PORT=10000
   ```

5. **Deploy** → Get URL like: `https://campus-companion.onrender.com`

### Frontend: Vercel

1. **Sign up**: https://vercel.com (free, no credit card)
2. **New Project** → Import from GitHub
3. **Settings**:
   ```
   Repository: sakshyasinha/campus-companion
   Root Directory: client
   Framework: Vite
   ```

4. **Environment Variables**:
   ```
   VITE_API_URL=https://campus-companion.onrender.com/api
   ```

5. **Deploy** → Get URL like: `https://campus-companion.vercel.app`

---

## 🎉 Your App Will Be Live!

**Backend**: `https://campus-companion.onrender.com`
**Frontend**: `https://campus-companion.vercel.app`

### Free Tier Limits:
- **Render**: 750 hours/month (24/7 for 31 days!)
- **Vercel**: Unlimited builds, 100GB bandwidth
- **MongoDB Atlas**: 512MB storage (enough for thousands of events)

---

## 🚨 Important Notes:

1. **Render Sleep**: Free apps sleep after 15 mins of inactivity
   - First request takes 30-60 seconds to wake up
   - Subsequent requests are fast

2. **No Credit Card Required**: Both platforms are genuinely free

3. **Production Ready**: Same infrastructure as paid tiers

---

## 🔄 Alternative: Serverless on Vercel

If you prefer everything on one platform, I can convert your backend to Vercel serverless functions (also free).

Would you like me to set that up instead?

---

## 📞 Need Help?

The deployment process takes about 10 minutes total:
- 5 minutes for Render backend
- 3 minutes for Vercel frontend  
- 2 minutes for testing

Ready to deploy for FREE? 🚀