# Qualified End-to-End Testing Guide

## 🚀 Quick Start

Your development environment is set up and ready! The application has been successfully built.

```bash
# If the server isn't running, start it:
npm run dev

# The application will be available at:
http://localhost:3000
```

## 📋 Complete Testing Flow

### 1. Landing Page
- Visit http://localhost:3000
- Verify the landing page loads with:
  - Hero section with "Know which leads are worth your time"
  - Feature sections
  - Demo widget button in bottom-right corner

### 2. Authentication Testing

#### Email Authentication
- Click "Sign in" in the navigation
- Test with demo credentials:
  - Email: `demo@qualified.com`
  - Password: `demo123`

#### OAuth Authentication (Development Mode)
- All OAuth buttons (Google, GitHub, Microsoft, Slack) work in development
- They will redirect directly to the dashboard with mock user data
- No real OAuth configuration needed for testing

#### New User Registration
- Click "Get started" on the landing page
- Fill in the onboarding form:
  - Company name
  - Your name
  - Email (any email works in dev mode)
  - Password
- Click "Create account"

### 3. Dashboard Testing

Once logged in, test these features:

#### Overview Page
- View mock analytics data
- Check lead statistics
- Test date range filters

#### Lead Management
- Click on "Leads" in the sidebar
- View mock lead data
- Click on any lead to see detailed view
- Test lead status updates (Qualified/Not Qualified/Pending)
- Try the export functionality

#### Widget Installation
- Click "Install Widget" in the sidebar
- Copy the installation code
- View the installation guide
- Test the verification flow

#### Settings
- Navigate to Settings
- Test API key regeneration
- Update company information
- View current plan details

### 4. Widget Testing

#### Test Page Method
1. Open http://localhost:3000/test-widget.html
2. The widget should auto-open after 3 seconds
3. Answer the qualification questions
4. Submit and see the AI scoring result

#### Manual Installation Method
1. Create a test HTML file with the widget code from your dashboard
2. Replace the API key with your test key
3. Open the HTML file in a browser
4. Test the widget flow

### 5. API Testing

Test the widget API endpoints directly:

```bash
# Initialize widget
curl -X POST http://localhost:3000/api/widget/init \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "pk_test_12345678901234567890",
    "visitorId": "test-visitor-123",
    "pageUrl": "http://test.com"
  }'

# Submit responses
curl -X POST http://localhost:3000/api/widget/submit \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "pk_test_12345678901234567890",
    "visitorId": "test-visitor-123",
    "sessionId": "test-session",
    "pageUrl": "http://test.com",
    "answers": [
      {
        "questionId": "use_case",
        "question": "What challenge are you solving?",
        "answer": "Lead qualification automation"
      }
    ],
    "totalTime": 15000
  }'

# Track events
curl -X POST http://localhost:3000/api/widget/track \
  -H "Content-Type: application/json" \
  -d '{
    "apiKey": "pk_test_12345678901234567890",
    "visitorId": "test-visitor-123",
    "eventType": "widget_opened",
    "pageUrl": "http://test.com"
  }'
```

### 6. Usage Limits Testing

The system enforces usage limits even in development:
- Free plan: 100 leads/month
- Test hitting the limit by submitting multiple widget responses
- Check the usage statistics in Settings

### 7. Mobile Testing

Test on mobile devices or using browser dev tools:
1. Open Chrome DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test on various device sizes
4. Verify widget works on all screen sizes

### 8. Browser Compatibility

Test in multiple browsers:
- Chrome
- Firefox
- Safari
- Edge
- Mobile browsers

## 🔧 Development Features

### Mock Data
- All data is mocked in development mode
- No real database connections needed
- AI scoring returns random scores between 0.6-1.0

### Hot Reload
- Changes to code automatically reload
- No need to restart the server

### Error States
- Try invalid API keys to test error handling
- Submit incomplete forms to test validation
- Test network errors by going offline

## 📊 Performance Testing

### Widget Performance
```bash
# Check widget size (should be <4KB gzipped)
npm run widget:size
```

### Build Analysis
```bash
# Analyze bundle sizes
npm run build
```

## 🐛 Troubleshooting

### Server won't start
```bash
# Kill existing processes
lsof -ti:3000 | xargs kill -9

# Restart
npm run dev
```

### Environment issues
```bash
# Regenerate environment file
./setup-dev.sh
```

### Clear development data
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## 🎯 What to Look For

### Success Indicators
- ✅ All pages load without errors
- ✅ Authentication works (both email and OAuth)
- ✅ Widget appears and captures leads
- ✅ Lead data shows in dashboard
- ✅ API keys can be regenerated
- ✅ Export functionality works
- ✅ Mobile responsive design
- ✅ Fast page loads (<1s)

### Known Development Limitations
- Email notifications don't actually send
- Stripe payments are mocked
- OAuth uses mock authentication
- AI scoring is randomized
- Webhooks don't trigger external services

## 🚢 Next Steps

Once testing is complete:

1. **Production Setup**
   - Configure real Supabase database
   - Set up Stripe account
   - Configure OAuth providers
   - Set up Vercel KV for caching
   - Add OpenAI API key for real AI scoring

2. **Deployment**
   - Push to GitHub
   - Connect to Vercel
   - Configure environment variables
   - Deploy to production

3. **Monitoring**
   - Set up error tracking
   - Configure analytics
   - Monitor performance
   - Track usage metrics

Happy testing! 🎉 