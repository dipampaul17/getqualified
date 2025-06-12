#!/bin/bash

echo "🚀 Setting up Qualified Development Environment"
echo "================================================"

# Create .env.local file
echo "📝 Creating .env.local file..."
cat > .env.local << 'EOF'
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase (Using placeholders for development)
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder_anon_key_for_development
SUPABASE_SERVICE_ROLE_KEY=placeholder_service_key_for_development

# Stripe (Using placeholders for development)
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_placeholder
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder

# OAuth - All using development mode (empty values trigger mock auth)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
MICROSOFT_TENANT_ID=common

SLACK_CLIENT_ID=
SLACK_CLIENT_SECRET=

# OpenAI (Using placeholder for development)
OPENAI_API_KEY=sk-placeholder-for-development

# Vercel KV (Using placeholders for development)
KV_REST_API_URL=https://placeholder.kv.vercel-storage.com
KV_REST_API_TOKEN=placeholder_token

# Development Mode Flag
NODE_ENV=development
EOF

echo "✅ .env.local created successfully!"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo ""
echo "🎯 Development Setup Complete!"
echo ""
echo "📌 Quick Start Guide:"
echo "-------------------"
echo "1. Run the development server:"
echo "   npm run dev"
echo ""
echo "2. Open http://localhost:3000 in your browser"
echo ""
echo "3. Test authentication:"
echo "   - Email: demo@qualified.com"
echo "   - Password: demo123"
echo "   - Or use any OAuth provider (will use mock data)"
echo ""
echo "4. Test the widget:"
echo "   - Open http://localhost:3000/test-widget.html"
echo "   - Widget should auto-open after 3 seconds"
echo ""
echo "5. Check widget size:"
echo "   npm run widget:size"
echo ""
echo "📊 Dashboard Features to Test:"
echo "- Lead management and AI scoring"
echo "- Widget installation and configuration"
echo "- Analytics and usage tracking"
echo "- Settings and API key management"
echo "- Billing and subscription management"
echo ""
echo "🔧 Development Mode Features:"
echo "- Mock authentication (no real OAuth needed)"
echo "- Mock AI scoring (no OpenAI API needed)"
echo "- Mock payment processing (no Stripe needed)"
echo "- All features work without external services"
echo ""
echo "Happy coding! 🚀" 