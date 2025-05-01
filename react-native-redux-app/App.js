import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import AppNavigator from './src/Navigation/AppNavigator';
import financialReducer from './src/Redux/Slices/financialSlice';

// Configure the Redux store
const store = configureStore({
  reducer: {
    financial: financialReducer,
  },
});

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
} 