#!/bin/bash
echo "💥 NUKING PREVIOUS BUILDS..."
rm -rf apps/desktop/dist
rm -rf apps/desktop/src-tauri/target
rm -rf apps/desktop/node_modules
rm -rf node_modules

echo "📦 REINSTALLING DEPENDENCIES..."
npm install

echo "🔑 INJECTING MOCK SECRETS (For Local UI Verification)..."
export VITE_FIREBASE_API_KEY="mock_key"
export VITE_FIREBASE_PROJECT_ID="mock_project"
export VITE_FIREBASE_AUTH_DOMAIN="mock_domain"
export VITE_FIREBASE_APP_ID="mock_app_id"
export VITE_FIREBASE_STORAGE_BUCKET="mock_bucket"
export VITE_FIREBASE_MESSAGING_SENDER_ID="mock_sender"

echo "🎨 BUILDING FRONTEND..."
# Passing strict=false or just relying on the mocked exports
npm run build --workspace=@typingpro/desktop

echo "🦀 BUILDING TAURI APP..."
npm run tauri --workspace=@typingpro/desktop build

echo "✅ DONE! Check apps/desktop/src-tauri/target/release/bundle/dmg"
