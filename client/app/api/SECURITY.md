# API Security Guide

## Overview

The API is now secured with:
- **API Key Authentication** for write operations (POST/PUT/DELETE)
- **Rate Limiting** for all endpoints
- **Service Role Key** stays server-side only (never exposed to clients)

## Environment Variables

Add these to your `.env.local`:

```env
# Required: API key for authenticated requests
API_KEY=your-secure-random-api-key-here

# Required: Supabase service role key (keep secret!)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Already configured
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Generating a Secure API Key

```bash
# Using OpenSSL
openssl rand -hex 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Usage

### Public Endpoints (GET)

Public endpoints are rate-limited but don't require authentication:

```bash
# Example: Get contest
curl https://your-domain.com/api/contests/1

# Example: Get problem
curl https://your-domain.com/api/problems/1
```

**Rate Limits:**
- 100 requests per 15 minutes per IP address

### Protected Endpoints (POST/PUT/DELETE)

All write operations require an API key in the `x-api-key` header:

```bash
# Example: Create a contest
curl -X POST https://your-domain.com/api/contests \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key-here" \
  -d '{"name": "Math Contest", "start_date": "2024-01-01"}'

# Example: Create a problem
curl -X POST https://your-domain.com/api/problems \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key-here" \
  -d '{"name": "Problem 1", "description": "Solve $x^2 = 4$"}'
```

**Rate Limits (Authenticated):**
- 1000 requests per 15 minutes per API key

### Python Example

```python
import requests

API_KEY = "your-api-key-here"
BASE_URL = "https://your-domain.com/api"

# Create a problem
response = requests.post(
    f"{BASE_URL}/problems",
    json={
        "name": "Problem 1",
        "description": "Solve the equation: $x^2 + y^2 = r^2$"
    },
    headers={
        "x-api-key": API_KEY,
        "Content-Type": "application/json"
    }
)

if response.status_code == 201:
    print("Problem created:", response.json())
else:
    print("Error:", response.json())
```

### JavaScript/TypeScript Example

```typescript
const API_KEY = "your-api-key-here";
const BASE_URL = "https://your-domain.com/api";

// Create a contest
const response = await fetch(`${BASE_URL}/contests`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
  },
  body: JSON.stringify({
    name: "Math Contest",
    start_date: "2024-01-01",
  }),
});

if (response.ok) {
  const data = await response.json();
  console.log("Contest created:", data);
} else {
  const error = await response.json();
  console.error("Error:", error);
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized: Invalid or missing API key"
}
```

### 429 Too Many Requests
```json
{
  "error": "Too many requests",
  "retryAfter": 450
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Detailed error message"
}
```

## Security Best Practices

1. **Never commit API keys to git** - Use `.env.local` (already in `.gitignore`)
2. **Rotate API keys regularly** - If a key is compromised, generate a new one
3. **Use different keys for different environments** - Dev, staging, production
4. **Service role key is secret** - Only used server-side, never exposed to clients
5. **Rate limiting is per IP/API key** - Consider implementing Redis for production scaling

## Production Considerations

For production, consider:
- Using Redis for distributed rate limiting across multiple servers
- Implementing API key rotation mechanisms
- Adding request logging and monitoring
- Setting up alerts for rate limit violations
- Using environment-specific API keys

