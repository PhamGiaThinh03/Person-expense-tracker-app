import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from 'expo-router';

/**
 * OnboardingScreen component that displays the welcome screen for the Xpens application
 */
function OnboardingScreen() {
  const handleGetStarted = () => {
    // Navigate to Home screen using expo-router
    router.push('/home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xpens</Text>
      <Text style={styles.subtitle}>Track your expenses effortlessly</Text>
      <TouchableOpacity
        onPress={handleGetStarted}
        style={styles.button}
        accessibilityLabel="Get Started with Xpens"
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2F80ED',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#2F80ED',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    maxWidth: 300,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default OnboardingScreen; 