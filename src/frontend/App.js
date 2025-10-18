// Scoop Dating App - Main Entry Point
// This file initializes the app and sets up the root component

import { StatusBar } from 'expo-status-bar';
import WelcomeScreen from './screens/WelcomeScreen';

/**
 * App Component
 *
 * Purpose: Root component of the Scoop dating app
 *
 * Current implementation: Shows Welcome screen
 *
 * Future implementation will include:
 * - Navigation (switching between screens)
 * - Authentication state management (logged in vs logged out)
 * - Context providers for global state
 *
 * For now, we're keeping it simple to verify everything works
 */
export default function App() {
  return (
    <>
      {/* StatusBar controls the top bar (time, battery, etc.) appearance */}
      <StatusBar style="dark" />

      {/* Welcome screen - first thing users see */}
      <WelcomeScreen />
    </>
  );
}
