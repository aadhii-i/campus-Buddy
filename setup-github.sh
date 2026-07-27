#!/bin/bash

# 🚀 Campus Companion - GitHub Setup and Deployment Commands

echo "🏫 Setting up GitHub repository for Campus Companion..."

# Navigate to project root
cd /c/Users/KIIT0001/Desktop/projects/campus_companion

# Initialize git repository
echo "📦 Initializing Git repository..."
git init

# Add all files
echo "📁 Adding files to Git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "🎉 Initial commit: Campus Companion v1.0

✨ Features implemented:
- Event management with registration system
- User authentication (login/register)
- Lost & found system
- Community discussions
- Placement news
- Resume analyzer
- Real-time filtering and search
- Responsive mobile design
- Production-ready deployment configuration

🛠️ Tech Stack:
- Frontend: React 18 + Vite + Tailwind CSS
- Backend: Node.js + Express + MongoDB
- Deployment: Vercel + Railway ready

🚀 Ready for deployment to production!"

# Set main branch
echo "🌿 Setting main branch..."
git branch -M main

echo ""
echo "✅ Git repository initialized successfully!"
echo ""
echo "🔗 Next steps:"
echo "1. Create repository on GitHub with name 'campus-companion'"
echo "2. Copy the remote URL from GitHub"
echo "3. Run these commands:"
echo ""
echo "   git remote add origin https://github.com/YOURUSERNAME/campus-companion.git"
echo "   git push -u origin main"
echo ""
echo "4. Then deploy to:"
echo "   - Backend: https://railway.app"
echo "   - Frontend: https://vercel.com"
echo ""
echo "📖 See DEPLOYMENT.md for detailed deployment instructions"