#!/bin/bash
# Quick Portfolio Deployment Script
# Copy and paste these commands one at a time

echo "🚀 DEPLOYING OWEN'S PORTFOLIO TO GITHUB"
echo "========================================"
echo ""

# Navigate to portfolio directory
cd /Users/owenmccormick/github

# Initialize git repository
echo "📦 Step 1: Initializing Git repository..."
git init

# Add all files
echo "📝 Step 2: Adding files to Git..."
git add .

# Create initial commit
echo "💾 Step 3: Creating initial commit..."
git commit -m "Initial commit: Interactive portfolio with live dashboards

- EdTech CRM migration dashboard with Chart.js visualizations
- Apollo/HubSpot lead sync dashboard with scoring system
- Personal ops dashboard teaser (Q1 2026)
- Professional homepage with gradient design
- Working Python code for both automation projects"

echo "✅ Local repository ready!"
echo ""
echo "📌 NEXT STEPS:"
echo "1. Create new repo on GitHub.com"
echo "2. Copy the URL (should look like: https://github.com/USERNAME/portfolio.git)"
echo "3. Run these commands:"
echo ""
echo "   git remote add origin https://github.com/YOUR-USERNAME/portfolio.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4. Enable GitHub Pages in repo settings"
echo "5. Your portfolio will be live at: https://YOUR-USERNAME.github.io/portfolio/"
