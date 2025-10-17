# Scoop - Development Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Firebase Setup](#firebase-setup)
4. [Running the App Locally](#running-the-app-locally)
5. [Project Structure](#project-structure)
6. [Development Workflow](#development-workflow)
7. [Testing](#testing)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting development, you'll need:

### Required Software
1. **Node.js** (v18 or later)
   - Download: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js) or **yarn**
   - Verify: `npm --version`

3. **Git**
   - Download: https://git-scm.com/
   - Verify: `git --version`

4. **Code Editor**
   - Recommended: VS Code (https://code.visualstudio.com/)
   - Extensions to install:
     - ES7+ React/Redux/React-Native snippets
     - Prettier - Code formatter
     - ESLint
     - Firebase

5. **Expo CLI**
   - Install: `npm install -g expo-cli`
   - Verify: `expo --version`

6. **Mobile Testing Options**
   - **Option A (Recommended for beginners)**: Expo Go app on your phone
     - iOS: https://apps.apple.com/app/expo-go/id982107779
     - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - **Option B**: iOS Simulator (Mac only)
     - Install Xcode from Mac App Store
     - Run: `xcode-select --install`
   - **Option C**: Android Emulator
     - Install Android Studio
     - Set up AVD (Android Virtual Device)

### Required Accounts
1. **Firebase Account**
   - Create at: https://firebase.google.com/
   - Free tier is sufficient for development

2. **GitHub Account** (for version control)
   - Create at: https://github.com/

3. **Apple Developer Account** (for iOS deployment later)
   - Cost: $99/year
   - Not needed for local development

4. **Google Play Developer Account** (for Android deployment later)
   - Cost: $25 one-time
   - Not needed for local development

---

## Environment Setup

### Step 1: Install Node.js
```bash
# Windows: Download installer from nodejs.org
# Mac (using Homebrew):
brew install node

# Verify installation
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

### Step 2: Install Expo CLI
```bash
npm install -g expo-cli

# Verify installation
expo --version
```

### Step 3: Set Up Git
```bash
# Configure Git (if not already done)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Verify configuration
git config --list
```

### Step 4: Install Code Editor
Download VS Code from https://code.visualstudio.com/

**Recommended VS Code Extensions**:
1. ES7+ React/Redux/React-Native snippets
2. Prettier - Code formatter
3. ESLint
4. Firebase
5. GitLens

Install via VS Code Extensions panel (Ctrl+Shift+X or Cmd+Shift+X)

---

## Firebase Setup

### Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Project name: `scoop-dating` (or your choice)
4. Enable Google Analytics: **Yes** (recommended)
5. Create project

### Step 2: Enable Authentication

1. In Firebase Console, click "Authentication"
2. Click "Get started"
3. Enable sign-in methods:
   - ✅ Email/Password
   - ✅ Phone (optional, for future)
   - ✅ Google (optional, for future)

### Step 3: Create Firestore Database

1. In Firebase Console, click "Firestore Database"
2. Click "Create database"
3. Start in **test mode** (we'll add security rules later)
4. Choose location: `us-central` (or closest to your target users)
5. Click "Enable"

### Step 4: Set Up Firebase Storage

1. In Firebase Console, click "Storage"
2. Click "Get started"
3. Start in **test mode**
4. Use same location as Firestore
5. Click "Done"

### Step 5: Register Your App

1. In Firebase Console, click the gear icon → "Project settings"
2. Scroll to "Your apps"
3. Click the **Web** icon (</>)
4. App nickname: `scoop-web`
5. Check "Also set up Firebase Hosting" (optional)
6. Click "Register app"
7. **COPY the Firebase config object** - you'll need this!

Example config (yours will be different):
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "scoop-dating.firebaseapp.com",
  projectId: "scoop-dating",
  storageBucket: "scoop-dating.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

### Step 6: Create Environment Variables File

```bash
# Navigate to project directory
cd "C:\Users\bagre\OneDrive\My Files\Professional\Side Projects\Dating App - Scoop"

# Create .env file (NEVER commit this to Git!)
# We'll create this file when we initialize the React Native app
```

**Contents of `.env` file** (create this later):
```
FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX
FIREBASE_AUTH_DOMAIN=scoop-dating.firebaseapp.com
FIREBASE_PROJECT_ID=scoop-dating
FIREBASE_STORAGE_BUCKET=scoop-dating.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

---

## Running the App Locally

### Step 1: Initialize React Native Project

```bash
# Navigate to project root
cd "C:\Users\bagre\OneDrive\My Files\Professional\Side Projects\Dating App - Scoop"

# Create Expo app in src/frontend folder
npx create-expo-app src/frontend

# Navigate to frontend folder
cd src/frontend

# Install Firebase SDK
npm install firebase

# Install navigation libraries
npm install @react-navigation/native
npm install @react-navigation/stack
npm install react-native-screens react-native-safe-area-context

# Install additional dependencies
npm install expo-image-picker  # For photo uploads
npm install expo-location      # For location access
npm install @react-native-async-storage/async-storage  # For local data
```

### Step 2: Configure Firebase in Your App

Create `src/frontend/firebase/config.js`:
```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
```

### Step 3: Run the App

```bash
# Make sure you're in src/frontend directory
cd src/frontend

# Start Expo development server
npx expo start

# This will open Expo DevTools in your browser
# Options to run:
# - Press 'i' for iOS simulator (Mac only)
# - Press 'a' for Android emulator
# - Scan QR code with Expo Go app on your phone
```

### Step 4: Test on Your Phone (Easiest)

1. Install **Expo Go** app on your phone:
   - iOS: App Store → search "Expo Go"
   - Android: Play Store → search "Expo Go"
2. Open Expo Go app
3. Scan QR code from terminal/browser
4. App loads on your phone!

---

## Project Structure

After setup, your project will look like this:

```
/Dating App - Scoop
  /docs                          # All documentation
    ARCHITECTURE.md
    CONSTRAINTS.md
    DATABASE_SCHEMA.md
    API_REFERENCE.md
    USER_FLOW.md
    PROJECT_STATE.md
    CHANGELOG.md
    DEVELOPMENT_GUIDE.md (this file)
    README.md

  /src
    /frontend                    # React Native app
      /assets                    # Images, fonts
      /components                # Reusable UI components
        Button.js
        Card.js
        Input.js
      /screens                   # App screens
        WelcomeScreen.js
        LoginScreen.js
        SignupScreen.js
        ProfileSetupScreen.js
        SwipeDeckScreen.js
        MatchesScreen.js
        ChatScreen.js
      /navigation                # Navigation setup
        AppNavigator.js
      /services                  # API calls to Firebase
        authService.js
        userService.js
        swipeService.js
        matchService.js
        chatService.js
      /utils                     # Helper functions
        validation.js
        dateHelpers.js
      /firebase                  # Firebase config
        config.js
      /redux                     # State management (optional)
        store.js
        userSlice.js
        matchSlice.js
      App.js                     # Main app entry point
      package.json

    /backend                     # Firebase Cloud Functions
      /functions
        index.js                 # All Cloud Functions
        package.json

    /database                    # Firestore rules & indexes
      firestore.rules
      firestore.indexes.json

  /design                        # Design files
    /wireframes
    /mockups

  /tests                         # Test files
    /unit
    /integration
    /e2e

  .gitignore
  README.md
```

---

## Development Workflow

### Daily Development Flow

1. **Pull latest changes** (if working with a team):
   ```bash
   git pull origin main
   ```

2. **Create a feature branch**:
   ```bash
   git checkout -b feature/user-authentication
   ```

3. **Start Expo dev server**:
   ```bash
   cd src/frontend
   npx expo start
   ```

4. **Make changes** to code

5. **Test changes** on simulator/device

6. **Commit your work**:
   ```bash
   git add .
   git commit -m "feat: implement user authentication"
   ```

7. **Push to GitHub**:
   ```bash
   git push origin feature/user-authentication
   ```

### Commit Message Convention

Use semantic commit messages:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Examples:
```
feat: add swipe left/right gestures
fix: resolve swipe counter not updating
docs: update API reference for match endpoint
refactor: simplify match creation algorithm
test: add unit tests for swipe service
```

### Code Review Checklist

Before committing:
- [ ] Code runs without errors
- [ ] All console.log() statements removed (or converted to proper logging)
- [ ] No hardcoded values (use constants or env variables)
- [ ] Functions have descriptive names
- [ ] Comments added for complex logic
- [ ] No TODO comments left unresolved
- [ ] Firebase calls wrapped in try/catch
- [ ] User-facing text has no typos

---

## Testing

### Manual Testing

For each feature you build, test:

**Authentication**:
- [ ] User can sign up with email
- [ ] Verification email is sent
- [ ] User can log in
- [ ] User can reset password
- [ ] Error messages display correctly

**Profile**:
- [ ] User can upload 3-6 photos
- [ ] Bio validation works (min 50 chars)
- [ ] Profile completeness calculates correctly
- [ ] Can edit profile after creation

**Swiping**:
- [ ] 10 profiles load initially
- [ ] Swipe left removes card
- [ ] Swipe right records like
- [ ] Swipe counter decrements
- [ ] Out of swipes shows correct message
- [ ] Countdown timer displays correctly

**Matching**:
- [ ] Match creates on mutual right-swipe
- [ ] Match limit enforced (5 max)
- [ ] Pending matches shown correctly
- [ ] Unmatching frees a slot

**Chat**:
- [ ] Messages send in real-time
- [ ] Read receipts work
- [ ] Typing indicators work (if implemented)
- [ ] Chat loads previous messages

### Automated Testing (Future)

We'll add these later:

**Unit Tests** (Jest):
```bash
npm test
```

**Integration Tests** (React Native Testing Library)

**E2E Tests** (Detox):
```bash
npm run e2e
```

---

## Deployment

### Deploy Cloud Functions

```bash
cd src/backend/functions

# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize functions (first time only)
firebase init functions

# Deploy all functions
firebase deploy --only functions

# Deploy specific function
firebase deploy --only functions:dailySwipeReset
```

### Deploy Firestore Rules

```bash
# From project root
firebase deploy --only firestore:rules
```

### Build for iOS (TestFlight)

```bash
cd src/frontend

# Build iOS app
expo build:ios

# Follow prompts:
# - Apple ID
# - App Bundle ID (com.yourcompany.scoop)
# - Distribution certificate

# Upload to TestFlight
# Expo will provide a .ipa file
# Upload via Transporter app or Xcode
```

### Build for Android (Google Play Beta)

```bash
cd src/frontend

# Build Android app
expo build:android

# Follow prompts:
# - Keystore (generate new for first build)

# Upload to Google Play Console
# Download .apk or .aab file
# Upload to Google Play Console → Testing → Internal testing
```

---

## Troubleshooting

### Common Issues

#### Issue: `expo: command not found`
**Solution**:
```bash
npm install -g expo-cli
# Restart terminal
```

#### Issue: Firebase config error
**Solution**:
- Check `.env` file exists and has correct values
- Ensure `.env` is NOT committed to Git
- Verify Firebase project is active

#### Issue: App won't load on phone
**Solution**:
- Ensure phone and computer are on same WiFi
- Restart Expo dev server
- Clear Expo app cache
- Update Expo Go app

#### Issue: `Cannot find module 'firebase'`
**Solution**:
```bash
cd src/frontend
npm install firebase
```

#### Issue: iOS simulator won't open (Mac)
**Solution**:
```bash
# Install Xcode command line tools
xcode-select --install

# Open simulator manually
open -a Simulator
```

#### Issue: Android emulator won't start
**Solution**:
1. Open Android Studio
2. Tools → AVD Manager
3. Create new virtual device
4. Start emulator from AVD Manager
5. Then run `npx expo start` and press 'a'

#### Issue: "Expo Go is out of date"
**Solution**:
- Update Expo Go app on your phone
- OR update expo in your project:
  ```bash
  npm install expo@latest
  ```

#### Issue: Hot reload not working
**Solution**:
```bash
# Restart dev server
# Press 'r' in terminal to reload app
```

---

## Environment Variables

**NEVER commit these to Git!**

Create `.env` file in `src/frontend/`:
```
# Firebase
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# API URLs (for production)
API_BASE_URL=https://us-central1-scoop-dating.cloudfunctions.net
```

Access in code:
```javascript
import Constants from 'expo-constants';

const apiKey = Constants.expoConfig.extra.FIREBASE_API_KEY;
```

Or use `react-native-dotenv`:
```bash
npm install react-native-dotenv
```

---

## Useful Commands

```bash
# Start development server
npx expo start

# Clear cache and restart
npx expo start -c

# Check for dependency updates
npm outdated

# Update dependencies
npm update

# Install specific version
npm install expo@47.0.0

# Remove node_modules and reinstall
rm -rf node_modules
npm install

# Check Firebase CLI version
firebase --version

# Update Firebase CLI
npm install -g firebase-tools@latest

# View Firebase logs
firebase functions:log

# Run emulators locally (for testing Cloud Functions)
firebase emulators:start
```

---

## Best Practices

### Code Organization
- One component per file
- Group related files in folders
- Use index.js for folder exports

### Naming Conventions
- Components: PascalCase (`UserProfile.js`)
- Functions: camelCase (`getUserData()`)
- Constants: UPPER_SNAKE_CASE (`MAX_SWIPES`)
- Files: Match component name (`UserProfile.js` for `UserProfile` component)

### Performance
- Use `React.memo()` for expensive components
- Implement pagination for long lists
- Compress images before upload
- Cache API responses where appropriate

### Security
- Never commit API keys or secrets
- Validate all user input
- Use Firestore security rules
- Implement rate limiting
- Hash sensitive data

### Git
- Commit often, push at end of session
- Write descriptive commit messages
- Never commit commented-out code
- Keep branches up to date with main

---

## Resources

### Official Documentation
- React Native: https://reactnative.dev/
- Expo: https://docs.expo.dev/
- Firebase: https://firebase.google.com/docs
- React Navigation: https://reactnavigation.org/

### Learning Resources
- React Native tutorial: https://reactnative.dev/docs/tutorial
- Firebase crash course: https://www.youtube.com/watch?v=fgdpvwEWJ9M
- Expo guides: https://docs.expo.dev/guides/

### Community
- React Native Discord: https://discord.gg/reactnative
- Stack Overflow: Tag questions with `react-native`, `firebase`, `expo`
- r/reactnative: https://reddit.com/r/reactnative

---

## Next Steps

Now that you've read this guide:

1. ✅ Install all prerequisites
2. ✅ Set up Firebase project
3. ✅ Initialize React Native app
4. ✅ Run the app on your phone/simulator
5. 📖 Review ARCHITECTURE.md to understand the system
6. 🚀 Start building features!

**First feature to build**: Authentication (signup/login screens)

Refer to USER_FLOW.md for screen designs and API_REFERENCE.md for endpoints.

---

**Last Updated**: 2025-10-17
**Next Review**: After Session 2 (environment setup complete)
