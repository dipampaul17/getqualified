# Environment Setup Guide

## Required Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```bash
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase (Optional for development)
NEXT_PUBLIC_SUPABASE_URL=placeholder
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder
SUPABASE_SERVICE_ROLE_KEY=placeholder

# Stripe (Optional for development)
STRIPE_SECRET_KEY=placeholder
STRIPE_WEBHOOK_SECRET=placeholder
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=placeholder

# OAuth - Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# OAuth - GitHub  
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# OAuth - Microsoft
MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
MICROSOFT_TENANT_ID=common

# OAuth - Slack
SLACK_CLIENT_ID=
SLACK_CLIENT_SECRET=
```

## OAuth Provider Setup

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure OAuth consent screen
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)
7. Copy Client ID and Client Secret to your `.env.local`

### GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: Qualify.ai
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/github/callback`
4. Copy Client ID and Client Secret to your `.env.local`

### Microsoft OAuth Setup

1. Go to [Azure Portal](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade)
2. Click "New registration"
3. Fill in:
   - **Name**: Qualify.ai
   - **Supported account types**: Accounts in any organizational directory and personal Microsoft accounts
   - **Redirect URI**: Web → `http://localhost:3000/api/auth/microsoft/callback`
4. Go to "Certificates & secrets" → "New client secret"
5. Copy Application (client) ID and Client Secret to your `.env.local`

### Slack OAuth Setup

1. Go to [Slack API Apps](https://api.slack.com/apps)
2. Click "Create New App" → "From scratch"
3. Fill in:
   - **App Name**: Qualify.ai
   - **Development Slack Workspace**: Choose your workspace
4. Go to "OAuth & Permissions"
5. Add Redirect URLs:
   - `http://localhost:3000/api/auth/slack/callback`
6. Add OAuth Scopes:
   - `openid`
   - `email` 
   - `profile`
   - `identity.basic`
   - `identity.email`
   - `identity.avatar`
7. Copy Client ID and Client Secret to your `.env.local`

## Development Mode

**For quick testing without OAuth setup**, the app works in development mode with these credentials:

- **Email**: `demo@qualify.ai`
- **Password**: `demo123`

All OAuth buttons will redirect to the dashboard with mock user data when OAuth environment variables are not configured.

## Production Setup

For production deployment:

1. Set `NEXT_PUBLIC_APP_URL` to your production domain
2. Update all OAuth redirect URIs to use your production domain
3. Set up proper Supabase and Stripe keys
4. Ensure all environment variables are configured in your deployment platform (Vercel, etc.)

## Security Notes

- Never commit `.env*` files to version control
- Use different OAuth apps for development and production
- Rotate secrets regularly
- Use HTTPS in production for all OAuth callbacks 