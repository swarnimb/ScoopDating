# Scoop - User Flow Documentation

## Table of Contents
1. [Overview](#overview)
2. [First-Time User Journey](#first-time-user-journey)
3. [Daily Active User Journey](#daily-active-user-journey)
4. [Key User Stories](#key-user-stories)
5. [Screen Wireframes](#screen-wireframes)
6. [Error & Edge Case Flows](#error--edge-case-flows)

---

## Overview

This document maps out the complete user journey through Scoop, from signup to match to conversation. Each flow includes:
- **Screens**: What the user sees
- **Actions**: What the user can do
- **Backend**: What happens behind the scenes
- **UI/UX**: Important design considerations

---

## First-Time User Journey

### Flow 1: Signup & Onboarding

```
┌─────────────────┐
│  Launch App     │
│  (Splash Screen)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Welcome       │
│   Screen        │
│                 │
│  [Sign Up]      │
│  [Login]        │
└────────┬────────┘
         │ User clicks "Sign Up"
         ▼
┌─────────────────┐
│  Email Signup   │
│                 │
│  Email: ___     │
│  Password: ___  │
│  [Continue]     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Verify Email   │
│                 │
│  "We sent a     │
│  verification   │
│  email to..."   │
│  [Resend Email] │
└────────┬────────┘
         │ User clicks link in email
         ▼
┌─────────────────┐
│  Profile Setup  │
│  Step 1 of 5    │
│                 │
│  What's your    │
│  name?          │
│  Name: ___      │
│  [Next]         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Profile Setup  │
│  Step 2 of 5    │
│                 │
│  When's your    │
│  birthday?      │
│  MM/DD/YYYY     │
│  [Next]         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Profile Setup  │
│  Step 3 of 5    │
│                 │
│  Upload at least│
│  3 photos       │
│  [📷] [📷] [📷]  │
│  [Next]         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Profile Setup  │
│  Step 4 of 5    │
│                 │
│  Tell us about  │
│  yourself       │
│  Bio: ___       │
│  (min 50 chars) │
│  [Next]         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Profile Setup  │
│  Step 5 of 5    │
│                 │
│  Who are you    │
│  looking for?   │
│  Gender: ___    │
│  Age: 25 - 35   │
│  Distance: 25mi │
│  [Finish]       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Tutorial       │
│                 │
│  "You get 10    │
│  swipes per day"│
│  "You can have  │
│  max 5 matches" │
│  [Got It!]      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Swipe Deck     │
│  (Main Screen)  │
└─────────────────┘
```

**Backend Actions During Onboarding**:
1. `POST /createProfile` - Creates user document in Firestore
2. Photos uploaded to Firebase Storage
3. `profileCompleteness` calculated (must be ≥80%)
4. Initial values set:
   - `swipesRemaining = 10`
   - `activeMatchCount = 0`
   - `accountStatus = "active"`
   - `lastActiveDate = now`

**Design Considerations**:
- **Progress Indicator**: Show "2 of 5" at top of each step
- **Back Button**: Allow users to go back and edit previous steps
- **Validation**: Real-time validation (e.g., "Bio must be at least 50 characters")
- **Photo Upload**: Allow drag-drop or camera/gallery selection
- **Skip Option**: No skip - all fields required to reach 80% completeness

---

### Flow 2: Daily Login & Swiping

```
┌─────────────────┐
│  Launch App     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Login Screen   │
│                 │
│  Email: ___     │
│  Password: ___  │
│  [Login]        │
└────────┬────────┘
         │ Backend: Check accountStatus
         ▼
┌─────────────────┐ ◄─── If accountStatus = "paused"
│  Reactivate?    │
│                 │
│  "Welcome back! │
│  Reactivate your│
│  profile?"      │
│  [Yes] [No]     │
└────────┬────────┘
         │ User clicks "Yes"
         ▼
┌─────────────────┐
│  Swipe Deck     │
│  (Home Screen)  │
│                 │
│  👤 Profile Card│
│  Name, Age      │
│  Photos         │
│  Bio            │
│                 │
│  ❌ Swipe Left  │
│  ❤️ Swipe Right │
│                 │
│  "7 swipes left │
│  today"         │
└────────┬────────┘
         │
         ├─── User swipes LEFT ───┐
         │                        │
         ▼                        ▼
┌─────────────────┐    ┌─────────────────┐
│  Next Profile   │    │  No match       │
│                 │    │  (continues to  │
│                 │    │  next profile)  │
└─────────────────┘    └─────────────────┘
         │
         ├─── User swipes RIGHT ──┐
         │                        │
         ▼                        ▼
┌─────────────────┐    ┌─────────────────┐
│  MATCH! 🎉      │    │  Like Sent      │
│                 │    │                 │
│  "You and Jane  │    │  "We'll notify  │
│  liked each     │    │  you if they    │
│  other!"        │    │  like you back" │
│  [Send Message] │    │  [Continue      │
│  [Keep Swiping] │    │  Swiping]       │
└────────┬────────┘    └────────┬────────┘
         │                      │
         ▼                      ▼
┌─────────────────┐    ┌─────────────────┐
│  Chat Screen    │    │  Next Profile   │
└─────────────────┘    └─────────────────┘
```

**Backend Actions During Swiping**:
1. `GET /getSwipeDeck` - Fetch 10 profiles matching user's preferences
2. `POST /swipe` - Record swipe, decrement `swipesRemaining`
3. If right swipe:
   - Check if target user already swiped right
   - If yes: Run match creation algorithm
   - Check match limits (active < 5?)
   - Create match with appropriate status
4. Update `lastActiveDate` (prevents inactivity pause)

**Design Considerations**:
- **Swipe Counter**: Always visible, prominent placement
- **Profile Photos**: Swipeable carousel (max 6 photos)
- **Bio Truncation**: Show first 100 chars, "Read more" expands
- **Smooth Animations**: Card swipe with haptic feedback
- **Undo Button**: NO undo (makes swipes more intentional)

---

## Daily Active User Journey

### Flow 3: Checking Matches & Chatting

```
┌─────────────────┐
│  Bottom Nav Bar │
│                 │
│  [🔥Swipe]      │
│  [💬Matches]    │◄─── User taps here
│  [👤Profile]    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Matches Screen │
│                 │
│  Active (3/5)   │
│  ┌───────────┐  │
│  │ Jane      │  │
│  │ "Hey!..." │  │
│  │ 2h ago    │  │
│  └───────────┘  │
│  ┌───────────┐  │
│  │ Sarah     │  │
│  │ "Haha..." │  │
│  │ 1d ago    │  │
│  └───────────┘  │
│                 │
│  Pending (1)    │
│  ┌───────────┐  │
│  │ Emily     │  │
│  │ Waiting..│  │◄─── Match limit reached
│  └───────────┘  │
└────────┬────────┘
         │ User taps on "Jane"
         ▼
┌─────────────────┐
│  Chat Screen    │
│                 │
│  < Jane, 26     │
│  [···] Settings │
│                 │
│  ┌───────────┐  │
│  │ Hey! How's│  │
│  │ it going? │  │
│  │ 2h ago    │  │
│  └───────────┘  │
│                 │
│  ┌───────────┐  │
│  │ Good! You?│  │
│  │ Just now  │  │
│  └───────────┘  │
│                 │
│  Type message..│
│  [Send]         │
└─────────────────┘
```

**Backend Actions**:
1. `GET /getMatches` - Fetch all active + pending matches
2. Real-time listener on `/matches/{matchId}/messages` - Auto-update chat
3. `POST /sendMessage` - Send message, trigger push notification
4. `POST /markAsRead` - When user opens chat

---

### Flow 4: Running Out of Swipes

```
┌─────────────────┐
│  Swipe Deck     │
│  "1 swipe left" │
│                 │
│  [Swipe Left]   │
│  [Swipe Right]  │
└────────┬────────┘
         │ User swipes (last one)
         ▼
┌─────────────────┐
│  Out of Swipes  │
│                 │
│  "You've used   │
│  all 10 swipes  │
│  today!"        │
│                 │
│  Swipes reset in│
│  ⏰ 8h 23m      │
│                 │
│  [Check Matches]│
│  [View Profile] │
└─────────────────┘
```

**Backend Actions**:
- `swipesRemaining = 0`
- Display countdown timer until midnight UTC
- Push notification at midnight: "Your swipes have reset!"

**Design Considerations**:
- Encourage user to engage with existing matches instead
- Possible upgrade path: "Get 5 more swipes for $1.99" (future premium feature)

---

### Flow 5: Match Limit Reached

```
┌─────────────────┐
│  Swipe Deck     │
│  Active: 5/5    │◄─── Match limit indicator
└────────┬────────┘
         │ User swipes right, mutual match detected
         ▼
┌─────────────────┐
│  Match!         │
│                 │
│  "You matched   │
│  with Emily!"   │
│                 │
│  ⚠️ Match limit │
│  reached        │
│                 │
│  "This match is │
│  pending. Un-   │
│  match someone  │
│  to chat."      │
│                 │
│  [View Matches] │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Matches Screen │
│                 │
│  Active (5/5)   │
│  [All matches]  │
│                 │
│  Pending (1)    │
│  ┌───────────┐  │
│  │ Emily     │  │
│  │ Unmatch   │  │
│  │ someone to│  │
│  │ connect   │  │
│  └───────────┘  │
└────────┬────────┘
         │ User long-presses on a match
         ▼
┌─────────────────┐
│  Unmatch?       │
│                 │
│  "Are you sure  │
│  you want to    │
│  unmatch Jane?" │
│                 │
│  [Cancel]       │
│  [Unmatch]      │
└────────┬────────┘
         │ User confirms
         ▼
┌─────────────────┐
│  Match Unlocked │
│                 │
│  "Your match    │
│  with Emily is  │
│  now active!"   │
│                 │
│  [Start Chat]   │
└─────────────────┘
```

**Backend Actions**:
1. User unmatches → `activeMatchCount` decrements to 4
2. System checks `pendingMatches` collection
3. Activates oldest pending match
4. Push notification to both users

---

## Key User Stories

### Story 1: Alex Joins Scoop and Finds a Match

**Persona**: Alex, 28, software engineer, tired of endless swiping on other apps

**Journey**:
1. **Day 1, 8 PM**: Downloads Scoop, signs up with email
2. **Day 1, 8:10 PM**: Completes profile (3 photos, bio, preferences)
3. **Day 1, 8:15 PM**: Reads tutorial about 10 swipes/day limit
4. **Day 1, 8:20 PM**: Starts swiping carefully (knows only 10 available)
   - Swipes left on 3 profiles (not quite right)
   - Swipes right on Sarah (shared interest: hiking)
   - No match yet, continues
5. **Day 1, 8:35 PM**: Uses all 10 swipes, gets 2 matches (Sarah + Emily)
6. **Day 1, 8:40 PM**: Sends messages to both matches
7. **Day 1, 9:00 PM**: Sarah replies, starts conversation
8. **Day 2, 8:00 AM**: Opens app, sees 10 new swipes available
9. **Day 2, 8:30 AM**: Continues conversation with Sarah, planning coffee date

**Alex's Feedback**: "I love that I can't mindlessly swipe. Makes me actually read profiles."

---

### Story 2: Maria Reaches Match Limit

**Persona**: Maria, 25, graphic designer, popular on the app

**Journey**:
1. **Week 1**: Has been actively using Scoop, accumulated 5 active matches
2. **Day 8**: Swipes right on Daniel, he already liked her → mutual match!
3. **Match popup shows**: "Match limit reached. Unmatch someone to chat with Daniel."
4. **Maria's thought process**: Reviews her 5 current matches
   - Match 1 (Jake): Great conversation, planning date
   - Match 2 (Chris): Conversation died, no response in 3 days
   - Match 3 (Tom): Interesting, chatting
   - Match 4 (Ryan): New match, just started talking
   - Match 5 (Ben): Fun conversation
5. **Decision**: Unmatches Chris (inactive match)
6. **Result**: Daniel's match immediately activates, starts chatting

**Maria's Feedback**: "At first I was annoyed, but it actually made me clean up dead matches. Now I only talk to people I'm genuinely interested in."

---

### Story 3: James Gets Paused for Inactivity

**Persona**: James, 30, busy consultant, downloaded app but forgot about it

**Journey**:
1. **Day 1**: Signs up, completes profile, swipes a few times
2. **Day 2-25**: Doesn't open app (busy with work travel)
3. **Day 25**: Receives email: "We miss you! Your account will pause in 5 days."
4. **Day 25**: Ignores email (still busy)
5. **Day 30**: Account automatically paused
6. **Day 30**: Receives email: "Your Scoop account is paused. Login anytime to reactivate."
7. **Day 45**: Opens app during flight delay
8. **Day 45**: Sees reactivation screen: "Welcome back! Reactivate your profile?"
9. **Day 45**: Clicks "Yes", account reactivated, gets 10 fresh swipes
10. **Day 45**: This time, gets a match and stays engaged

**James's Feedback**: "The pause was actually helpful - reminded me the app exists. When I came back, I was ready to use it properly."

---

## Screen Wireframes

### Screen 1: Swipe Deck (Home)

```
┌─────────────────────────────┐
│  SCOOP              [⚙️]    │ ← Top nav bar
├─────────────────────────────┤
│                             │
│  ┌───────────────────────┐  │
│  │                       │  │
│  │     [Profile Photo]   │  │ ← Main profile card
│  │                       │  │
│  │  Sarah, 26            │  │
│  │  📍 12 miles away     │  │
│  │                       │  │
│  │  "Love hiking and..." │  │
│  │  [Read more]          │  │
│  └───────────────────────┘  │
│                             │
│     ❌          ❤️          │ ← Swipe buttons
│                             │
│  ┌─────────────────────┐   │
│  │ 7 swipes left today │   │ ← Swipe counter
│  │ Reset in 5h 23m     │   │
│  └─────────────────────┘   │
│                             │
├─────────────────────────────┤
│ [🔥] [💬] [👤]              │ ← Bottom nav
└─────────────────────────────┘
```

---

### Screen 2: Matches List

```
┌─────────────────────────────┐
│  ← Matches                  │
├─────────────────────────────┤
│  Active (3/5) ⭐             │
│                             │
│  ┌─────────────────────┐   │
│  │ 📷 Jane, 26         │   │
│  │    "Hey! How's..."  │   │
│  │    2h ago      [1]  │   │ ← Unread count
│  └─────────────────────┘   │
│                             │
│  ┌─────────────────────┐   │
│  │ 📷 Sarah, 24        │   │
│  │    "Haha that's..." │   │
│  │    1d ago           │   │
│  └─────────────────────┘   │
│                             │
│  Pending (1) ⏳              │
│                             │
│  ┌─────────────────────┐   │
│  │ 📷 Emily, 27        │   │
│  │    Unmatch someone  │   │
│  │    to connect       │   │
│  └─────────────────────┘   │
│                             │
└─────────────────────────────┘
```

---

### Screen 3: Chat

```
┌─────────────────────────────┐
│  ← Sarah, 26        [···]   │ ← Back + options menu
├─────────────────────────────┤
│                             │
│         Hey! 👋              │ ← Received message
│         How's your weekend? │
│         2h ago              │
│                             │
│              Good thanks!   │ ← Sent message
│              Went hiking    │
│              Just now ✓✓    │
│                             │
│         Nice! Where?        │
│         1m ago              │
│                             │
│                             │
│                             │
├─────────────────────────────┤
│  Type a message...    [📷]  │ ← Input bar
│                       [➤]   │
└─────────────────────────────┘
```

---

## Error & Edge Case Flows

### Edge Case 1: No Profiles Available

```
User opens swipe deck
         │
         ▼
System queries for profiles
         │
         ▼
No profiles match criteria
         │
         ▼
┌─────────────────┐
│  No One New     │
│                 │
│  "You've seen   │
│  everyone in    │
│  your area!"    │
│                 │
│  Suggestions:   │
│  • Increase age │
│    range        │
│  • Increase     │
│    distance     │
│  • Check back   │
│    tomorrow     │
│                 │
│  [Adjust        │
│  Preferences]   │
└─────────────────┘
```

---

### Edge Case 2: Network Error During Swipe

```
User swipes right
         │
         ▼
App sends swipe to backend
         │
         ▼
Network error (no internet)
         │
         ▼
┌─────────────────┐
│  Connection     │
│  Error          │
│                 │
│  "Couldn't      │
│  record swipe.  │
│  Check your     │
│  internet."     │
│                 │
│  [Retry]        │
└─────────────────┘
         │ User clicks Retry
         ▼
Swipe successfully recorded
```

**Important**: Swipe NOT counted if network fails (prevents losing a swipe)

---

### Edge Case 3: Profile Reported/Deleted During Chat

```
User chatting with match
         │
         ▼
Match's account deleted or banned
         │
         ▼
┌─────────────────┐
│  Match          │
│  Unavailable    │
│                 │
│  "This user is  │
│  no longer      │
│  available."    │
│                 │
│  [OK]           │
└─────────────────┘
         │
         ▼
Match removed from list
```

---

## Summary

This user flow document covers:
- ✅ Complete onboarding from signup to first swipe
- ✅ Daily usage patterns (login, swipe, match, chat)
- ✅ Constraint interactions (swipe limit, match limit, inactivity)
- ✅ Real user stories demonstrating app value
- ✅ Screen wireframes for core interfaces
- ✅ Error handling and edge cases

**Next Steps for Design**:
1. Create high-fidelity mockups based on these wireframes
2. Design brand identity (logo, colors, typography)
3. Build interactive prototype in Figma
4. Conduct user testing with prototype

**Next Document**: Review PROJECT_STATE.md and CHANGELOG.md to track development progress.
