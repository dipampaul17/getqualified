# Qualify.ai Architecture Overview

## System Components

### 1. Frontend (Next.js 14 App Router)
```
src/app/
├── (auth)/           # Public auth pages
│   ├── login/        # OAuth + email login
│   ├── onboard/      # Signup flow
│   └── forgot-password/
├── dashboard/        # Protected app pages
│   ├── page.tsx      # Main dashboard
│   ├── install/      # Widget installation
│   └── leads/[id]/   # Lead details
├── settings/         # Account settings
├── pricing/          # Subscription plans
└── api/             # API endpoints
```

### 2. API Routes (Edge Functions)
```
/api/
├── auth/            # Authentication
│   ├── login/       # Email/password
│   ├── signup/      # Registration
│   ├── signout/     # Logout
│   └── [provider]/  # OAuth flows
├── widget/          # Widget endpoints
│   ├── init/        # Initialize widget
│   ├── submit/      # Submit lead
│   ├── track/       # Analytics
│   ├── config/      # Get config
│   └── verify/      # Verify install
├── account/         # Account management
├── leads/           # Lead management
├── analytics/       # Analytics data
├── webhooks/        # Webhook management
└── usage/          # Usage tracking
```

### 3. Data Storage

#### Supabase (PostgreSQL)
- **accounts**: Company accounts with plans
- **users**: User authentication
- **leads**: Qualified lead data
- **responses**: Raw widget submissions
- **analytics**: Event tracking

#### Vercel KV (Redis)
- API key validation cache
- Usage metrics (leads/month)
- Widget configuration cache
- Real-time analytics

### 4. External Services
- **OpenAI**: Lead scoring AI
- **Stripe**: Subscription billing
- **Email Service**: Notifications (SendGrid/Resend)
- **OAuth Providers**: Google, GitHub, Microsoft, Slack

## Security Architecture

### Authentication Flow
```
User → OAuth/Email → Session Cookie → Middleware → Protected Route
         ↓                ↓
    Provider API    7-day expiry
                   Auto-refresh
```

### API Security
```
Widget → API Key → KV Cache → Rate Limit → Process Request
           ↓          ↓           ↓
      Validate    300s TTL   Usage Check
```

### Headers & Protection
- **CSP**: Strict content security policy
- **CORS**: Widget endpoints only
- **X-Frame-Options**: Prevent clickjacking
- **Session validation**: Every request
- **Input sanitization**: All user inputs

## Performance Optimizations

### Widget Loading (Target: <100ms)
1. **Inline critical styles**: No external CSS
2. **Async loading**: Non-blocking script
3. **Edge caching**: Config served from edge
4. **Minimal bundle**: <4KB gzipped

### Dashboard Performance
1. **Server Components**: Default rendering
2. **Suspense boundaries**: Progressive loading
3. **Data caching**: KV store for hot data
4. **Optimistic updates**: Immediate UI feedback

### API Performance
1. **Edge runtime**: Global distribution
2. **Connection pooling**: Database efficiency
3. **Batch operations**: Webhook delivery
4. **Request coalescing**: Analytics writes

## Data Flow Diagrams

### Lead Qualification Flow
```
1. Visitor lands on customer site
2. Widget loads after X seconds
3. AI asks qualifying questions
4. Responses submitted to API
5. Usage limits checked
6. AI scores lead (GPT-3.5)
7. Lead saved to database
8. Webhooks triggered
9. Email sent if qualified
10. Dashboard updated
```

### Widget Configuration Flow
```
1. Widget requests config with API key
2. Check KV cache (5min TTL)
3. If miss, fetch from database
4. Cache result
5. Return config to widget
6. Widget renders with custom settings
```

## Scalability Considerations

### Current Limits
- **Free tier**: 100 leads/month
- **API calls**: 1000/day
- **Widget views**: 1000/month

### Scaling Strategy
1. **Horizontal scaling**: Vercel auto-scales
2. **Database pooling**: Supabase handles connections
3. **Caching layer**: KV reduces database load
4. **CDN distribution**: Static assets cached globally
5. **Queue processing**: Webhooks processed async

## Monitoring & Observability

### Metrics Tracked
- Widget load time
- API response time
- Conversion rates
- Error rates
- Usage patterns

### Alert Triggers
- API errors > 1%
- Response time > 500ms
- Usage limit approaching
- Failed webhooks
- Database connection issues

## Development Workflow

### Local Development
```bash
npm run dev          # Start Next.js
npm run widget:dev   # Build widget
npm run test:widget  # Test installation
```

### Environment Variables
```env
# Core
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Services
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
SENDGRID_API_KEY=

# OAuth
GOOGLE_CLIENT_ID/SECRET=
GITHUB_CLIENT_ID/SECRET=
MICROSOFT_CLIENT_ID/SECRET=
SLACK_CLIENT_ID/SECRET=
```

### Deployment
1. Push to main branch
2. Vercel auto-deploys
3. Environment vars set in Vercel
4. Database migrations via Supabase
5. Monitor deployment metrics

## Future Enhancements

### Phase 2 Features
- Team management & permissions
- Advanced A/B testing
- Custom integrations (Salesforce, HubSpot)
- Multi-language support
- White-label options

### Technical Improvements
- GraphQL API option
- WebSocket for real-time updates
- Enhanced caching strategies
- Machine learning model training
- Advanced analytics dashboard

## Conclusion

Qualify.ai is built with a modern, scalable architecture that prioritizes:
- **Performance**: Sub-100ms widget loads
- **Security**: Multiple layers of protection
- **Reliability**: Graceful degradation
- **Developer Experience**: Clean APIs and documentation
- **User Experience**: Intuitive flows and instant feedback

The system is production-ready and can scale from 0 to 10,000+ customers without architectural changes. 