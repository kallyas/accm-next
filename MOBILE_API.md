# Pearl Hub Mobile API Documentation

## Base URL
```
https://your-domain.com/api/mobile/v1
```

## 🔒 Authentication Required

**IMPORTANT:** All API endpoints (except `/auth/login` and `/auth/register`) require JWT token authentication via the Authorization header:

```
Authorization: Bearer <your_access_token>
```

Without this header, you will receive a `401 Unauthorized` response.

## Response Format

All API responses follow a consistent format:

```json
{
  "success": boolean,
  "data": {},
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  },
  "meta": {
    "page": number,
    "limit": number,
    "total": number,
    "timestamp": "string"
  }
}
```

## Authentication

The API uses **JWT (JSON Web Token)** authentication for secure access.

### Authentication Flow

1. **Login/Register** - Receive `accessToken` and `refreshToken`
2. **Include Token** - Add `Authorization: Bearer <accessToken>` header to all requests
3. **Token Refresh** - When access token expires (15 min), use refresh token to get new tokens
4. **Logout** - Remove tokens from client storage

### Token Types

- **Access Token**: Short-lived (15 minutes) - used for API requests
- **Refresh Token**: Long-lived (7 days) - used to obtain new access tokens

### Authorization Header Format

```
Authorization: Bearer <your_access_token>
```

### Token Expiration Handling

When you receive a `401` error with code `TOKEN_EXPIRED`:
1. Use the refresh token endpoint to get new tokens
2. Retry the original request with the new access token
3. If refresh fails, redirect user to login

## Error Codes

- `UNAUTHORIZED` (401) - Authentication required
- `TOKEN_EXPIRED` (401) - Access token has expired, refresh needed
- `INVALID_TOKEN` (401) - Token is invalid or malformed
- `REFRESH_TOKEN_EXPIRED` (401) - Refresh token expired, login required
- `FORBIDDEN` (403) - Access denied
- `NOT_FOUND` (404) - Resource not found
- `VALIDATION_ERROR` (400) - Invalid input
- `DUPLICATE_ERROR` (409) - Resource already exists
- `INTERNAL_ERROR` (500) - Server error

---

## Authentication Endpoints

### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "role": "USER",
      "progressStatus": "string",
      "profile": {},
      "subscriptions": []
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900,
      "tokenType": "Bearer"
    },
    "message": "Login successful"
  }
}
```

**Important**: Store both tokens securely on the client:
- `accessToken` - Use in Authorization header for all API requests
- `refreshToken` - Use to obtain new tokens when access token expires

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "gender": "MALE",
  "country": "Kenya",
  "educationLevel": "Bachelor's"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900,
      "tokenType": "Bearer"
    },
    "message": "Registration successful"
  }
}
```

### POST /auth/refresh
Refresh expired access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900,
      "tokenType": "Bearer"
    },
    "message": "Tokens refreshed successfully"
  }
}
```

### POST /auth/logout
Logout (client should delete stored tokens).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully. Please remove tokens from client."
  }
}
```

### GET /auth/me
Get current authenticated user information.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "profile": {},
      "subscriptions": [],
      "personalDiscovery": {},
      "scholarshipAssessment": {},
      "cvs": [],
      "notifications": []
    }
  }
}
```

---

## User Profile Endpoints

### GET /user/profile
Get user profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "profile": {
        "bio": "string",
        "avatar": "string",
        "phoneNumber": "string",
        "address": "string"
      }
    }
  }
}
```

### PUT /user/profile
Update user profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "gender": "MALE",
  "country": "Kenya",
  "bio": "Software developer",
  "phoneNumber": "+1234567890",
  "address": "Nairobi, Kenya"
}
```

### GET /user/progress
Get user progress status and next steps.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "progressStatus": "PAYMENT_PENDING",
    "progressPercentage": 0,
    "nextSteps": [
      {
        "step": "subscription",
        "title": "Complete Payment",
        "description": "Subscribe to a plan to access all features",
        "required": true
      }
    ],
    "completedSteps": {
      "hasSubscription": false,
      "hasPersonalDiscovery": false,
      "hasCv": false,
      "hasScholarshipAssessment": false
    }
  }
}
```

---

## Courses Endpoints

