# Mobile API Quick Reference

## 🚀 Getting Started

### Base URL
```
/api/mobile/v1
```

### Authentication
All endpoints (except login/register) require:
```
Authorization: Bearer <access_token>
```

## 📝 Quick Start Flow

### 1. Register/Login
```javascript
// Register
POST /auth/register
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "password": "password123"
}

// OR Login
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Response includes tokens
{
  "tokens": {
    "accessToken": "...",
    "refreshToken": "...",
    "expiresIn": 900,
    "tokenType": "Bearer"
  }
}
```

### 2. Use Token in Requests
```javascript
fetch('/api/mobile/v1/user/profile', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
})
```

### 3. Refresh Expired Token
```javascript
POST /auth/refresh
{
  "refreshToken": "..."
}
```

---

## 📚 Endpoint Categories

### 🔐 Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/login` | Login user | ❌ |
| POST | `/auth/register` | Register user | ❌ |
| POST | `/auth/refresh` | Refresh tokens | ❌ |
| POST | `/auth/logout` | Logout | ✅ |
| GET | `/auth/me` | Get current user | ✅ |

### 👤 User Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/profile` | Get user profile |
| PUT | `/user/profile` | Update profile |
| GET | `/user/progress` | Get progress status |

### 📚 Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/courses` | List courses (with filters) |
| GET | `/courses/[id]` | Get course details |
| POST | `/courses/[id]/enroll` | Enroll in course |
| GET | `/courses/enrollments` | Get user enrollments |
| POST | `/courses/lessons/[id]/complete` | Complete lesson |

### 📅 Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/events` | List events |
| GET | `/events/[id]` | Get event details |
| POST | `/events/[id]/register` | Register for event |
| DELETE | `/events/[id]/unregister` | Unregister |
| GET | `/events/my-registrations` | User's registrations |

### 🔔 Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notifications` | List notifications |
| PUT | `/notifications/[id]/read` | Mark as read |
| PUT | `/notifications/mark-all-read` | Mark all as read |
| DELETE | `/notifications/[id]` | Delete notification |

### 🎯 Personal Discovery
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/personal-discovery` | Get data |
| POST | `/personal-discovery` | Create (first time) |
| PUT | `/personal-discovery` | Update |

### 🎓 Scholarship Assessment
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/scholarship-assessment` | Get data |
| POST | `/scholarship-assessment` | Create |
| PUT | `/scholarship-assessment` | Update |

### 📄 CV Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cv` | List CVs |
| GET | `/cv/[id]` | Get CV details |
| DELETE | `/cv/[id]` | Delete CV |
| POST | `/cv/upload-url` | Get upload URL |
| POST | `/cv/confirm-upload` | Confirm upload |

### 💳 Subscriptions & Plans
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/plans` | List plans |
| GET | `/subscriptions` | User subscriptions |
| POST | `/subscriptions/create` | Create subscription |
| GET | `/subscriptions/active` | Active subscription |
| POST | `/payment-proof/upload-url` | Get upload URL |
| POST | `/payment-proof/submit` | Submit payment proof |

### 📖 Resources
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/publications` | List publications |
| GET | `/publications/[id]` | Publication details |
| GET | `/testimonials` | List testimonials |
| GET | `/mentors` | List mentors |
| GET | `/mentors/[id]` | Mentor details |
| GET | `/resources` | Downloadable resources |
| GET | `/categories` | Course categories |

### 💬 Feedback
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/feedback` | Submit feedback |

---

## ⚡ Common Patterns

### Pagination
Most list endpoints support:
```
?page=1&limit=10
```

### Filtering
```
// Courses
?categoryId=xxx&featured=true&level=Beginner

// Events
?upcoming=true

// Notifications
?unread=true

// Subscriptions
?active=true

// Mentors
?expertise=Technology
```

---

## 🚨 Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

### Common Error Codes
- `UNAUTHORIZED` (401) - No token provided
- `TOKEN_EXPIRED` (401) - Access token expired → refresh needed
- `INVALID_TOKEN` (401) - Token invalid/malformed
- `REFRESH_TOKEN_EXPIRED` (401) - Refresh token expired → login required
- `FORBIDDEN` (403) - Access denied
- `NOT_FOUND` (404) - Resource not found
- `VALIDATION_ERROR` (400) - Invalid input
- `DUPLICATE_ERROR` (409) - Resource already exists

### Handle Token Expiration
```javascript
if (response.status === 401) {
  const error = await response.json();
  if (error.error?.code === 'TOKEN_EXPIRED') {
    // Refresh token and retry
    await refreshToken();
    // Retry original request
  }
}
```

---

## 🔒 Security Checklist

- ✅ Store tokens in secure storage (Keychain/Keystore)
- ✅ Include `Authorization: Bearer <token>` header
- ✅ Implement automatic token refresh
- ✅ Clear tokens on logout
- ✅ Never log tokens in production
- ✅ Use HTTPS in production
- ✅ Handle 401 errors gracefully

---

## 📱 File Upload Flow

### For CVs:
1. **Get Upload URL**: `POST /cv/upload-url`
2. **Upload File**: `PUT` to returned `uploadUrl`
3. **Confirm**: `POST /cv/confirm-upload`

### For Payment Proofs:
1. **Get Upload URL**: `POST /payment-proof/upload-url`
2. **Upload File**: `PUT` to returned `uploadUrl`
3. **Submit**: `POST /payment-proof/submit`

---

## 🎯 User Progress Flow

Users must complete steps in order:

1. **PAYMENT_PENDING** → Subscribe to plan
2. **PERSONAL_DISCOVERY_PENDING** → Complete personal discovery
3. **CV_ALIGNMENT_PENDING** → Upload CV
4. **SCHOLARSHIP_MATRIX_PENDING** → Complete scholarship assessment
5. **ESSAYS_PENDING** → Complete essays (future)
6. **COMPLETED** → All done!

Check progress: `GET /user/progress`

---

## 💡 Pro Tips

1. **Token Expiry**: Access tokens expire in 15 minutes - implement auto-refresh
2. **Batch Requests**: Use pagination wisely to avoid large payloads
3. **Filter Smart**: Use query parameters to reduce data transfer
4. **Cache Wisely**: Cache plans, categories, and testimonials (they rarely change)
5. **Error First**: Always handle errors before success cases
6. **Offline Mode**: Store critical data locally for offline access

---

For complete documentation, see [MOBILE_API.md](./MOBILE_API.md)
