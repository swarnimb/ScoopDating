# Scoop - Constraint-Based System Documentation

## Table of Contents
1. [Philosophy](#philosophy)
2. [Core Constraints](#core-constraints)
3. [Constraint Implementation Logic](#constraint-implementation-logic)
4. [Edge Cases & Exceptions](#edge-cases--exceptions)
5. [User Experience Impact](#user-experience-impact)

---

## Philosophy

**The Problem with Traditional Dating Apps:**
- Endless swiping creates decision fatigue
- Gamification reduces people to profiles
- Unlimited matches lead to low engagement
- Users feel overwhelmed and disconnected

**The Scoop Solution:**
Intentional constraints that encourage:
- **Thoughtful decisions**: Limited swipes force users to be selective
- **Active engagement**: Match limits encourage conversation with existing matches
- **Quality connections**: Scarcity creates value and reduces ghosting
- **Accountability**: Inactivity consequences keep the community engaged

---

## Core Constraints

### 1. Daily Swipe Limit
**Constraint**: Maximum 10 swipes per 24-hour period

**Business Rule**:
- Each user gets exactly 10 swipes per day
- Counter resets at midnight UTC
- No rollover of unused swipes (use it or lose it)
- Applies to all users equally (no premium bypass in MVP)

**Why This Number**:
- 10 swipes is enough to be meaningful but not overwhelming
- Forces users to carefully evaluate each profile
- Creates anticipation to return daily
- Prevents mindless swiping addiction

**Visual Indicator**:
- Display remaining swipes: "8 swipes left today"
- Show countdown timer when depleted: "Swipes reset in 6h 23m"

---

### 2. Active Match Limit
**Constraint**: Maximum 5 concurrent active matches

**Business Rule**:
- Users cannot have more than 5 active matches simultaneously
- "Active match" = mutual match where chat is unlocked
- If user has 5 matches and receives a new mutual right-swipe:
  - New match goes into "pending queue"
  - User must unmatch one existing match to unlock new one
- Unmatching releases a slot immediately

**Why This Number**:
- 5 conversations is manageable without overwhelming users
- Encourages users to actually engage with matches instead of collecting them
- Reduces ghosting (can't ignore matches when slots are limited)
- Creates commitment to existing connections

**Exception Handling**:
- If User A and User B both swipe right when both have 5 matches:
  - Match is created but marked "pending" for both
  - First user to free a slot gets the match activated
  - Other user keeps it in pending state
  - Pending matches visible in "Waiting Room" section

**Visual Indicator**:
- Display match slots: "3/5 active matches"
- Show "Waiting Room" with pending matches
- Prompt when at capacity: "Unmatch someone to connect with [Name]"

---

### 3. Inactivity Auto-Pause
**Constraint**: Accounts inactive for 30+ days are automatically paused

**Business Rule**:
- "Active" = user opens the app OR sends a message OR swipes
- Inactivity period = 30 consecutive days without any activity
- After 30 days:
  - Account status changes to "paused"
  - Profile becomes invisible to other users
  - Cannot receive new matches
  - Existing matches preserved but inactive
- Reactivation:
  - User logs back in
  - Must confirm they want to reactivate
  - Profile becomes visible again immediately
  - Swipe count resets to 10

**Why This Constraint**:
- Keeps active users pool engaged and responsive
- Prevents "dead profiles" that never respond
- Improves match quality (people who are actually using the app)
- Respects user privacy (inactive = probably not interested anymore)

**Notification System**:
- Warning email at 25 days: "You haven't used Scoop in a while"
- Pause notification at 30 days: "Your account has been paused"
- Welcome back email on reactivation

**Visual Indicator**:
- Banner on login after long absence: "Welcome back! Reactivate your profile?"

---

### 4. Geographic Constraint
**Constraint**: Only see profiles within specified radius

**Business Rule**:
- Users set maximum distance preference (5, 10, 25, 50, 100 miles)
- Only profiles within that radius are shown
- Distance calculated from city center (not exact GPS for privacy)
- Updates when user changes location manually

**Why This Constraint**:
- Promotes realistic, in-person meetups
- Respects user's willingness to travel
- Privacy-friendly (no exact location tracking)

---

### 5. Age Range Constraint
**Constraint**: Only see profiles within specified age range

**Business Rule**:
- Users set preferred age range (e.g., 25-35)
- Only profiles within that range are shown
- Mutual filtering: Both users' preferences must match
  - Example: User A (28) wants 25-35, User B (32) wants 30-40
  - They WON'T see each other (A is outside B's range)

**Why This Constraint**:
- Respects user preferences
- Improves match quality
- Reduces irrelevant profiles

---

### 6. Profile Completion Constraint
**Constraint**: Cannot start swiping until profile is at least 80% complete

**Business Rule**:
- Required fields:
  - Minimum 3 photos
  - Bio (minimum 50 characters)
  - Age
  - Location
  - Gender & preference
- Optional but encouraged:
  - Interests/hobbies
  - Occupation
  - Height, education, etc.

**Why This Constraint**:
- Ensures quality profiles
- Gives users enough information to make decisions
- Reduces low-effort profiles

**Visual Indicator**:
- Progress bar: "Profile 60% complete"
- Disabled swipe button until 80% reached

---

## Constraint Implementation Logic

### Algorithm 1: Daily Swipe Reset
**When**: Every day at midnight UTC
**Trigger**: Scheduled Cloud Function

```
FUNCTION dailySwipeReset():
  currentTime = getCurrentUTCTime()

  FOR EACH user IN database WHERE accountStatus = "active":
    user.swipesRemaining = 10
    user.lastSwipeReset = currentTime
    UPDATE user IN database
  END FOR

  LOG "Daily swipe reset completed for [X] users"
END FUNCTION
```

**Edge Case**: What if user swipes at 11:59 PM?
- Swipe counts immediately
- At midnight, counter resets to 10
- No double-dipping prevented (swipe logs timestamped)

---

### Algorithm 2: Swipe Limit Enforcement
**When**: User attempts to swipe on a profile
**Trigger**: User action (swipe left/right)

```
FUNCTION attemptSwipe(userId, targetProfileId, direction):
  user = GET user FROM database WHERE id = userId

  // Check if swipes remaining
  IF user.swipesRemaining <= 0:
    RETURN {
      success: false,
      message: "You've used all 10 swipes today. Come back tomorrow!",
      resetTime: calculateTimeUntilReset(user.lastSwipeReset)
    }
  END IF

  // Process swipe
  user.swipesRemaining = user.swipesRemaining - 1
  user.lastActiveDate = getCurrentUTCTime()
  UPDATE user IN database

  // Log the swipe
  CREATE swipeLog:
    userId: userId
    targetProfileId: targetProfileId
    direction: direction  // "left" or "right"
    timestamp: getCurrentUTCTime()
  SAVE swipeLog TO database

  // If right swipe, check for match
  IF direction = "right":
    CALL checkForMatch(userId, targetProfileId)
  END IF

  RETURN {
    success: true,
    swipesRemaining: user.swipesRemaining
  }
END FUNCTION
```

---

### Algorithm 3: Match Creation with Limit Enforcement
**When**: User swipes right on someone who already swiped right on them
**Trigger**: Mutual right-swipe detected

```
FUNCTION checkForMatch(userAId, userBId):
  userA = GET user FROM database WHERE id = userAId
  userB = GET user FROM database WHERE id = userBId

  // Check if User B already swiped right on User A
  existingSwipe = GET swipeLog WHERE
    userId = userBId AND
    targetProfileId = userAId AND
    direction = "right"

  IF existingSwipe DOES NOT EXIST:
    // No mutual match yet, just store the like
    RETURN {matchCreated: false}
  END IF

  // Mutual match detected! Now check match limits
  userAMatches = COUNT active matches WHERE userId = userAId
  userBMatches = COUNT active matches WHERE userId = userBId

  IF userAMatches < 5 AND userBMatches < 5:
    // Both users have slots available
    CREATE match:
      participants: [userAId, userBId]
      status: "active"
      createdAt: getCurrentUTCTime()
      lastMessageAt: null
    SAVE match TO database

    // Send notifications
    SEND push notification TO userA: "You have a new match with [UserB Name]!"
    SEND push notification TO userB: "You have a new match with [UserA Name]!"

    RETURN {matchCreated: true, status: "active"}

  ELSE IF userAMatches >= 5 AND userBMatches < 5:
    // User A is at capacity, User B has space
    CREATE match:
      participants: [userAId, userBId]
      status: "pending_for_userA"  // Waiting for User A to free a slot
      createdAt: getCurrentUTCTime()
    SAVE match TO database

    SEND push notification TO userB: "You have a new match with [UserA Name]!"
    SEND push notification TO userA: "New match waiting! Unmatch someone to connect."

    RETURN {matchCreated: true, status: "pending"}

  ELSE IF userAMatches < 5 AND userBMatches >= 5:
    // User B is at capacity, User A has space
    CREATE match:
      participants: [userAId, userBId]
      status: "pending_for_userB"
      createdAt: getCurrentUTCTime()
    SAVE match TO database

    SEND push notification TO userA: "You have a new match with [UserB Name]!"
    SEND push notification TO userB: "New match waiting! Unmatch someone to connect."

    RETURN {matchCreated: true, status: "pending"}

  ELSE:
    // Both users at capacity
    CREATE match:
      participants: [userAId, userBId]
      status: "pending_for_both"
      createdAt: getCurrentUTCTime()
    SAVE match TO database

    SEND push notification TO userA: "New match waiting! Unmatch someone to connect."
    SEND push notification TO userB: "New match waiting! Unmatch someone to connect."

    RETURN {matchCreated: true, status: "pending"}
  END IF
END FUNCTION
```

---

### Algorithm 4: Inactivity Detection & Account Pause
**When**: Every day at 2 AM UTC
**Trigger**: Scheduled Cloud Function

```
FUNCTION checkInactiveUsers():
  currentDate = getCurrentUTCDate()
  inactivityThreshold = 30  // days

  FOR EACH user IN database WHERE accountStatus = "active":
    daysSinceActive = currentDate - user.lastActiveDate

    IF daysSinceActive >= inactivityThreshold:
      // Pause the account
      user.accountStatus = "paused"
      user.pausedAt = currentDate
      user.pauseReason = "inactivity"
      UPDATE user IN database

      // Send notification
      SEND email TO user.email:
        subject: "Your Scoop account has been paused"
        body: "We noticed you haven't used Scoop in 30 days. Your account is now paused.
               Log back in anytime to reactivate!"

      LOG "User [userId] paused due to inactivity"

    ELSE IF daysSinceActive >= (inactivityThreshold - 5):
      // Send warning at 25 days
      SEND email TO user.email:
        subject: "We miss you on Scoop!"
        body: "You haven't been active in a while. Your account will pause in 5 days if you don't log in."
    END IF
  END FOR

  LOG "Inactivity check completed"
END FUNCTION
```

---

### Algorithm 5: Account Reactivation
**When**: Paused user logs back in
**Trigger**: User authentication

```
FUNCTION onUserLogin(userId):
  user = GET user FROM database WHERE id = userId

  IF user.accountStatus = "paused":
    // Show reactivation prompt
    SHOW dialog TO user:
      "Welcome back! Would you like to reactivate your profile?"
      [Reactivate] [Stay Paused]

    IF user clicks "Reactivate":
      user.accountStatus = "active"
      user.lastActiveDate = getCurrentUTCDate()
      user.swipesRemaining = 10  // Reset swipes
      user.lastSwipeReset = getCurrentUTCTime()
      UPDATE user IN database

      LOG "User [userId] reactivated after pause"

      RETURN {status: "active", message: "Welcome back! You have 10 swipes today."}
    ELSE:
      RETURN {status: "paused", message: "Your profile remains paused."}
    END IF
  ELSE:
    // Normal login, update last active
    user.lastActiveDate = getCurrentUTCDate()
    UPDATE user IN database
    RETURN {status: "active"}
  END IF
END FUNCTION
```

---

## Edge Cases & Exceptions

### Edge Case 1: Simultaneous Swipes
**Scenario**: User A and User B swipe right on each other at exactly the same time, both have 5 matches.

**Solution**:
- Database transaction ensures only one match creation operation succeeds
- Match status set to "pending_for_both"
- First user to free a slot gets it activated
- Firebase Firestore atomic operations prevent race conditions

---

### Edge Case 2: User Unmatches to Free Slot
**Scenario**: User has 5 matches, 2 pending matches in waiting room. User unmatches one person.

**Solution**:
```
FUNCTION onUnmatch(userId, matchId):
  // Remove the match
  DELETE match WHERE id = matchId

  // Check for pending matches
  pendingMatches = GET matches WHERE
    participants CONTAINS userId AND
    status CONTAINS "pending_for_" + userId
  ORDER BY createdAt ASC  // Oldest pending first

  IF pendingMatches EXIST:
    oldestPending = pendingMatches[0]

    // Activate the oldest pending match for this user
    IF oldestPending.status = "pending_for_both":
      // Other user also at capacity
      oldestPending.status = "pending_for_otherUser"
    ELSE:
      // Other user has space, fully activate
      oldestPending.status = "active"
      SEND push notification TO both users
    END IF

    UPDATE oldestPending IN database
  END IF
END FUNCTION
```

---

### Edge Case 3: Time Zone Confusion
**Scenario**: User in California swipes at 11:50 PM local time (7:50 AM UTC). Reset happens at midnight UTC (4 PM California time).

**Solution**:
- All timestamps stored in UTC
- All resets happen at midnight UTC globally
- User interface displays countdown timer in user's local time
- Example: "Swipes reset in 8h 10m" (not "resets at midnight")

---

### Edge Case 4: Rapid Swiping (Rate Limiting)
**Scenario**: User writes script to automate swiping or swipes extremely fast.

**Solution**:
```
FUNCTION attemptSwipe(userId, targetProfileId, direction):
  // Check for suspicious activity
  recentSwipes = GET swipeLogs WHERE
    userId = userId AND
    timestamp > (currentTime - 10 seconds)

  IF recentSwipes.count > 5:
    // More than 5 swipes in 10 seconds = suspicious
    FLAG user FOR manual review
    RETURN {
      success: false,
      message: "Slow down! Take time to review each profile."
    }
  END IF

  // Continue normal swipe processing...
END FUNCTION
```

---

## User Experience Impact

### Positive Impacts
1. **Reduces Decision Fatigue**: 10 swipes vs. unlimited = less overwhelming
2. **Increases Engagement Quality**: Users actually talk to their 5 matches
3. **Creates Daily Habit**: Users return daily to use their swipes
4. **Reduces Ghosting**: Can't ghost matches when slots are limited
5. **Maintains Active Community**: Auto-pause keeps user base engaged

### Potential Friction Points & Mitigations

| Friction Point | User Complaint | Our Mitigation |
|---------------|----------------|----------------|
| "10 swipes isn't enough!" | Frustration with limit | - Education: "Quality over quantity"<br>- Show success stories of meaningful matches<br>- Future: Premium tier with 15 swipes |
| "All my matches are pending!" | Can't unlock new matches | - Clear UI showing why<br>- Encourage engagement with current matches<br>- "Unmatch to unlock" CTA button |
| "Why was my account paused?" | Confusion about inactivity | - Warning email at 25 days<br>- Clear explanation on reactivation screen<br>- Easy one-click reactivation |
| "I ran out of profiles!" | Small user base in area | - Widen geographic radius suggestion<br>- Adjust age range suggestion<br>- "Check back tomorrow for new profiles" |

---

## Future Constraint Considerations

These are NOT in MVP but worth considering:

### Potential Addition: Message Response Constraint
**Idea**: If you don't respond to a match in 48 hours, that match slot auto-unmatches
**Pros**: Prevents inactive matches taking up slots
**Cons**: May be too aggressive, could frustrate busy users

### Potential Addition: Premium Tier
**Idea**: Paid users get 15 swipes/day and 7 match slots
**Pros**: Revenue model, rewards engaged users
**Cons**: Could create inequality, undermines constraint philosophy

### Potential Addition: "Super Swipe" Currency
**Idea**: 1 special swipe per week that bypasses all limits (sender's match limit ignored)
**Pros**: Gives users agency on special connections
**Cons**: Complexity, could be abused

---

## Summary

Scoop's constraints are not arbitrary limitations—they're **intentional design choices** that:
1. Improve match quality by forcing thoughtful decisions
2. Increase engagement by limiting distractions
3. Reduce ghosting through match slot scarcity
4. Maintain active community through inactivity pauses

Every constraint has a **clear algorithm** for enforcement and **thoughtful edge case handling**. The goal is to create a dating app that respects users' time and encourages genuine connections.

**Next Document**: Review DATABASE_SCHEMA.md to understand how these constraints are stored and tracked in the database.