**Note:** All course endpoints require authentication.

### GET /courses
List all courses with optional filters.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 10, max: 100)
- `categoryId` (string) - Filter by category
- `featured` (boolean) - Show only featured courses
- `level` (string) - Filter by difficulty level

**Response:**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "string",
        "title": "string",
        "subtitle": "string",
        "description": "string",
        "duration": 120,
        "level": "Beginner",
        "category": {},
        "learningObjectives": [],
        "lessons": [],
        "enrollments": []
      }
    ]
  },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50
  }
}
```

### GET /courses/[id]
Get course details by ID.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "course": {
      "id": "string",
      "title": "string",
      "description": "string",
      "lessons": [],
      "enrollments": [
        {
          "progress": 50,
          "completedLessons": []
        }
      ]
    }
  }
}
```

### POST /courses/[id]/enroll
Enroll in a course.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "enrollment": {},
    "message": "Successfully enrolled in course"
  }
}
```

### GET /courses/enrollments
Get user's course enrollments.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (number)
- `limit` (number)

### POST /courses/lessons/[id]/complete
Mark a lesson as completed.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "enrollment": {
      "progress": 75,
      "completedLessons": []
    },
    "message": "Lesson completed successfully"
  }
}
```

---

## Events Endpoints

**Note:** All event endpoints require authentication.

### GET /events
List all events.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (number)
- `limit` (number)
- `upcoming` (boolean) - Show only upcoming events
- `past` (boolean) - Show only past events

**Response:**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "startDate": "2025-01-01T00:00:00Z",
        "endDate": "2025-01-01T00:00:00Z",
        "location": "string",
        "bannerUrl": "string",
        "isRegistered": false,
        "registeredCount": 50
      }
    ]
  }
}
```

### GET /events/[id]
Get event details.

**Headers:**
```
Authorization: Bearer <access_token>
```

### POST /events/[id]/register
Register for an event.

**Headers:**
```
Authorization: Bearer <access_token>
```

### DELETE /events/[id]/unregister
Unregister from an event.

**Headers:**
```
Authorization: Bearer <access_token>
```

### GET /events/my-registrations
Get user's event registrations.

**Headers:**
```
Authorization: Bearer <access_token>
```

---

## Notifications Endpoints

**Note:** All notification endpoints require authentication.

### GET /notifications
Get user notifications.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (number)
- `limit` (number)
- `unread` (boolean) - Show only unread notifications

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [],
    "unreadCount": 5
  }
}
```

### PUT /notifications/[id]/read
Mark notification as read.

**Headers:**
```
Authorization: Bearer <access_token>
```

### PUT /notifications/mark-all-read
Mark all notifications as read.

**Headers:**
```
Authorization: Bearer <access_token>
```

### DELETE /notifications/[id]
Delete a notification.

**Headers:**
```
Authorization: Bearer <access_token>
```

---

## Personal Discovery Endpoints

**Note:** All personal discovery endpoints require authentication.

### GET /personal-discovery
Get personal discovery data.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "personalDiscovery": {
      "strengths": [],
      "weaknesses": [],
      "opportunities": [],
      "achievements": [],
      "threats": [],
      "familyAspirations": [],
      "careerAspirations": [],
      "financialBusinessAspirations": [],
      "socialAspirations": [],
      "desiredPosition": [],
      "requiredSkills": [],
      "coursesAndTrainings": [],
      "strategies": [],
      "shortTermGoals": []
    },
    "exists": true
  }
}
```

### POST /personal-discovery
Create personal discovery (first time only).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "strengths": ["Leadership", "Communication"],
  "weaknesses": ["Time management"],
  "opportunities": ["New markets"],
  "achievements": ["Graduated with honors"],
  "threats": ["Market competition"],
  "familyAspirations": ["Financial stability"],
  "careerAspirations": ["Become a CEO"],
  "financialBusinessAspirations": ["Start a business"],
  "socialAspirations": ["Community impact"],
  "desiredPosition": ["Senior Manager"],
  "requiredSkills": ["Project management"],
  "coursesAndTrainings": ["MBA"],
  "strategies": ["Network expansion"],
  "shortTermGoals": ["Get certified"]
}
```

### PUT /personal-discovery
Update personal discovery.

