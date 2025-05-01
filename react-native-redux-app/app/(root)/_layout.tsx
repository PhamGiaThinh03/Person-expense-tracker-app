import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="home"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="add-income"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="select-income"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="add-expense"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="select-expense"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
} 