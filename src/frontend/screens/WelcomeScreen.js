// Welcome Screen - First screen users see when opening the app
// This is the entry point for new users (signup) and returning users (login)

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * WelcomeScreen Component
 *
 * Purpose: Landing screen that presents signup/login options
 *
 * Future navigation flow:
 * - "Sign Up" button → SignupScreen (to be created)
 * - "Login" button → LoginScreen (to be created)
 *
 * For now, this is a static screen to verify our app runs correctly
 */
export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      {/* App Logo/Name */}
      <View style={styles.header}>
        <Text style={styles.appName}>Scoop</Text>
        <Text style={styles.tagline}>Find meaningful connections</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.signupButton]}
          onPress={() => console.log('Sign Up pressed')}
        >
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={() => console.log('Login pressed')}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
}

/**
 * Styles for WelcomeScreen
 *
 * Design choices:
 * - Clean, minimal design
 * - Purple/pink color scheme (common in dating apps)
 * - Large, tappable buttons for good UX
 * - Centered layout for focus
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  header: {
    alignItems: 'center',
    marginTop: 80,
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#6B46C1', // Purple color
    marginBottom: 10,
  },
  tagline: {
    fontSize: 18,
    color: '#718096', // Gray color
    fontWeight: '400',
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  signupButton: {
    backgroundColor: '#6B46C1', // Purple
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#6B46C1',
  },
  loginButtonText: {
    color: '#6B46C1',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#A0AEC0', // Light gray
    textAlign: 'center',
    lineHeight: 18,
  },
});