**Headers:**
```
Authorization: Bearer <access_token>
```

---

## Scholarship Assessment Endpoints

**Note:** All scholarship assessment endpoints require authentication.

### GET /scholarship-assessment
Get scholarship assessment data.

**Headers:**
```
Authorization: Bearer <access_token>
```

### POST /scholarship-assessment
Create scholarship assessment.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "educationLevel": "Bachelor's",
  "fieldPreference": "Engineering",
  "ageRange": "20-25",
  "gender": "MALE",
  "employmentPreference": "Full-time",
  "selfEmploymentType": "Tech startup",
  "careerSector": "Technology",
  "unpaidPassion": "Teaching",
  "personalPassion": "Innovation",
  "lifeGoal": "Make an impact",
  "futureTitle": "CTO",
  "futureTasks": "Lead development",
  "requiredSkills": "Leadership",
  "desiredCourses": "Machine Learning"
}
```

### PUT /scholarship-assessment
Update scholarship assessment.

**Headers:**
```
Authorization: Bearer <access_token>
```

---

## CV Endpoints

**Note:** All CV endpoints require authentication.

### GET /cv
List user's CVs.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (number)
- `limit` (number)

### GET /cv/[id]
Get CV details.

**Headers:**
```
Authorization: Bearer <access_token>
```

### DELETE /cv/[id]
Delete a CV.

**Headers:**
```
Authorization: Bearer <access_token>
```

### POST /cv/upload-url
Get pre-signed URL for CV upload.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "fileName": "my-cv.pdf",
  "fileType": "application/pdf"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "uploadUrl": "https://...",
    "fileUrl": "https://...",
    "key": "cvs/user-id/timestamp-filename.pdf",
    "message": "Upload URL generated successfully"
  }
}
```

**Upload Flow:**
1. Request upload URL from `/cv/upload-url`
2. Upload file directly to the `uploadUrl` using PUT request
3. Confirm upload by calling `/cv/confirm-upload` with `fileUrl` and `fileName`

### POST /cv/confirm-upload
Confirm CV upload after file is uploaded.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "fileName": "my-cv.pdf",
  "fileUrl": "https://..."
}
```

---

## Subscription & Plans Endpoints

**Note:** All subscription and payment endpoints require authentication.

### GET /plans
List all available plans.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "plans": [
      {
        "id": "string",
        "name": "Basic Plan",
        "description": "Access to basic features",
        "price": 99.99,
        "duration": 30,
        "services": [],
        "features": []
      }
    ]
  }
}
```

### GET /subscriptions
Get user subscriptions.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (number)
- `limit` (number)
- `active` (boolean) - Show only active subscriptions

### POST /subscriptions/create
Create a new subscription.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "planId": "string"
}
```

### GET /subscriptions/active
Get current active subscription.

**Headers:**
```
Authorization: Bearer <access_token>
```

### POST /payment-proof/upload-url
Get pre-signed URL for payment proof upload.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "fileName": "payment.jpg",
  "fileType": "image/jpeg"
}
```

### POST /payment-proof/submit
Submit payment proof.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "subscriptionId": "string",
  "imageUrl": "https://..."
}
```

---

## Resources Endpoints

**Note:** All resource endpoints require authentication.

### GET /publications
List all publications.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (number)
- `limit` (number)

### GET /publications/[id]
Get publication details.

**Headers:**
```
Authorization: Bearer <access_token>
```

### GET /testimonials
List all testimonials.

**Headers:**
```
Authorization: Bearer <access_token>
```

### GET /mentors
List all mentors.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (number)
- `limit` (number)
- `expertise` (string) - Filter by expertise

### GET /mentors/[id]
Get mentor details.

**Headers:**
```
Authorization: Bearer <access_token>
```

### GET /resources
List downloadable resources.

**Headers:**
```
Authorization: Bearer <access_token>
```

### GET /categories
List all course categories.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "string",
        "name": "string",
        "_count": {
          "courses": 10
        }
      }
    ]
  }
}
```

---

## Feedback Endpoint

**Note:** Feedback endpoint requires authentication.

