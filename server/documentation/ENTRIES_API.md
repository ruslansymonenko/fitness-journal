# Entries API Documentation

This document describes the complete CRUD API for fitness journal entries with filtering and sorting capabilities.

## Base URL

All endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. GET /entries - List Entries with Filtering and Sorting

Retrieve a paginated list of entries with optional filtering and sorting.

**Query Parameters:**

- `page` (optional, default: 1) - Page number for pagination
- `limit` (optional, default: 10) - Number of entries per page (max: 100)
- `sortBy` (optional, default: 'date') - Sort field: 'date', 'workoutType', 'duration', 'createdAt'
- `sortOrder` (optional, default: 'desc') - Sort order: 'asc' or 'desc'
- `workoutType` (optional) - Filter by workout type (case-insensitive substring match)
- `dateFrom` (optional) - Filter entries from this date (ISO 8601 format)
- `dateTo` (optional) - Filter entries until this date (ISO 8601 format)
- `minDuration` (optional) - Filter entries with duration >= this value (minutes)
- `maxDuration` (optional) - Filter entries with duration <= this value (minutes)

**Example Requests:**

```bash
# Get all entries (default pagination)
GET /entries

# Get entries with pagination
GET /entries?page=2&limit=20

# Sort by duration ascending
GET /entries?sortBy=duration&sortOrder=asc

# Filter by workout type
GET /entries?workoutType=running

# Filter by date range
GET /entries?dateFrom=2024-01-01&dateTo=2024-01-31

# Filter by duration range
GET /entries?minDuration=30&maxDuration=90

# Complex filtering and sorting
GET /entries?workoutType=cardio&dateFrom=2024-01-01&sortBy=duration&sortOrder=desc&page=1&limit=15
```

**Response:**

```json
{
  "entries": [
    {
      "id": "uuid",
      "date": "2024-01-15T00:00:00.000Z",
      "workoutType": "Running",
      "duration": 45,
      "notes": "Morning jog in the park",
      "userId": "user-uuid",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 2. POST /entries - Create Entry

Create a new fitness journal entry.

**Request Body:**

```json
{
  "date": "2024-01-15T00:00:00.000Z",
  "workoutType": "Running",
  "duration": 45,
  "notes": "Morning jog in the park" // optional
}
```

**Response (201 Created):**

```json
{
  "id": "uuid",
  "date": "2024-01-15T00:00:00.000Z",
  "workoutType": "Running",
  "duration": 45,
  "notes": "Morning jog in the park",
  "userId": "user-uuid",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 3. GET /entries/:id - Get Entry by ID

Retrieve a specific entry by its ID.

**Response (200 OK):**

```json
{
  "id": "uuid",
  "date": "2024-01-15T00:00:00.000Z",
  "workoutType": "Running",
  "duration": 45,
  "notes": "Morning jog in the park",
  "userId": "user-uuid",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Response (404 Not Found):**

```json
{
  "error": "Entry not found"
}
```

### 4. PUT /entries/:id - Update Entry

Update an existing entry. All fields are optional - only provide the fields you want to update.

**Request Body:**

```json
{
  "date": "2024-01-16T00:00:00.000Z", // optional
  "workoutType": "Weight Training", // optional
  "duration": 60, // optional
  "notes": "Updated workout notes" // optional, use null to clear notes
}
```

**Response (200 OK):**

```json
{
  "id": "uuid",
  "date": "2024-01-16T00:00:00.000Z",
  "workoutType": "Weight Training",
  "duration": 60,
  "notes": "Updated workout notes",
  "userId": "user-uuid",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-16T14:20:00.000Z"
}
```

**Response (404 Not Found):**

```json
{
  "error": "Entry not found"
}
```

### 5. DELETE /entries/:id - Delete Entry

Delete an entry by its ID.

**Response (204 No Content):**
No response body - successful deletion.

**Response (404 Not Found):**

```json
{
  "error": "Entry not found"
}
```

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request - Validation Error:**

```json
{
  "error": {
    "fieldErrors": {
      "duration": ["Expected number, received string"]
    },
    "formErrors": []
  }
}
```

**401 Unauthorized - Missing or invalid token:**

```json
{
  "error": "Unauthorized"
}
```

**500 Internal Server Error:**

```json
{
  "error": "Internal server error"
}
```

## Data Types

### Entry Model

- `id`: string (UUID)
- `date`: string (ISO 8601 datetime)
- `workoutType`: string (required, min length: 1)
- `duration`: number (positive integer, minutes)
- `notes`: string or null (optional)
- `userId`: string (UUID, automatically set from JWT)
- `createdAt`: string (ISO 8601 datetime)
- `updatedAt`: string (ISO 8601 datetime)

## Authentication

All endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

The token must contain a valid `userId` claim that matches the user who owns the entries.

## Rate Limiting

Currently no rate limiting is implemented, but it's recommended for production use.

## Example Usage

```bash
# Create an entry
curl -X POST http://localhost:3000/api/entries \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-15T00:00:00.000Z",
    "workoutType": "Running",
    "duration": 45,
    "notes": "Morning jog"
  }'

# Get filtered entries
curl "http://localhost:3000/api/entries?workoutType=running&sortBy=duration&sortOrder=desc" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Update an entry
curl -X PUT http://localhost:3000/api/entries/ENTRY_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "duration": 50,
    "notes": "Updated notes"
  }'

# Delete an entry
curl -X DELETE http://localhost:3000/api/entries/ENTRY_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
