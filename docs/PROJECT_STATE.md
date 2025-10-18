# Scoop - Project State

**Last Updated**: 2025-10-18
**Current Phase**: Development - Environment Setup Complete
**Progress**: 5% (Environment ready, first screen built)

---

## Session History

### Session 1 - 2025-10-17
**Duration**: Initial setup
**Participants**: Developer + Claude Code

**Completed**:
- ✅ Created project folder structure
- ✅ Initialized Git repository
- ✅ Created comprehensive documentation:
  - ARCHITECTURE.md (system design, tech stack, components)
  - CONSTRAINTS.md (all business rules and algorithms)
  - DATABASE_SCHEMA.md (complete data models)
  - API_REFERENCE.md (all endpoints and flows)
  - USER_FLOW.md (user journeys and wireframes)
  - PROJECT_STATE.md (this file)
  - CHANGELOG.md (session log)
  - DEVELOPMENT_GUIDE.md (setup instructions)
  - README.md (project overview)
- ✅ Created .gitignore file

**Decisions Made**:
1. **Tech Stack**: React Native + Expo + Firebase
   - Why: Beginner-friendly, cross-platform, scalable
2. **Core Constraints**: 10 swipes/day, 5 max matches, 30-day pause
3. **Database**: Cloud Firestore (NoSQL)
4. **No premium tier in MVP** (keep it simple initially)

**Blockers**: None currently

**Next Session Goals**:
1. Set up development environment (Node.js, Expo, Firebase)
2. Create Firebase project
3. Build authentication screens (signup/login)
4. Begin profile creation flow

---

### Session 2 - 2025-10-18
**Duration**: ~3 hours
**Participants**: Developer + Claude Code

**Completed**:
- ✅ Verified Node.js v22.16.0 already installed
- ✅ Installed Expo CLI globally
- ✅ Created Firebase project: `scoop-dating`
- ✅ Enabled Firebase Authentication (Email/Password)
- ✅ Created Firestore database (us-east1, test mode)
- ✅ Set up Firebase Storage (billing plan enabled)
- ✅ Initialized React Native app with Expo in `src/frontend/`
- ✅ Installed Firebase SDK and React Navigation dependencies
- ✅ Created Firebase configuration file (`config/firebase.js`)
- ✅ Built WelcomeScreen with Scoop branding
- ✅ Successfully tested app on iPhone via Expo Go
- ✅ Committed changes to Git (commit 10b246e)

