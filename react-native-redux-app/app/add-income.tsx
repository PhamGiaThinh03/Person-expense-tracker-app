import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import AddIncomeScreen from "../src/Screens/AddIncomeScreen";

/**
 * Add Income page that renders the AddIncomeScreen component
 */
export default function AddIncome() {
  return <AddIncomeScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
 