### POST /feedback
Submit user feedback.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "content": "Great platform! Very helpful."
}
```

---

## Pagination

Most list endpoints support pagination with these query parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

The response includes pagination metadata:
```json
{
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

---

## File Upload Flow

### For CVs:
1. **Request Upload URL**: `POST /cv/upload-url` with `fileName` and `fileType`
2. **Upload File**: Use the returned `uploadUrl` to upload the file directly (PUT request with file as body)
3. **Confirm Upload**: `POST /cv/confirm-upload` with `fileName` and `fileUrl`

### For Payment Proofs:
1. **Request Upload URL**: `POST /payment-proof/upload-url` with `fileName` and `fileType`
2. **Upload File**: Use the returned `uploadUrl` to upload the image
3. **Submit Proof**: `POST /payment-proof/submit` with `subscriptionId` and `imageUrl`

---

## Progress Flow

Users progress through stages:
1. **PAYMENT_PENDING** → Subscribe to a plan
2. **PERSONAL_DISCOVERY_PENDING** → Complete personal discovery
3. **CV_ALIGNMENT_PENDING** → Upload CV
4. **SCHOLARSHIP_MATRIX_PENDING** → Complete scholarship assessment
5. **ESSAYS_PENDING** → Complete essays (TBD)
6. **COMPLETED** → All steps done

Check `/user/progress` to get current status and next steps.

---

## Example Usage

### Login and Get User Data
```javascript
// 1. Login
const loginResponse = await fetch('/api/mobile/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { data } = await loginResponse.json();
const { accessToken, refreshToken } = data.tokens;

// Store tokens securely (use secure storage on mobile)
await SecureStore.setItemAsync('accessToken', accessToken);
await SecureStore.setItemAsync('refreshToken', refreshToken);

// 2. Get current user with token
const userResponse = await fetch('/api/mobile/v1/auth/me', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

### Token Refresh Flow
```javascript
async function fetchWithAuth(url, options = {}) {
  let accessToken = await SecureStore.getItemAsync('accessToken');

  // Add auth header
  options.headers = {
    ...options.headers,
    'Authorization': `Bearer ${accessToken}`
  };

  let response = await fetch(url, options);

  // If token expired, refresh and retry
  if (response.status === 401) {
    const errorData = await response.json();

    if (errorData.error?.code === 'TOKEN_EXPIRED') {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');

      // Refresh tokens
      const refreshResponse = await fetch('/api/mobile/v1/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      if (refreshResponse.ok) {
        const { data } = await refreshResponse.json();
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data.tokens;

        // Update stored tokens
        await SecureStore.setItemAsync('accessToken', newAccessToken);
        await SecureStore.setItemAsync('refreshToken', newRefreshToken);

        // Retry original request
        options.headers.Authorization = `Bearer ${newAccessToken}`;
        response = await fetch(url, options);
      } else {
        // Refresh failed, redirect to login
        throw new Error('SESSION_EXPIRED');
      }
    }
  }

  return response;
}
```

### Enroll in Course
```javascript
const accessToken = await SecureStore.getItemAsync('accessToken');

const response = await fetch('/api/mobile/v1/courses/course-id/enroll', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

### Upload CV
```javascript
const accessToken = await SecureStore.getItemAsync('accessToken');

// 1. Get upload URL
const urlResponse = await fetch('/api/mobile/v1/cv/upload-url', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    fileName: 'my-cv.pdf',
    fileType: 'application/pdf'
  })
});

const { data } = await urlResponse.json();
const { uploadUrl, fileUrl } = data;

// 2. Upload file directly to storage (no auth needed)
await fetch(uploadUrl, {
  method: 'PUT',
  body: fileData,
  headers: { 'Content-Type': 'application/pdf' }
});

// 3. Confirm upload
await fetch('/api/mobile/v1/cv/confirm-upload', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({
    fileName: 'my-cv.pdf',
    fileUrl
  })
});
```

---

## Security Best Practices

1. **Store Tokens Securely**: Use secure storage mechanisms (e.g., iOS Keychain, Android Keystore)
2. **Don't Log Tokens**: Never log tokens in production
3. **Handle Token Expiration**: Implement automatic token refresh
4. **Clear Tokens on Logout**: Remove all tokens from storage
5. **Use HTTPS**: Always use HTTPS in production
6. **Validate Token on Critical Operations**: Re-authenticate for sensitive actions