**Decisions Made**:
1. **Firebase region**: us-east1 (for free Storage tier)
2. **Billing enabled**: Required for Storage, but won't be charged in free tier limits
3. **Development tool**: VS Code confirmed as code editor
4. **No GitHub Copilot**: Using Claude Code for learning-focused development
5. **Testing method**: Expo Go on iPhone (Windows doesn't support iOS simulator)

**Challenges Encountered**:
1. Firebase Storage requires billing plan (resolved by upgrading to Blaze plan with budget alerts)
2. PowerShell execution policy blocked npx (resolved by using Command Prompt instead)
3. Port 8081 conflict (resolved by killing previous Node process)

**Blockers**: None currently

**Next Session Goals**:
1. Build Signup screen with email/password inputs
2. Build Login screen with authentication
3. Implement Firebase authentication logic
4. Add React Navigation for screen switching
5. Add form validation and error handling

---

## Current Architecture Overview

### Tech Stack
- **Frontend**: React Native + Expo
- **Backend**: Firebase (Auth, Firestore, Cloud Functions, Storage)
- **Database**: Cloud Firestore
- **Version Control**: Git + GitHub

### Project Structure
```
/Dating App - Scoop
  /docs              - All documentation (you are here)
  /src
    /frontend        - React Native app (not created yet)
    /backend         - Cloud Functions (not created yet)
    /database        - Firestore rules & indexes (not created yet)
  /design            - Wireframes, mockups (not created yet)
  /tests             - Test files (not created yet)
  .gitignore
```

---

## Completed Features

*None yet - documentation phase complete*

---

## In Progress

- Documentation review and approval

---

## Pending Features (MVP Roadmap)

### Phase 1: Foundation (Weeks 1-2)
- [ ] Development environment setup
- [ ] Firebase project creation
- [ ] React Native + Expo initialization
- [ ] Basic navigation structure

### Phase 2: Authentication (Week 2)
- [ ] Email signup with verification
- [ ] Login screen
- [ ] Password reset flow
- [ ] Firebase Auth integration

### Phase 3: Profile Management (Week 3)
- [ ] Profile creation wizard (5 steps)
- [ ] Photo upload to Firebase Storage
- [ ] Profile completeness calculation
- [ ] Profile edit functionality
- [ ] Profile view (for other users)

### Phase 4: Swipe Interface (Week 4)
- [ ] Swipe deck UI (card stack)
- [ ] Swipe left/right gestures
- [ ] Swipe limit enforcement (10/day)
- [ ] Daily swipe reset Cloud Function
- [ ] Profile filtering logic (age, distance, gender)

### Phase 5: Matching System (Week 5)
- [ ] Match creation algorithm
- [ ] Match limit enforcement (5 max)
- [ ] Pending match queue
- [ ] Match activation on unmatch
- [ ] "It's a Match!" screen

### Phase 6: Chat (Week 6)
- [ ] Chat interface UI
- [ ] Real-time message sync (Firestore)
- [ ] Send message functionality
- [ ] Read receipts
- [ ] Push notifications for new messages

### Phase 7: Constraints & Automation (Week 7)
- [ ] Inactivity tracking
- [ ] 30-day auto-pause Cloud Function
- [ ] Account reactivation flow
- [ ] Warning emails (25 days)

### Phase 8: Safety & Moderation (Week 7)
- [ ] Block user functionality
- [ ] Report user functionality
- [ ] Admin review dashboard (basic)

### Phase 9: Testing & Polish (Week 8)
- [ ] End-to-end testing on iOS simulator
- [ ] End-to-end testing on Android emulator
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] UI/UX polish

### Phase 10: Beta Launch (Week 8-9)
- [ ] Deploy to TestFlight (iOS)
- [ ] Deploy to Google Play Beta (Android)
- [ ] Create landing page
- [ ] Reddit outreach (r/dating, r/onlinedating)
- [ ] Recruit 20-50 beta testers
- [ ] Gather feedback

---

## Known Issues

*None yet*

---

## Technical Debt

*None yet - project hasn't started*

---

## Future Enhancements (Post-MVP)

These are NOT in the MVP but worth considering later:

1. **Premium Tier**
   - 15 swipes/day instead of 10
   - 7 match slots instead of 5
   - See who liked you
   - Rewind last swipe

2. **Advanced Matching**
   - Compatibility score algorithm
   - Mutual interests highlighting
   - Icebreaker prompts

3. **Enhanced Chat**
   - Photo/GIF sharing
   - Voice messages
   - Video calls
   - Emoji reactions

4. **Social Features**
   - Instagram integration
   - Spotify integration
   - Group dates (double dates)

5. **Safety Features**
   - Photo verification (prevent catfishing)
   - Background checks (optional)
   - In-app video chat before meeting

6. **Analytics Dashboard**
   - User stats (who views your profile)
   - Match success rate
   - Popular profile features

---

## Team

**Current Team**: Solo founder + Claude Code assistant

**Needed Roles** (future):
- UI/UX Designer (for high-fidelity mockups)
- Marketing/Growth (for user acquisition)
- Customer Support (as user base grows)

---

## Metrics to Track

Once app launches, track these KPIs:

### Engagement Metrics
- Daily Active Users (DAU)
- Weekly Active Users (WAU)
- Average swipes per user per day
- Average time spent in app

### Match Metrics
- Total matches created
- % of swipes that lead to matches
- % of matches that lead to messages
- Average messages per match

