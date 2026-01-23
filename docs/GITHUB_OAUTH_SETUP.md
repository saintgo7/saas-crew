# GitHub OAuth Setup Guide

This guide explains how to set up GitHub OAuth authentication for the saas-crew project.

## Overview

The saas-crew application uses GitHub OAuth for user authentication. The authentication flow is:

1. User clicks "Login with GitHub" on the frontend
2. Backend redirects user to GitHub authorization page
3. User authorizes the application on GitHub
4. GitHub redirects back to the callback URL with an authorization code
5. Backend exchanges the code for an access token and retrieves user profile
6. Backend creates/updates user in database and issues a JWT token
7. User is redirected to frontend with the JWT token

## Architecture

```
Frontend (Next.js)          Backend (NestJS)              GitHub
     |                           |                          |
     |------ Login Click ------->|                          |
     |                           |---- Authorization ------>|
     |                           |                          |
     |<------- Redirect ---------|<---- Callback + Code ----|
     |                           |                          |
     |                           |---- Exchange Code ------>|
     |                           |<---- Access Token -------|
     |                           |                          |
     |<-- Redirect + JWT Token --|                          |
```

## Step 1: Create a GitHub OAuth Application

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"OAuth Apps"** in the left sidebar
3. Click **"New OAuth App"** button
4. Fill in the application details:

### Development Environment

| Field | Value |
|-------|-------|
| **Application name** | `saas-crew-dev` (or your preferred name) |
| **Homepage URL** | `http://localhost:3000` |
| **Application description** | Optional description of your app |
| **Authorization callback URL** | `http://localhost:4000/api/auth/github/callback` |

### Production Environment

| Field | Value |
|-------|-------|
| **Application name** | `saas-crew` (or your preferred name) |
| **Homepage URL** | `https://your-domain.com` |
| **Application description** | Optional description of your app |
| **Authorization callback URL** | `https://api.your-domain.com/api/auth/github/callback` |

5. Click **"Register application"**
6. Copy the **Client ID** (displayed on the page)
7. Click **"Generate a new client secret"**
8. Copy the **Client Secret** (only shown once - save it securely)

## Step 2: Configure Environment Variables

### Backend (apps/api/.env)

```bash
# GitHub OAuth Configuration
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GITHUB_CALLBACK_URL="http://localhost:4000/api/auth/github/callback"

# Frontend URL for redirect after authentication
FRONTEND_URL=http://localhost:3000
```

### Frontend (apps/web/.env.local)

```bash
# API URL
NEXT_PUBLIC_API_URL=http://localhost:4000

# If using NextAuth (optional)
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
```

## Step 3: Verify Configuration

### Check Backend OAuth Routes

The backend exposes these authentication endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/github` | Initiates OAuth flow (redirects to GitHub) |
| GET | `/api/auth/github/callback` | OAuth callback handler |
| GET | `/api/auth/me` | Get current authenticated user (requires JWT) |

### Test the OAuth Flow

1. Start the backend server:
   ```bash
   cd apps/api
   npm run start:dev
   ```

2. Start the frontend server:
   ```bash
   cd apps/web
   npm run dev
   ```

3. Open browser and navigate to: `http://localhost:4000/api/auth/github`

4. You should be redirected to GitHub's authorization page

5. After authorizing, you should be redirected to:
   `http://localhost:3000/auth/callback?token=<JWT_TOKEN>`

## Configuration Reference

### GitHub Strategy Configuration (apps/api/src/auth/github.strategy.ts)

```typescript
// Configured OAuth scopes
scope: ['user:email']  // Requests access to user's email

// OAuth credentials from environment
clientID: config.get('GITHUB_CLIENT_ID')
clientSecret: config.get('GITHUB_CLIENT_SECRET')
callbackURL: config.get('GITHUB_CALLBACK_URL')
```

### User Profile Mapping

The GitHub profile is mapped to user data as follows:

| GitHub Field | User Field |
|--------------|------------|
| `profile.id` | `githubId` |
| `profile.username` | `login` (for reference) |
| `profile.displayName` | `name` |
| `profile.emails[0].value` | `email` |
| `profile.photos[0].value` | `avatar` |

## Environment Variables Summary

### Required Variables

| Variable | Environment | Description |
|----------|-------------|-------------|
| `GITHUB_CLIENT_ID` | Backend | OAuth App Client ID |
| `GITHUB_CLIENT_SECRET` | Backend | OAuth App Client Secret |
| `GITHUB_CALLBACK_URL` | Backend | Full callback URL |
| `FRONTEND_URL` | Backend | Frontend URL for redirect |
| `JWT_SECRET` | Backend | Secret for signing JWT tokens |

### Callback URL Format

```
{PROTOCOL}://{API_DOMAIN}/api/auth/github/callback
```

Examples:
- Development: `http://localhost:4000/api/auth/github/callback`
- Staging: `https://api-staging.your-domain.com/api/auth/github/callback`
- Production: `https://api.your-domain.com/api/auth/github/callback`

## Troubleshooting

### Error: "redirect_uri mismatch"

This error occurs when the callback URL in your `.env` file doesn't match the one registered in GitHub OAuth App.

**Solution:**
- Verify the exact callback URL in GitHub OAuth App settings
- Ensure `GITHUB_CALLBACK_URL` in `.env` matches exactly (including protocol and trailing slashes)

### Error: "OAuth App access restrictions"

If using GitHub Organization, the OAuth App might be restricted.

**Solution:**
- Request access from the organization admin
- Or use a personal GitHub account for development

### Error: "Invalid client_id"

**Solution:**
- Double-check the `GITHUB_CLIENT_ID` value
- Ensure there are no extra spaces or quotes
- Verify the OAuth App is not deleted

### No email returned from GitHub

Some GitHub users have their email set to private.

**Current handling:** The system creates a fallback email: `{github_username}@github.local`

### Token not received in frontend

**Check:**
1. `FRONTEND_URL` is correctly set in backend `.env`
2. Frontend has a route handler at `/auth/callback`
3. Browser console for any errors

## Security Best Practices

1. **Never commit secrets**: Keep `.env` files in `.gitignore`
2. **Use different OAuth Apps**: Create separate OAuth Apps for dev/staging/production
3. **Rotate secrets regularly**: Generate new client secrets periodically
4. **Limit scopes**: Only request necessary OAuth scopes (`user:email` is minimal)
5. **Validate state parameter**: (Future enhancement) Add CSRF protection with state parameter

## Production Deployment Checklist

- [ ] Create production GitHub OAuth App
- [ ] Set correct callback URL for production domain
- [ ] Update `GITHUB_CLIENT_ID` in production environment
- [ ] Update `GITHUB_CLIENT_SECRET` in production environment
- [ ] Set `GITHUB_CALLBACK_URL` to production URL
- [ ] Set `FRONTEND_URL` to production frontend URL
- [ ] Generate secure `JWT_SECRET` (use `openssl rand -base64 64`)
- [ ] Verify CORS settings include production frontend domain
- [ ] Test complete OAuth flow in production

## Related Files

- `/apps/api/src/auth/github.strategy.ts` - GitHub OAuth strategy
- `/apps/api/src/auth/auth.controller.ts` - Auth endpoints
- `/apps/api/src/auth/auth.service.ts` - Auth business logic
- `/apps/api/src/auth/auth.module.ts` - Auth module configuration
- `/apps/api/.env.example` - Environment template
- `/apps/web/.env.example` - Frontend environment template
