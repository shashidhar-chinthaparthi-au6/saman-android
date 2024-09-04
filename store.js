// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import loaderReducer from './features/loaderSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    loader: loaderReducer,
  },
});

export default store;
