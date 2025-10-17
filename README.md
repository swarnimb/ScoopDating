# Scoop - Constraint-Based Dating App

> A dating app that encourages meaningful connections through intentional design constraints.

[![Status](https://img.shields.io/badge/status-in%20development-yellow)]()
[![Tech Stack](https://img.shields.io/badge/stack-React%20Native%20%7C%20Firebase-blue)]()
[![License](https://img.shields.io/badge/license-MIT-green)]()

---

## 📖 Overview

**Scoop** is a dating application designed to combat the fatigue and superficiality of traditional dating apps. By implementing thoughtful constraints, Scoop encourages users to be more intentional, engaged, and genuine in their search for meaningful connections.

### The Problem
Traditional dating apps suffer from:
- ❌ Endless swiping causing decision fatigue
- ❌ Gamification reducing people to profiles
- ❌ Unlimited matches leading to low engagement
- ❌ Ghosting and lack of accountability

### The Scoop Solution
- ✅ **10 swipes per day** - Forces thoughtful profile evaluation
- ✅ **5 max concurrent matches** - Encourages active engagement with existing conversations
- ✅ **30-day inactivity pause** - Maintains an active, responsive community
- ✅ **Quality over quantity** - Scarcity creates value and reduces ghosting

---

## 🚀 Features

### Core Functionality
- **Smart Matching Algorithm** - Age, location, and preference-based filtering
- **Daily Swipe Limit** - 10 carefully considered swipes per day
- **Active Match Limit** - Maximum 5 concurrent matches
- **Real-Time Chat** - Instant messaging with matched users
- **Inactivity Management** - Automatic account pause after 30 days of inactivity
- **Safety Features** - Block and report functionality

### Constraints (What Makes Scoop Different)
1. **Daily Swipe Limit (10/day)**
   - Resets at midnight UTC
   - Forces users to carefully evaluate each profile
   - Creates anticipation to return daily

2. **Match Limit (5 concurrent)**
   - Prevents match hoarding
   - Encourages actual conversations
   - Pending queue for matches when slots are full

3. **Inactivity Auto-Pause (30 days)**
   - Warning at 25 days
   - Automatic pause at 30 days
   - One-click reactivation anytime

---

## 🛠️ Tech Stack

### Frontend
- **React Native** - Cross-platform mobile development
- **Expo** - Simplified development and deployment
- **React Navigation** - Screen navigation

### Backend
- **Firebase Authentication** - User signup/login with email verification
- **Cloud Firestore** - Real-time NoSQL database
- **Firebase Cloud Functions** - Serverless business logic (swipe resets, match creation, inactivity checks)
- **Firebase Storage** - Profile photo hosting
- **Firebase Cloud Messaging** - Push notifications

### Why This Stack?
- **Beginner-Friendly**: React Native uses JavaScript, easier than native Swift/Kotlin
- **Cross-Platform**: One codebase for iOS and Android
- **Scalable**: Firebase auto-scales from 100 to 100,000+ users
- **Cost-Effective**: Free tier covers MVP and early growth
- **Real-Time**: Built-in real-time sync for chat

---

## 📁 Project Structure

```
/Dating App - Scoop
├── /docs                          # Comprehensive documentation
│   ├── ARCHITECTURE.md            # System design and tech stack
│   ├── CONSTRAINTS.md             # Business rules and algorithms
│   ├── DATABASE_SCHEMA.md         # Complete data models
│   ├── API_REFERENCE.md           # All API endpoints
│   ├── USER_FLOW.md               # User journeys and wireframes
│   ├── PROJECT_STATE.md           # Current progress
│   ├── CHANGELOG.md               # Session-by-session updates
│   └── DEVELOPMENT_GUIDE.md       # Setup and workflow instructions
├── /src
│   ├── /frontend                  # React Native app (to be created)
│   ├── /backend                   # Cloud Functions (to be created)
│   └── /database                  # Firestore rules (to be created)
├── /design                        # Wireframes and mockups
├── /tests                         # Test files
├── .gitignore
└── README.md                      # You are here
```

---

## 🎯 Current Status

**Phase**: Documentation & Planning (Complete)
**Progress**: 0% code, 100% architecture documented
**Next Steps**: Environment setup and Firebase configuration

### Completed ✅
- Complete system architecture documented
- All business constraints defined with algorithms
- Database schema fully designed
- API endpoints documented
- User flows and wireframes created
- Development guide written
- Git repository initialized

### In Progress 🔄
- None (awaiting next session)

### Coming Next 📅
- Development environment setup
- Firebase project creation
- React Native app initialization
- Authentication screens (signup/login)

---

## 🚦 Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn
- Expo CLI
- Code editor (VS Code recommended)
- Firebase account

### Installation

**Full setup instructions are in** [`docs/DEVELOPMENT_GUIDE.md`](docs/DEVELOPMENT_GUIDE.md)

Quick start:
```bash
# Clone repository
git clone https://github.com/yourusername/scoop-dating.git
cd scoop-dating

# Install dependencies (when frontend is created)
cd src/frontend
npm install

# Start development server
npx expo start
```

---

## 📚 Documentation

This project has extensive documentation to ensure understanding of every component:

### Core Documentation
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Understand the complete system design, why each technology was chosen, how components interact, and scalability strategy
- **[CONSTRAINTS.md](docs/CONSTRAINTS.md)** - Deep dive into all business rules, constraint algorithms (swipe limits, match limits, inactivity), and edge case handling
- **[DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md)** - Complete data models, relationships, security rules, and why each field exists
- **[API_REFERENCE.md](docs/API_REFERENCE.md)** - All API endpoints with request/response examples, error handling, and usage flows

### Development Documentation
- **[DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md)** - Step-by-step environment setup, running the app, deployment, and troubleshooting
- **[USER_FLOW.md](docs/USER_FLOW.md)** - User journeys from signup to match to chat, including wireframes
- **[PROJECT_STATE.md](docs/PROJECT_STATE.md)** - Current progress, roadmap, metrics to track, and session notes
- **[CHANGELOG.md](docs/CHANGELOG.md)** - Detailed session-by-session development log

### Why So Much Documentation?
This project is being built by a **non-technical founder** who wants to:
- Understand every algorithm and business decision
- Build enterprise-quality software (not just MVP shortcuts)
- Be able to explain the system to investors, engineers, and users
- Maintain memory across multiple development sessions

**Philosophy**: No "vibe-coding" - understand BEFORE implementing.

---

## 🎨 Design Philosophy

### Core Principles
1. **Intentionality** - Every constraint has a purpose
2. **Quality over Quantity** - Fewer, better matches
3. **Accountability** - Users commit to conversations
4. **Simplicity** - Clean, intuitive interface
5. **Privacy** - City-level location only, no GPS tracking

### User Experience Goals
- Reduce decision fatigue through limited swipes
- Decrease ghosting through match limits
- Maintain active community through inactivity pauses
- Create anticipation through daily swipe resets
- Foster genuine connections through scarcity

---

## 🗺️ Roadmap

### Phase 1: MVP Foundation (Week 1-2) ⏳
- [ ] Development environment setup
- [ ] Firebase project configuration
- [ ] React Native app initialization
- [ ] Basic navigation structure

### Phase 2: Authentication (Week 2-3)
- [ ] Email signup with verification
- [ ] Login/logout functionality
- [ ] Password reset flow

### Phase 3: Profile System (Week 3-4)
- [ ] Profile creation wizard
- [ ] Photo upload (3-6 photos)
- [ ] Profile editing
- [ ] Profile completeness calculation

### Phase 4: Swipe Interface (Week 4-5)
- [ ] Swipe deck UI
- [ ] Swipe gestures (left/right)
- [ ] Daily limit enforcement (10 swipes)
- [ ] Profile filtering (age, distance, gender)

### Phase 5: Matching (Week 5-6)
- [ ] Match creation algorithm
- [ ] Match limit enforcement (5 max)
- [ ] Pending match queue
- [ ] "It's a Match!" screen

### Phase 6: Chat (Week 6-7)
- [ ] Real-time messaging
- [ ] Read receipts
- [ ] Push notifications

### Phase 7: Automation (Week 7)
- [ ] Daily swipe reset Cloud Function
- [ ] Inactivity checker Cloud Function
- [ ] Warning emails

### Phase 8: Safety (Week 7)
- [ ] Block user
- [ ] Report user
- [ ] Admin moderation dashboard

### Phase 9: Testing & Polish (Week 8)
- [ ] End-to-end testing
- [ ] Bug fixes
- [ ] UI/UX refinements
- [ ] Performance optimization

### Phase 10: Beta Launch (Week 8-9)
- [ ] Deploy to TestFlight (iOS)
- [ ] Deploy to Google Play Beta (Android)
- [ ] Create landing page
- [ ] Reddit community outreach
- [ ] Recruit 20-50 beta testers

**Estimated Timeline**: 8-9 weeks to beta-ready MVP

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Signup flow works end-to-end
- [ ] Login flow handles errors correctly
- [ ] Profile creation enforces validation
- [ ] Swipe limit enforces correctly (10/day)
- [ ] Match limit enforces correctly (5 max)
- [ ] Chat messages send in real-time
- [ ] Inactivity pause triggers at 30 days
- [ ] Unmatching frees a slot for pending matches

### Automated Testing (Future)
- Unit tests (Jest)
- Integration tests (React Native Testing Library)
- E2E tests (Detox)

---

## 🤝 Contributing

This is currently a **solo project** in early development. Contributions are not being accepted at this time, but feel free to:
- ⭐ Star the project if you like the concept
- 🐛 Open issues for bugs (once app is public)
- 💡 Share feedback and suggestions

Once the MVP is live, contribution guidelines will be added.

---

## 📊 Success Metrics

We'll measure success through:

### Engagement
- Daily Active Users (DAU)
- Average swipes per user per day
- % of users hitting daily swipe limit

### Matching
- Match rate (% of swipes leading to matches)
- Message rate (% of matches leading to conversation)
- Average messages per match

### Retention
- Day 1, 7, 30 retention rates
- Accounts paused (inactivity)
- Accounts reactivated
- User NPS (Net Promoter Score)

### Constraint Effectiveness
- % of users hitting match limit (indicates engagement)
- Average time to unmatch (indicates connection quality)
- Pending match queue length (indicates demand)

---

## 💰 Business Model (Future)

**MVP**: Completely free (validate concept first)

**Post-MVP Options**:
1. **Premium Tier** ($4.99/month)
   - 15 swipes/day instead of 10
   - 7 match slots instead of 5
   - See who liked you
   - Rewind last swipe

2. **Optional Add-Ons**
   - Boost (appear more in others' decks)
   - Super Swipe (notify user you liked them)

3. **Ethical Monetization Principles**
   - Core matching always free
   - No pay-to-win mechanics
   - No selling user data
   - No intrusive ads

---

## 📜 License

MIT License - See [LICENSE](LICENSE) file for details

---

## 📞 Contact

**Project Creator**: [Your Name]
**Email**: your.email@example.com
**GitHub**: [@yourusername](https://github.com/yourusername)
**Twitter**: [@yourhandle](https://twitter.com/yourhandle)

---

## 🙏 Acknowledgments

- Inspired by constraint-based apps like **Coffee Meets Bagel** and **Hinge**
- Built with guidance from the React Native, Firebase, and dating app communities
- Special thanks to the "slow dating" movement for validating this approach

---

## 📝 FAQ

### Why constraints?
Traditional dating apps overwhelm users with unlimited options, leading to decision fatigue and superficial engagement. Constraints force intentionality and create scarcity, which increases perceived value and engagement quality.

### Why only 10 swipes per day?
Studies show decision fatigue sets in after 10-15 choices. This limit ensures users carefully evaluate each profile rather than mindlessly swiping.

### What if I run out of profiles in my area?
The app will suggest widening your age range or distance preferences. As the user base grows, this becomes less of an issue.

### Will there be a premium version?
Not in the MVP. We want to validate the core concept first. Premium features may be added later based on user feedback.

### How is this different from Hinge or Coffee Meets Bagel?
While inspired by these apps, Scoop has stricter constraints (5 match limit vs. unlimited) and a unique inactivity pause feature. Our goal is to be even more intentional.

### What about privacy?
We store only city-level location (not GPS coordinates), require email verification, and never sell user data. Full privacy policy will be available at launch.

---

## 🎯 Project Vision

**Short-Term** (3 months): Beta test with 50-100 users, gather feedback, iterate
**Mid-Term** (6 months): Public launch in 1-2 major cities (San Francisco, New York)
**Long-Term** (1 year): Expand to 10+ cities, 10,000+ active users, sustainable business model

**Mission**: Create a dating app that respects users' time and fosters genuine connections through intentional design.

---

**Built with ❤️ and intentionality**

**Last Updated**: 2025-10-17
