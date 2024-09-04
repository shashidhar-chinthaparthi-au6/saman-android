// features/loaderSlice.js
import { createSlice } from '@reduxjs/toolkit';

const loaderSlice = createSlice({
  name: 'loader',
  initialState: false,
  reducers: {
    showLoader(state) {
      return true;
    },
    hideLoader(state) {
      return false;
    },
  },
});

export const { showLoader, hideLoader } = loaderSlice.actions;
export default loaderSlice.reducer;
