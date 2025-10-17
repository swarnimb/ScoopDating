# Scoop - API Reference Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [User Management APIs](#user-management-apis)
4. [Swipe & Matching APIs](#swipe--matching-apis)
5. [Chat APIs](#chat-apis)
6. [Utility APIs](#utility-apis)
7. [Error Handling](#error-handling)

---

## Overview

This document describes all API endpoints (Cloud Functions) that the React Native app will call.

**Base URL**: `https://us-central1-scoop-dating.cloudfunctions.net`

**Technology**: Firebase Cloud Functions (serverless JavaScript/TypeScript functions)

**Authentication**: All requests (except signup/login) require Firebase Auth JWT token in header:
```
Authorization: Bearer <firebase-jwt-token>
```

---

## Authentication

### 1. Sign Up (Email)
Creates a new user account with email verification.

**Endpoint**: Firebase SDK (not custom Cloud Function)
**Method**: Client-side Firebase call
**Code**:
```javascript
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

const auth = getAuth();
const userCredential = await createUserWithEmailAndPassword(auth, email, password);
await sendEmailVerification(userCredential.user);
```

**Input**:
```javascript
{
  email: "user@example.com",
  password: "SecurePass123!"  // Min 8 chars, 1 uppercase, 1 number
}
```

**Output**:
```javascript
{
  user: {
    uid: "abc123xyz",
    email: "user@example.com",
    emailVerified: false
  },
  success: true,
  message: "Verification email sent. Please check your inbox."
}
```

**What Happens Next**:
1. User receives verification email
2. User clicks link in email
3. Email verified → user can proceed to profile creation

---

### 2. Login
Authenticates existing user.

**Endpoint**: Firebase SDK
**Method**: Client-side Firebase call
**Code**:
```javascript
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();
const userCredential = await signInWithEmailAndPassword(auth, email, password);
```

**Input**:
```javascript
{
  email: "user@example.com",
  password: "SecurePass123!"
}
```

**Output**:
```javascript
{
  user: {
    uid: "abc123xyz",
    email: "user@example.com",
    emailVerified: true
  },
  token: "eyJhbGciOiJSUzI1NiIsImtpZCI6...",  // JWT token for subsequent requests
  success: true
}
```

**Error Cases**:
- Invalid email/password: `auth/invalid-credential`
- Email not verified: `auth/email-not-verified`
- Account disabled: `auth/user-disabled`

---

### 3. Logout
Signs out current user.

**Endpoint**: Firebase SDK
**Method**: Client-side Firebase call
**Code**:
```javascript
import { getAuth, signOut } from 'firebase/auth';

const auth = getAuth();
await signOut(auth);
```

---

### 4. Password Reset
Sends password reset email.

**Endpoint**: Firebase SDK
**Method**: Client-side Firebase call
**Code**:
```javascript
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const auth = getAuth();
await sendPasswordResetEmail(auth, email);
```

---

## User Management APIs

### 5. Create Profile (Cloud Function)
**Endpoint**: `POST /createProfile`
**Authentication**: Required
**Purpose**: Creates user's dating profile after signup

**Request**:
```javascript
{
  displayName: "John",
  birthdate: "1997-05-15",
  gender: "male",
  bio: "Software engineer who loves hiking and trying new coffee shops...",
  photos: [
    "base64EncodedPhoto1",  // Will be uploaded to Firebase Storage
    "base64EncodedPhoto2",
    "base64EncodedPhoto3"
  ],
  location: {
    city: "San Francisco",
    state: "CA",
    country: "USA",
    coordinates: { latitude: 37.7749, longitude: -122.4194 }
  },
  preferences: {
    genderPreference: "female",
    ageMin: 25,
    ageMax: 35,
    maxDistance: 25
  },
  occupation: "Software Engineer",     // Optional
  education: "Bachelor's Degree",      // Optional
  height: 70,                          // Optional
  interests: ["hiking", "cooking"]     // Optional
}
```

**Response**:
```javascript
{
  success: true,
  userId: "abc123xyz",
  profileCompleteness: 85,
  message: "Profile created successfully! You can start swiping."
}
```

**Algorithm**:
```
FUNCTION createProfile(request):
  1. Validate all required fields
  2. Calculate age from birthdate (must be 18+)
  3. Upload photos to Firebase Storage
     - Generate photo URLs
     - Optimize images (resize, compress)
  4. Calculate profileCompleteness percentage
  5. Create user document in Firestore
     - Set swipesRemaining = 10
     - Set accountStatus = "active"
     - Set createdAt = currentTimestamp
  6. Return success response
END FUNCTION
```

**Validation Rules**:
- `displayName`: 2-20 characters, no special chars
- `age`: Must be 18-99 (calculated from birthdate)
- `bio`: 50-500 characters
- `photos`: Minimum 3, maximum 6
- `maxDistance`: 5, 10, 25, 50, or 100 miles

---

### 6. Update Profile
**Endpoint**: `PUT /updateProfile`
**Authentication**: Required

**Request**:
```javascript
{
  bio: "Updated bio text...",           // Any field can be updated
  photos: ["url1", "url2", "url3"],
  preferences: {
    ageMin: 26,
    ageMax: 36
  }
}
```

**Response**:
```javascript
{
  success: true,
  profileCompleteness: 90,
  message: "Profile updated successfully"
}
```

---

### 7. Get My Profile
**Endpoint**: `GET /getProfile`
**Authentication**: Required

**Response**:
```javascript
{
  success: true,
  profile: {
    userId: "abc123xyz",
    displayName: "John",
    age: 28,
    bio: "Software engineer...",
    photos: ["url1", "url2", "url3"],
    location: { city: "San Francisco", state: "CA" },
    swipesRemaining: 7,
    activeMatchCount: 3,
    pendingMatchCount: 1,
    accountStatus: "active"
  }
}
```

---

### 8. Get User Profile (View Another User)
**Endpoint**: `GET /getUserProfile/{userId}`
**Authentication**: Required
**Purpose**: View profile of potential match during swiping

**Response**:
```javascript
{
  success: true,
  profile: {
    userId: "def456uvw",
    displayName: "Jane",
    age: 26,
    bio: "Passionate about travel and photography...",
    photos: ["url1", "url2", "url3", "url4"],
    occupation: "Photographer",
    interests: ["travel", "photography", "yoga"],
    distance: 12  // Miles away from current user
  }
}
```

**Note**: Sensitive data (email, phone, exact location) NOT included

---

### 9. Delete Account
**Endpoint**: `DELETE /deleteAccount`
**Authentication**: Required

**Response**:
```javascript
{
  success: true,
  message: "Account deleted successfully"
}
```

**Algorithm**:
```
FUNCTION deleteAccount(userId):
  1. Set user.accountStatus = "deleted"
  2. Remove all user photos from Storage
  3. Delete all active matches
  4. Anonymize user data (GDPR compliance):
     - Keep userId for referential integrity
     - Remove email, phone, photos, bio
     - Set displayName = "Deleted User"
  5. Send confirmation email
END FUNCTION
```

---

## Swipe & Matching APIs

### 10. Get Swipe Deck
**Endpoint**: `GET /getSwipeDeck`
**Authentication**: Required
**Purpose**: Fetch profiles to swipe on

**Request Parameters**:
```javascript
{
  limit: 10  // Number of profiles to fetch (default 10)
}
```

**Response**:
```javascript
{
  success: true,
  profiles: [
    {
      userId: "def456uvw",
      displayName: "Jane",
      age: 26,
      bio: "Passionate about...",
      photos: ["url1", "url2"],
      distance: 12,
      interests: ["travel", "yoga"]
    },
    // ... 9 more profiles
  ],
  hasMore: true  // Are there more profiles available?
}
```

**Algorithm**:
```
FUNCTION getSwipeDeck(currentUserId):
  1. Get current user's preferences (age, gender, distance)
  2. Query Firestore for matching profiles:
     - accountStatus = "active"
     - gender matches user's preference
     - age within user's range
     - location within maxDistance
     - NOT in user's blockedUsers
     - NOT in user's swipeLogs (haven't swiped before)
  3. Mutual filter: Both users' preferences must match
  4. Randomize order (prevent always seeing same profiles first)
  5. Limit to 10 profiles
  6. Return profiles
END FUNCTION
```

---

### 11. Swipe on Profile
**Endpoint**: `POST /swipe`
**Authentication**: Required
**Purpose**: Record a swipe and check for match

**Request**:
```javascript
{
  targetUserId: "def456uvw",
  direction: "right"  // "left" or "right"
}
```

**Response (Right Swipe, Match Created)**:
```javascript
{
  success: true,
  swipesRemaining: 6,
  isMatch: true,
  matchStatus: "active",  // or "pending" if match limit reached
  match: {
    matchId: "match_xyz789",
    userId: "def456uvw",
    displayName: "Jane",
    photo: "url1",
    message: "It's a match! Start chatting now."
  }
}
```

**Response (Right Swipe, No Match Yet)**:
```javascript
{
  success: true,
  swipesRemaining: 6,
  isMatch: false,
  message: "Swipe recorded"
}
```

**Response (Left Swipe)**:
```javascript
{
  success: true,
  swipesRemaining: 6,
  isMatch: false
}
```

**Response (Out of Swipes)**:
```javascript
{
  success: false,
  error: "SWIPE_LIMIT_REACHED",
  message: "You've used all 10 swipes today. Come back in 6 hours 23 minutes!",
  resetTime: "2025-10-18T00:00:00Z"
}
```

**Algorithm**: (See CONSTRAINTS.md - enforceSwipeLimit and checkForMatch)

---

### 12. Get Matches
**Endpoint**: `GET /getMatches`
**Authentication**: Required
**Purpose**: Fetch all active matches

**Response**:
```javascript
{
  success: true,
  activeMatches: [
    {
      matchId: "match_xyz789",
      userId: "def456uvw",
      displayName: "Jane",
      photo: "url1",
      lastMessage: {
        text: "Hey! How's it going?",
        senderId: "def456uvw",
        timestamp: "2025-10-17T14:30:00Z",
        isRead: false
      },
      createdAt: "2025-10-15T10:20:00Z"
    },
    // ... up to 5 active matches
  ],
  pendingMatches: [
    {
      matchId: "match_abc123",
      userId: "ghi789rst",
      displayName: "Sarah",
      photo: "url1",
      message: "Unmatch someone to connect with Sarah"
    }
  ],
  activeCount: 3,
  pendingCount: 1
}
```

---

### 13. Unmatch
**Endpoint**: `POST /unmatch`
**Authentication**: Required
**Purpose**: End a match and potentially activate pending match

**Request**:
```javascript
{
  matchId: "match_xyz789",
  reason: "not_interested"  // Optional: "not_interested", "offensive", "other"
}
```

**Response**:
```javascript
{
  success: true,
  message: "Match ended",
  newMatchActivated: {
    matchId: "match_abc123",
    userId: "ghi789rst",
    displayName: "Sarah",
    message: "Your match with Sarah is now active!"
  }
}
```

**Algorithm**: (See CONSTRAINTS.md - onUnmatch)

---

## Chat APIs

### 14. Get Messages
**Endpoint**: `GET /getMessages/{matchId}`
**Authentication**: Required
**Purpose**: Load chat history for a match

**Request Parameters**:
```javascript
{
  limit: 50,               // Number of messages (default 50)
  before: "timestamp"      // For pagination (optional)
}
```

**Response**:
```javascript
{
  success: true,
  messages: [
    {
      messageId: "msg_abc123",
      senderId: "abc123xyz",
      text: "Hey! How's it going?",
      timestamp: "2025-10-17T14:30:00Z",
      isRead: true
    },
    {
      messageId: "msg_def456",
      senderId: "def456uvw",
      text: "Good! Just got back from hiking. You?",
      timestamp: "2025-10-17T14:32:00Z",
      isRead: false
    },
    // ... more messages
  ],
  hasMore: false  // Are there older messages?
}
```

---

### 15. Send Message
**Endpoint**: `POST /sendMessage`
**Authentication**: Required

**Request**:
```javascript
{
  matchId: "match_xyz789",
  text: "Hey! How was your weekend?"
}
```

**Response**:
```javascript
{
  success: true,
  message: {
    messageId: "msg_ghi789",
    senderId: "abc123xyz",
    text: "Hey! How was your weekend?",
    timestamp: "2025-10-17T15:00:00Z",
    isRead: false
  }
}
```

**Algorithm**:
```
FUNCTION sendMessage(matchId, senderId, text):
  1. Validate match exists and senderId is participant
  2. Validate match status = "active" (not pending or unmatched)
  3. Validate message text (max 500 characters, no URLs in MVP for safety)
  4. Create message document in /matches/{matchId}/messages/
  5. Update match document:
     - lastMessage = { text, senderId, timestamp }
     - lastMessageAt = timestamp
     - increment messageCount
  6. Update sender's lastActiveDate
  7. Send push notification to recipient
  8. Return message
END FUNCTION
```

---

### 16. Mark Messages as Read
**Endpoint**: `POST /markAsRead`
**Authentication**: Required

**Request**:
```javascript
{
  matchId: "match_xyz789"
}
```

**Response**:
```javascript
{
  success: true,
  markedCount: 3  // Number of messages marked as read
}
```

**Algorithm**:
```
FUNCTION markAsRead(matchId, userId):
  1. Get all messages in match where isRead = false AND senderId != userId
  2. Update all to isRead = true, readAt = currentTimestamp
  3. Return count
END FUNCTION
```

---

### 17. Real-Time Chat Listener (Not HTTP)
**Purpose**: Listen for new messages in real-time

**Code (Client-Side)**:
```javascript
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

const messagesRef = collection(db, `matches/${matchId}/messages`);
const q = query(messagesRef, orderBy('timestamp', 'desc'), limit(50));

const unsubscribe = onSnapshot(q, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === 'added') {
      const newMessage = change.doc.data();
      // Display new message in chat UI
      displayMessage(newMessage);
    }
  });
});

// When user leaves chat
unsubscribe();
```

**This is NOT an API call** - it's a Firestore real-time listener that automatically pushes new messages to the client.

---

## Utility APIs

### 18. Report User
**Endpoint**: `POST /reportUser`
**Authentication**: Required

**Request**:
```javascript
{
  reportedUserId: "def456uvw",
  reason: "inappropriate_messages",  // "fake_profile", "harassment", "inappropriate_messages", "spam", "other"
  description: "This user sent offensive messages...",
  matchId: "match_xyz789"  // Optional
}
```

**Response**:
```javascript
{
  success: true,
  reportId: "report_abc123",
  message: "Report submitted. We'll review it within 24 hours."
}
```

---

### 19. Block User
**Endpoint**: `POST /blockUser`
**Authentication**: Required

**Request**:
```javascript
{
  blockedUserId: "def456uvw",
  reason: "not_interested"  // Optional
}
```

**Response**:
```javascript
{
  success: true,
  message: "User blocked. They will no longer appear in your swipe deck."
}
```

**Algorithm**:
```
FUNCTION blockUser(userId, blockedUserId):
  1. Add to /users/{userId}/blockedUsers/{blockedUserId}
  2. If active match exists between them:
     - End the match (set status = "unmatched")
     - Delete messages (optional, or keep for safety)
  3. Ensure blockedUser never appears in swipe deck again
END FUNCTION
```

---

### 20. Get App Statistics (For User)
**Endpoint**: `GET /getStats`
**Authentication**: Required
**Purpose**: Show user their app usage stats

**Response**:
```javascript
{
  success: true,
  stats: {
    totalSwipes: 143,
    totalRightSwipes: 52,
    totalMatches: 8,
    activeMatches: 3,
    messagesSent: 47,
    daysActive: 12,
    profileViews: 234  // Future feature
  }
}
```

---

## Error Handling

All APIs return errors in this format:

```javascript
{
  success: false,
  error: "ERROR_CODE",
  message: "Human-readable error message",
  details: {}  // Optional additional context
}
```

### Common Error Codes

| Error Code | HTTP Status | Meaning | Resolution |
|------------|-------------|---------|------------|
| `AUTH_REQUIRED` | 401 | No auth token provided | User must log in |
| `INVALID_TOKEN` | 401 | JWT token invalid/expired | Refresh token or re-login |
| `PROFILE_INCOMPLETE` | 400 | Profile < 80% complete | Complete profile before swiping |
| `SWIPE_LIMIT_REACHED` | 429 | Used all 10 swipes today | Wait for midnight reset |
| `MATCH_LIMIT_REACHED` | 429 | Already have 5 matches | Unmatch someone first |
| `USER_NOT_FOUND` | 404 | Requested user doesn't exist | Display error to user |
| `MATCH_NOT_FOUND` | 404 | Requested match doesn't exist | Refresh matches list |
| `UNAUTHORIZED_ACCESS` | 403 | Trying to access another user's data | Security violation |
| `ACCOUNT_PAUSED` | 403 | Account inactive for 30+ days | Reactivate account |
| `ACCOUNT_BANNED` | 403 | User violated terms of service | Contact support |
| `VALIDATION_ERROR` | 400 | Invalid input data | Fix input and retry |
| `SERVER_ERROR` | 500 | Something went wrong on server | Retry or contact support |

### Example Error Response

```javascript
{
  success: false,
  error: "SWIPE_LIMIT_REACHED",
  message: "You've used all 10 swipes today. Swipes reset at midnight UTC.",
  details: {
    swipesRemaining: 0,
    resetTime: "2025-10-18T00:00:00Z",
    hoursUntilReset: 6.5
  }
}
```

---

## Rate Limiting

To prevent abuse, certain endpoints have rate limits:

| Endpoint | Rate Limit | Window |
|----------|------------|--------|
| `/swipe` | 10 requests | 24 hours (enforced by swipe logic) |
| `/sendMessage` | 100 requests | 1 hour |
| `/createProfile` | 1 request | Per user (can only create once) |
| `/reportUser` | 10 requests | 24 hours |
| All others | 1000 requests | 1 hour |

**Implementation**: Firebase Cloud Functions automatically rate-limits by IP. For per-user limits, we track in Firestore.

---

## API Call Flow Example

### Complete User Journey: Swipe → Match → Chat

```
1. User logs in
   → POST /login
   → Receive JWT token

2. App loads swipe deck
   → GET /getSwipeDeck
   → Display 10 profiles

3. User swipes right on Jane
   → POST /swipe { targetUserId: "jane123", direction: "right" }
   → Response: { isMatch: true, matchId: "match_xyz789" }

4. Show "It's a Match!" screen

5. User opens chat with Jane
   → GET /getMessages/match_xyz789
   → Display messages (initially empty)

6. User sends message
   → POST /sendMessage { matchId: "match_xyz789", text: "Hey!" }
   → Message sent

7. Jane's app receives real-time update
   → Firestore listener triggers
   → Jane sees "Hey!" message instantly

8. Jane replies
   → POST /sendMessage { matchId: "match_xyz789", text: "Hi there!" }
   → User's app receives via listener
```

---

## Summary

This API reference covers:
- ✅ All authentication flows (signup, login, password reset)
- ✅ Profile management (create, read, update, delete)
- ✅ Swipe mechanics with constraint enforcement
- ✅ Match creation and management
- ✅ Real-time chat functionality
- ✅ User safety (report, block)
- ✅ Comprehensive error handling

**Next Document**: Review USER_FLOW.md to see how these APIs tie into the user experience.
