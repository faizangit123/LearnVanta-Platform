# API Testing Guide

This guide helps you test the EduStream backend API endpoints.

## Prerequisites

1. Backend server running: `python manage.py runserver`
2. Database migrated and superuser created
3. API testing tool (Postman, Thunder Client, or curl)

## Base URL

```
http://localhost:8000/api/v1
```

## Authentication

All authenticated endpoints require a token in the header:

```
Authorization: Token <your-token-here>
```

## Available Endpoints

### 1. User Registration

**Endpoint**: `POST /auth/register/`

**Request Body**:

```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "SecurePassword123!"
}
```

**Response** (201 Created):

```json
{
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "username": "user@example.com",
    "first_name": "John Doe",
    "email_verified": false,
    "role": "user",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "message": "Please check your email to verify your account."
}
```

**Note**: Check console output for verification URL (in development mode)

---

### 2. Email Verification

**Endpoint**: `POST /auth/verify-email/`

**Request Body**:

```json
{
  "token": "verification-token-from-email"
}
```

**Response** (200 OK):

```json
{
  "success": true
}
```

---

### 3. User Login

**Endpoint**: `POST /auth/login/`

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response** (200 OK):

```json
{
  "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b",
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "username": "user@example.com",
    "first_name": "John Doe",
    "email_verified": true,
    "role": "user",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

**Save the token** for authenticated requests!

---

### 4. Get User Profile

**Endpoint**: `GET /auth/profile/`

**Headers**:

```
Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b
```

**Response** (200 OK):

```json
{
  "id": "uuid-here",
  "email": "user@example.com",
  "username": "user@example.com",
  "first_name": "John Doe",
  "email_verified": true,
  "avatar": null,
  "role": "user",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

### 5. Update Profile

**Endpoint**: `PATCH /auth/profile/`

**Headers**:

```
Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b
Content-Type: application/json
```

**Request Body** (all fields optional):

```json
{
  "name": "John Updated Doe"
}
```

**Response** (200 OK):

```json
{
  "id": "uuid-here",
  "email": "user@example.com",
  "username": "user@example.com",
  "first_name": "John Updated Doe",
  "email_verified": true,
  "avatar": null,
  "role": "user",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

### 6. Change Password (via Profile Update)

**Endpoint**: `PATCH /auth/profile/`

**Headers**:

```
Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b
Content-Type: application/json
```

**Request Body**:

```json
{
  "current_password": "SecurePassword123!",
  "new_password": "NewSecurePassword456!"
}
```

**Response** (200 OK):

```json
{
  "id": "uuid-here",
  "email": "user@example.com",
  "username": "user@example.com",
  "first_name": "John Doe",
  "email_verified": true,
  "avatar": null,
  "role": "user",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

### 7. Request Password Reset

**Endpoint**: `POST /auth/password-reset/`

**Request Body**:

```json
{
  "email": "user@example.com"
}
```

**Response** (200 OK):

```json
{
  "message": "If the email exists, a reset link has been sent"
}
```

**Note**: Check console output for reset URL (in development mode)

---

### 8. Confirm Password Reset

**Endpoint**: `POST /auth/password-reset/confirm/`

**Request Body**:

```json
{
  "token": "reset-token-from-email",
  "password": "NewPassword789!"
}
```

**Response** (200 OK):

```json
{
  "success": true
}
```

---

### 9. Resend Email Verification

**Endpoint**: `POST /auth/resend-verification/`

**Request Body**:

```json
{
  "email": "user@example.com"
}
```

**Response** (200 OK):

```json
{
  "message": "Verification email sent"
}
```

---

### 10. Logout

**Endpoint**: `POST /auth/logout/`

**Headers**:

```
Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b
```

**Response** (200 OK):

```json
{
  "success": true
}
```

---

## Testing Workflow

### Complete User Flow Test

1. **Register a new user**

   ```bash
   POST /auth/register/
   {
     "email": "test@example.com",
     "name": "Test User",
     "password": "TestPass123!"
   }
   ```

2. **Get verification token from console output**

   ```
   Verification URL: http://localhost:5173/verify-email?token=abc123...
   ```

3. **Verify email**

   ```bash
   POST /auth/verify-email/
   {
     "token": "abc123..."
   }
   ```

4. **Login**

   ```bash
   POST /auth/login/
   {
     "email": "test@example.com",
     "password": "TestPass123!"
   }
   ```

5. **Save the token from response**

6. **Get profile**

   ```bash
   GET /auth/profile/
   Headers: Authorization: Token <your-token>
   ```

7. **Update profile**

   ```bash
   PATCH /auth/profile/
   Headers: Authorization: Token <your-token>
   {
     "name": "Updated Test User"
   }
   ```

8. **Logout**
   ```bash
   POST /auth/logout/
   Headers: Authorization: Token <your-token>
   ```

---

## Error Responses

### 400 Bad Request

```json
{
  "email": ["This field is required."],
  "password": ["This field is required."]
}
```

### 401 Unauthorized

```json
{
  "detail": "Invalid credentials"
}
```

or

```json
{
  "detail": "Please verify your email before signing in."
}
```

### 404 Not Found

```json
{
  "detail": "User not found"
}
```

---

## Using curl

### Register

```bash
curl -X POST http://localhost:8000/api/v1/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"TestPass123!"}'
```

### Login

```bash
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123!"}'
```

### Get Profile

```bash
curl -X GET http://localhost:8000/api/v1/auth/profile/ \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

---

## Using Postman

1. **Create a new collection** named "EduStream API"

2. **Set collection variables**:
   - `base_url`: `http://localhost:8000/api/v1`
   - `token`: (will be set after login)

3. **Create requests** using `{{base_url}}` and `{{token}}`

4. **Add test scripts** to automatically save token:
   ```javascript
   // In Login request's "Tests" tab
   var jsonData = pm.response.json();
   pm.collectionVariables.set("token", jsonData.token);
   ```

---

## Admin Panel Testing

1. **Access admin panel**: http://localhost:8000/admin/

2. **Login with superuser credentials**

3. **Test CRUD operations**:
   - Create users
   - Manage roles
   - View activity logs
   - Create content (classes, subjects, chapters, videos)

---

## Common Issues

### Issue: "Invalid credentials"

- **Solution**: Make sure email is verified before login

### Issue: "Token has expired"

- **Solution**: Request a new verification/reset token

### Issue: "Authentication credentials were not provided"

- **Solution**: Add `Authorization: Token <token>` header

### Issue: "CORS error"

- **Solution**: Make sure frontend URL is in `CORS_ALLOWED_ORIGINS` in settings.py

---

## Next Steps

Once content endpoints are implemented, you'll be able to test:

- Classes, Subjects, Chapters, Videos CRUD
- Watch history and progress tracking
- Favorites management
- Notes CRUD
- User playlists
- Resource uploads/downloads

See `TODO.md` for implementation status.
