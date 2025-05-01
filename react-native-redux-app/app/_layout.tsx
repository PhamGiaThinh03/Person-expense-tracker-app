import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../src/Redux/store";
import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity } from 'react-native';

export default function Layout() {
  return (
    <Provider store={store}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="home" />
        <Stack.Screen name="add-income" />
        <Stack.Screen name="select-income" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </Provider>
  );
}
