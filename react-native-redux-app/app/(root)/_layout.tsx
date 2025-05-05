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
      <Stack.Screen
        name="add-budget"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="select-budget-category"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="chart"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
} 