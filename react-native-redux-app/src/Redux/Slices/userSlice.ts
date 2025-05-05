import { createSlice } from '@reduxjs/toolkit';

interface UserInfo {
  name?: string;
  phone?: string;
  dateOfBirth?: string;
}

interface UserState {
  userInfo: UserInfo | null;
}

const initialState: UserState = {
  userInfo: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
    },
  },
});

export const { updateUserInfo, clearUserInfo } = userSlice.actions;

export const selectUserInfo = (state: { user: UserState }) => state.user.userInfo;

export default userSlice.reducer; 