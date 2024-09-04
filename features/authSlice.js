// features/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    error: null,
  },
  reducers: {
    loginSuccess(state, action) {
      state.token = action.payload;
      state.error = null;
    },
    loginFailure(state, action) {
      state.error = action.payload;
    },
    logout(state) {
      state.token = null;
      state.error = null;
    },
  },
});

export const { loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