### Retention Metrics
- Day 1, 7, 30 retention rate
- Accounts paused (inactivity)
- Accounts reactivated
- Churn rate

### Constraint Metrics
- % of users hitting swipe limit daily
- % of users hitting match limit
- Average pending matches per user
- Average time to unmatch

---

## Budget & Resources

### Development Costs (MVP)
- Firebase Free Tier: $0/month (until 500+ users)
- Domain name: ~$12/year
- Apple Developer account: $99/year (for iOS)
- Google Play Developer account: $25 one-time

**Total MVP Cost**: ~$136 (one-time) + $0/month initially

### Post-Launch Costs (estimate)
- Firebase Blaze plan: ~$50-200/month (1K-10K users)
- Push notification service: $0 (Firebase included)
- Email service (SendGrid): $0 (free tier)
- Analytics (Firebase): $0 (free tier)

---

## Risk Assessment

### Technical Risks
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Firebase scaling issues | Low | High | Use Firebase best practices, add caching |
| Complex matching algorithm bugs | Medium | High | Thorough testing, start simple |
| Real-time chat latency | Low | Medium | Use Firestore real-time listeners |
| Photo storage costs | Medium | Medium | Compress images, set limits |

### Product Risks
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Users dislike constraints | Medium | High | Clear onboarding explaining "why", A/B test limits |
| Not enough users in area | High | High | Start in dense urban areas, referral program |
| Spam/fake profiles | Medium | High | Email verification, report system, manual review |
| Users bypass match limit with multiple accounts | Low | Medium | Device fingerprinting (future) |

### Business Risks
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Can't acquire users | High | High | Strong Reddit/social media strategy, word-of-mouth |
| Can't monetize (free forever) | Medium | Medium | Premium tier, optional features |
| Copycat competitors | Medium | Low | Speed to market, build community |

---

## Communication Protocol

### For Next Session (Starting Fresh)

At the start of each new coding session with Claude Code:

1. **Share this file** (PROJECT_STATE.md) - Quick context reload
2. **Share CHANGELOG.md** - What we did last time
3. **Mention any blockers** - Issues you encountered since last session
4. **State your goal** - What you want to accomplish this session

### Example Session Start Message:
```
"I'm back to work on Scoop. Last session we completed documentation.
Today I want to set up the development environment and create the
Firebase project. Here's the PROJECT_STATE.md file: [paste contents]"
```

---

## Questions to Resolve

1. **Swipe reset time**: Midnight UTC or midnight local time?
   - **Decision needed**: UTC is simpler, local is more user-friendly

2. **Photo limits**: Should we allow 6 photos max or more?
   - **Current decision**: 3 min, 6 max

3. **Bio length**: 500 characters enough?
   - **Current decision**: Yes, forces conciseness

4. **Gender options**: Just male/female or include non-binary/other?
   - **Current decision**: Include "non-binary" and "prefer not to say"

5. **Match expiration**: Should matches expire if no messages after X days?
   - **Decision**: NO for MVP (keep it simple), consider later

---

## Success Criteria for MVP

We'll know the MVP is ready to beta test when:
- ✅ Users can sign up, create profile, verify email
- ✅ Users can swipe on 10 profiles per day
- ✅ Swipe limit enforced correctly
- ✅ Matches create successfully when mutual
- ✅ Match limit (5) enforced correctly
- ✅ Pending matches queue works
- ✅ Chat works in real-time
- ✅ Push notifications work
- ✅ Inactivity pause works (30 days)
- ✅ No critical bugs in happy path
- ✅ Works on both iOS and Android

**Target**: 8 weeks to beta-ready MVP

---

## Notes

- **Philosophy**: Build enterprise-quality from day one, but start with MVP scope
- **Learning approach**: Explain every function's purpose, don't just write code
- **Version control**: Commit after every meaningful feature completion
- **Testing**: Test each feature immediately after building it
- **Documentation**: Update this file after every session

---

**Last Updated By**: Claude Code
**Next Update**: After Session 2
