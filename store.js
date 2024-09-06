// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import loaderReducer from './features/loaderSlice';
import cartReducer from './features/cartReducer';

const store = configureStore({
  reducer: {
    auth: authReducer,
    loader: loaderReducer,
    cart:cartReducer
  },
});

export default store;
