# 🚀 Campus Companion Deployment Guide

## Deployment Stack
- **Frontend**: Vercel (React + Vite)
- **Backend**: Railway (Node.js + Express)
- **Database**: MongoDB Atlas (Already configured)

## 📦 Quick Deploy Instructions

### Backend Deployment (Railway)

1. **Sign up for Railway**: https://railway.app/
2. **Connect GitHub**: Link your GitHub account
3. **Create New Project**: 
   - Choose "Deploy from GitHub repo"
   - Select your campus-companion repository
   - Choose the `server` folder as root directory

4. **Environment Variables**: Add these in Railway dashboard:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://sakshya:9971881011aA@@cluster0.nzha7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex_production_2024
   PORT=3001
   CORS_ORIGIN=*
   ```

5. **Deploy**: Railway will automatically build and deploy your backend

### Frontend Deployment (Vercel)

1. **Sign up for Vercel**: https://vercel.com/
2. **Import Project**: 
   - Connect GitHub
   - Import campus-companion repository
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

- **Frontend**: https://campus-companion-xyz.vercel.app
- **Backend**: https://campus-companion-abc.railway.app
- **API**: https://campus-companion-abc.railway.app/api

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

Ready to deploy? Let's make your Campus Companion live! 🚀