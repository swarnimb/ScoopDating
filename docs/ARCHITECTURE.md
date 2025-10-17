# Scoop - System Architecture Documentation

## Table of Contents
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [System Components](#system-components)
4. [Data Flow](#data-flow)
5. [Scalability Considerations](#scalability-considerations)
6. [Security Architecture](#security-architecture)

---

## Overview

**Scoop** is a constraint-based dating application designed to encourage meaningful connections through intentional limitations. Unlike traditional dating apps that promote endless swiping, Scoop implements deliberate constraints to improve user engagement quality.

### Core Philosophy
- **Quality over Quantity**: Limited daily swipes force users to be more selective
- **Active Engagement**: Match limits encourage users to engage with existing matches
- **Accountability**: Inactivity tracking ensures active, engaged user base

---

## Technology Stack

### Frontend (Mobile Application)
**Technology**: React Native with Expo
**Why This Choice**:
- **Cross-platform**: Single codebase runs on both iOS and Android
- **JavaScript-based**: More beginner-friendly than Swift/Kotlin
- **Large ecosystem**: Extensive libraries and community support
- **Expo tooling**: Simplifies development, testing, and deployment
- **Hot reload**: Fast development cycles

**Alternative Considered**: Flutter (Dart-based, excellent performance but steeper learning curve)

### Backend
**Technology**: Firebase (Backend-as-a-Service)
**Why This Choice**:
- **No server management**: Focus on app logic, not infrastructure
- **Real-time capabilities**: Instant message delivery
- **Built-in authentication**: Email, phone, social login out of the box
- **Free tier**: Generous limits for MVP and early growth
- **Automatic scaling**: Handles traffic spikes automatically

**Components We'll Use**:
- **Firebase Authentication**: User signup/login
- **Cloud Firestore**: NoSQL database for user profiles, matches, messages
- **Firebase Cloud Functions**: Server-side logic (constraint enforcement, matching algorithm)
- **Firebase Storage**: Profile photo hosting
- **Firebase Cloud Messaging**: Push notifications

**Alternative Considered**: Node.js + Express + PostgreSQL (more control but requires DevOps knowledge)

### Database
**Technology**: Cloud Firestore (NoSQL)
**Why This Choice**:
- **Real-time sync**: Messages appear instantly
- **Offline support**: App works without internet, syncs later
- **Flexible schema**: Easy to iterate during development
- **Automatic indexing**: Query optimization handled automatically

**Data Structure**: Document-based collections (explained in DATABASE_SCHEMA.md)

---

## System Components

### 1. Mobile Application (Frontend)
```
┌─────────────────────────────────────┐
│      React Native App              │
│  ┌───────────────────────────────┐ │
│  │  UI Components                │ │
│  │  - Login/Signup Screens       │ │
│  │  - Profile Builder            │ │
│  │  - Swipe Interface            │ │
│  │  - Match List                 │ │
│  │  - Chat Interface             │ │
│  │  - Settings                   │ │
│  └───────────────────────────────┘ │
│  ┌───────────────────────────────┐ │
│  │  State Management (Redux)     │ │
│  │  - User state                 │ │
│  │  - Swipe count tracking       │ │
│  │  - Match data                 │ │
│  │  - Chat messages              │ │
│  └───────────────────────────────┘ │
│  ┌───────────────────────────────┐ │
│  │  Business Logic               │ │
│  │  - Constraint validation      │ │
│  │  - Swipe limit checker        │ │
│  │  - Match limit enforcer       │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Purpose**: User interface and client-side logic
**Responsibilities**:
- Display UI and handle user interactions
- Track swipe counts locally (synced with backend)
- Enforce client-side constraint validation
- Handle real-time message display
- Manage app state and navigation

---

### 2. Backend Services (Firebase)

```
┌─────────────────────────────────────┐
│     Firebase Backend Services       │
│  ┌───────────────────────────────┐ │
│  │  Authentication               │ │
│  │  - Email/Phone verification   │ │
│  │  - Session management         │ │
│  │  - Security tokens (JWT)      │ │
│  └───────────────────────────────┘ │
│  ┌───────────────────────────────┐ │
│  │  Cloud Firestore Database     │ │
│  │  - Users collection           │ │
│  │  - Matches collection         │ │
│  │  - Messages collection        │ │
│  │  - SwipeLogs collection       │ │
│  └───────────────────────────────┘ │
│  ┌───────────────────────────────┐ │
│  │  Cloud Functions (Serverless) │ │
│  │  - Daily swipe reset          │ │
│  │  - Inactivity checker         │ │
│  │  - Match creation logic       │ │
│  │  - Push notifications         │ │
│  └───────────────────────────────┘ │
│  ┌───────────────────────────────┐ │
│  │  Storage                      │ │
│  │  - Profile photos             │ │
│  │  - Image optimization         │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Purpose**: Data storage, authentication, and server-side logic
**Responsibilities**:
- Authenticate users securely
- Store all application data
- Execute constraint enforcement algorithms
- Handle matching logic
- Send push notifications
- Run scheduled background tasks

---

### 3. Cloud Functions (Business Logic Layer)

These are JavaScript/TypeScript functions that run on Google's servers, triggered by events or scheduled times.

#### Function: `dailySwipeReset`
**Trigger**: Scheduled (runs at midnight UTC daily)
**Purpose**: Reset all users' daily swipe counts to 0
**Algorithm**:
```
For each active user:
  1. Set user.swipesRemaining = 10
  2. Set user.lastSwipeReset = currentTimestamp
  3. Update database
```

#### Function: `checkInactiveUsers`
**Trigger**: Scheduled (runs daily at 2 AM UTC)
**Purpose**: Pause accounts inactive for 30+ days
**Algorithm**:
```
For each active user:
  1. Calculate daysSinceLastActivity = (currentDate - user.lastActiveDate)
  2. If daysSinceLastActivity >= 30:
     a. Set user.accountStatus = "paused"
     b. Send email notification
     c. Update database
```

#### Function: `createMatch`
**Trigger**: When both users swipe right on each other
**Purpose**: Create a match and notify both users
**Algorithm**:
```
When User A swipes right on User B:
  1. Check if User B already swiped right on User A
  2. If yes (mutual match):
     a. Check both users have < 5 active matches
     b. If constraint satisfied:
        - Create match document
        - Send push notification to both
        - Unlock chat between them
     c. If constraint violated:
        - Queue match for later (when slot available)
  3. If no (one-sided like):
     a. Store like in database
     b. Wait for User B's swipe
```

#### Function: `enforceSwipeLimit`
**Trigger**: Before each swipe action
**Purpose**: Verify user hasn't exceeded daily limit
**Algorithm**:
```
When user attempts to swipe:
  1. Get user.swipesRemaining from database
  2. If swipesRemaining > 0:
     a. Allow swipe
     b. Decrement swipesRemaining by 1
     c. Update database
  3. If swipesRemaining = 0:
     a. Reject swipe
     b. Show "come back tomorrow" message
```

---

## Data Flow

### Example Flow: User Swipes Right on Another User

```
┌──────────┐     ┌──────────┐     ┌──────────────┐     ┌──────────┐
│  User A  │────>│   App    │────>│   Firebase   │────>│  User B  │
│  Device  │     │ (React   │     │  (Backend)   │     │  Device  │
│          │<────│  Native) │<────│              │<────│          │
└──────────┘     └──────────┘     └──────────────┘     └──────────┘

Step-by-step:
1. User A swipes right on User B's profile
   ↓
2. App checks local state: Does User A have swipes remaining?
   ↓
3. App sends request to Firebase: "User A swiped right on User B"
   ↓
4. Cloud Function 'enforceSwipeLimit' validates:
   - Verify swipesRemaining > 0 (server-side check)
   - Decrement swipe count
   ↓
5. Cloud Function 'createMatch' checks:
   - Did User B already swipe right on User A?
   - Do both users have < 5 active matches?
   ↓
6a. If MATCH:
    - Create match document in Firestore
    - Send push notification to both users
    - Enable chat between them
   ↓
6b. If NO MATCH:
    - Store User A's like in database
    - Wait for User B to swipe
   ↓
7. Update User A's app with new swipe count
8. Move to next profile
```

---

## Scalability Considerations

### Current Architecture (MVP)
- **Expected load**: 100-1,000 users
- **Firebase free tier limits**:
  - 50,000 reads/day
  - 20,000 writes/day
  - 1 GB storage
  - 10 GB bandwidth

### Scaling Strategy (Future)

#### Phase 1: 1K-10K users
- Upgrade to Firebase Blaze plan (pay-as-you-go)
- Optimize database queries (add indexes)
- Implement caching for frequently accessed profiles

#### Phase 2: 10K-100K users
- Enable Cloud Firestore data replication
- Use Firebase Cloud CDN for image delivery
- Implement Redis cache layer for hot data
- Split Cloud Functions for better performance

#### Phase 3: 100K+ users
- Consider migrating to Kubernetes for more control
- Use microservices architecture
- Implement load balancing
- Multi-region deployment

**Why This Matters**: You want enterprise-quality architecture from day one, but with the flexibility to grow incrementally.

---

## Security Architecture

### Authentication & Authorization
**Method**: Firebase Authentication with JWT (JSON Web Tokens)

**How It Works**:
1. User signs up with email/phone
2. Firebase verifies credentials and sends verification code
3. Upon successful verification, Firebase issues JWT token
4. Token is stored securely on device
5. Every API request includes this token
6. Firebase validates token before processing request

**Security Rules** (Firestore):
```javascript
// Only authenticated users can read/write their own data
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
}

// Users can only read profiles they haven't swiped on
match /profiles/{profileId} {
  allow read: if request.auth != null;
  allow write: if request.auth.uid == profileId;
}

// Only matched users can access chat
match /chats/{chatId} {
  allow read, write: if request.auth.uid in resource.data.participants;
}
```

### Data Protection
- **Encryption in transit**: All data encrypted via HTTPS/TLS
- **Encryption at rest**: Firestore encrypts all data automatically
- **Photo storage**: Images stored in Firebase Storage with access rules
- **Sensitive data**: Phone numbers, email hashed before storage (where applicable)

### Privacy Features
- **Location privacy**: Store only city-level location, not GPS coordinates
- **Profile visibility**: Users only see profiles they haven't swiped on
- **Blocking**: Users can block others (prevents future matches)
- **Reporting**: Flag inappropriate profiles (triggers manual review)

---

## Why This Architecture Is Enterprise-Quality

### 1. Separation of Concerns
- Frontend handles UI only
- Backend handles data and business logic
- Clear boundaries make debugging easier

### 2. Scalability Built-In
- Firebase auto-scales with demand
- Serverless functions handle traffic spikes
- No single point of failure

### 3. Security First
- Authentication at every layer
- Database security rules prevent unauthorized access
- Regular security updates from Firebase

### 4. Monitoring & Analytics
- Firebase Analytics tracks user behavior
- Cloud Functions logging for debugging
- Performance monitoring included

### 5. Cost-Effective
- Free tier for MVP
- Pay-as-you-grow pricing
- No upfront infrastructure costs

---

## Next Steps

After understanding this architecture, you should:
1. Review CONSTRAINTS.md to understand business rules
2. Review DATABASE_SCHEMA.md to understand data models
3. Review API_REFERENCE.md to understand how components communicate

**Key Takeaway**: This architecture is professional, scalable, and beginner-friendly. You're building enterprise-quality software from day one, just starting with a solid MVP foundation.
