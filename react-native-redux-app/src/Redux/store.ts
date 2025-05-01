import { configureStore } from '@reduxjs/toolkit';
import userReducer from './Slices/userSlice';
import financialReducer from './Slices/financialSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    financial: financialReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 