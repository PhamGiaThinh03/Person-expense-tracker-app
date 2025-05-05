import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../Screens/HomeScreen';
import AddIncomeScreen from '../Screens/AddIncomeScreen';
import AddExpenseScreen from '../Screens/AddExpenseScreen';
import AddBudgetScreen from '../Screens/AddBudgetScreen';

const Stack = createNativeStackNavigator();

const HomeStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="AddIncome" component={AddIncomeScreen} />
    <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
    <Stack.Screen name="AddBudget" component={AddBudgetScreen} />
  </Stack.Navigator>
);

export default HomeStackNavigator; 