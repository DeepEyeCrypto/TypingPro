#!/bin/bash

# --- SPATIAL FITNESS UI: WORLD DEPLOYMENT SCRIPT ---
# 🌍 Preparing the local environment for Production Build.

echo "🚀 Starting Production Build for Fitness UI..."

# Ensure we are in the right directory
cd "$(dirname "$0")"

# 1. Clean previous builds
echo "🧹 Cleaning dist folder..."
rm -rf dist

# 2. Install dependencies (Clean Install)
echo "📦 Installing fresh dependencies..."
npm install

# 3. Build for Production
echo "🏗️  Building production bundle..."
npm run build

# 4. Final Verification
if [ -d "dist" ]; then
    echo "✅ Build Successful! Production files are in apps/fitness-ui/dist"
    echo "💡 You can now deploy this folder to Vercel, Netlify, or GitHub Pages."
else
    echo "❌ Build Failed. Please check the logs above."
    exit 1
fi
