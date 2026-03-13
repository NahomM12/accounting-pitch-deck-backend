# OAuth Setup Guide

This guide will help you set up OAuth authentication for your Laravel application using Socialite.

## Environment Variables

Add the following to your `.env` file:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://your-laravel-domain.test/api/oauth/google/callback

# Microsoft OAuth
MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret
MICROSOFT_REDIRECT_URI=http://your-laravel-domain.test/api/oauth/microsoft/callback

# LinkedIn OAuth (optional)
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_REDIRECT_URI=http://your-laravel-domain.test/api/oauth/linkedin/callback

# Frontend URL (for OAuth redirects)
FRONTEND_URL=http://localhost:3000
```

## Setup Instructions

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Go to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth client ID"
5. Select "Web application"
6. Add authorized redirect URI: `http://your-laravel-domain.test/api/oauth/google/callback`
7. Copy Client ID and Client Secret to your `.env` file

### 2. Microsoft OAuth Setup

1. Go to [Microsoft Azure Portal](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps)
2. Click "New registration"
3. Fill in application details:
   - Name: Your App Name
   - Supported account types: "Accounts in any organizational directory (Any Azure AD directory - Multitenant) and personal Microsoft accounts"
4. Under "Redirect URI", select "Web" and add: `http://your-laravel-domain.test/api/oauth/microsoft/callback`
5. Go to "Certificates & secrets" → "New client secret"
6. Copy the Application (client) ID and client secret to your `.env` file

### 3. LinkedIn OAuth Setup (Optional)

1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps/new)
2. Create a new application
3. Add redirect URL: `http://your-laravel-domain.test/api/oauth/linkedin/callback`
4. Copy Client ID and Client Secret to your `.env` file

## Database Migration

The OAuth fields have been added to your users table via migration. Make sure to run:

```bash
php artisan migrate
```

## Frontend Configuration

The frontend is already configured to work with OAuth. The OAuth buttons have been added to both login and signup pages.

## OAuth Flow

1. User clicks "Continue with Google/Microsoft" button
2. User is redirected to OAuth provider
3. User authenticates with provider
4. Provider redirects back to Laravel callback URL
5. Laravel creates/updates user and generates token
6. User is redirected to frontend callback page with token
7. Frontend stores token and redirects to appropriate page

## Testing

1. Start your Laravel server: `php artisan serve`
2. Start your Next.js frontend: `npm run dev`
3. Navigate to `/login` or `/signup`
4. Click on OAuth buttons to test the flow

## Notes

- OAuth users are automatically assigned "investors" role
- Existing users can link their OAuth accounts by logging in with OAuth
- The system supports both login and signup via OAuth
- All OAuth authentication uses stateless mode for API compatibility
