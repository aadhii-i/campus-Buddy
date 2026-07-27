#!/bin/bash

# 🚀 Campus Companion - One-Click Deployment Script

echo "🏫 Campus Companion Deployment Script"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "DEPLOYMENT.md" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📦 Building frontend..."
cd client
npm install
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

echo "✅ Frontend built successfully!"

cd ../server
echo "🔧 Installing backend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Backend dependencies installation failed"
    exit 1
fi

echo "✅ Backend dependencies installed!"


echo ""
echo "🚀 Deploying frontend to GitHub Pages (gh-pages branch)..."
cd ../client
git show-ref --verify --quiet refs/heads/gh-pages || git checkout --orphan gh-pages
git --work-tree dist add --all
git --work-tree dist commit -m 'Deploy to GitHub Pages'
git push origin gh-pages --force
git checkout main
echo "✅ Deployment complete!"
echo "Go to your repo settings and set GitHub Pages source to the gh-pages branch."