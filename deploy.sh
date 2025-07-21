#!/bin/bash

# Deploy RetroWin to Vercel
echo "🚀 Deploying RetroWin to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Deploy to production
echo "📦 Starting deployment..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your site should be live at your Vercel URL"
