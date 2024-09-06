import axios from 'axios';
import { loginSuccess, loginFailure } from './authSlice';
import { showLoader, hideLoader } from './loaderSlice';

const API_URL = 'https://saman-backend.onrender.com/api/v1/auth';

export const loginUser = (email, password) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    console.log('Login response:', response.data);
    const { token, user } = response.data;
    dispatch(loginSuccess({ token, user }));
    // Optionally save token and user details in local storage or AsyncStorage
    // Example for AsyncStorage:
    // await AsyncStorage.setItem('userToken', token);
    // await AsyncStorage.setItem('userId', user._id);
    // Optionally save token in local storage or AsyncStorage
    return { success: true }; // Return success info
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Login Failed';
    dispatch(loginFailure(errorMessage));
    return { success: false, message: errorMessage }; // Return failure info
  } finally {
    dispatch(hideLoader());
  }
};

export const signupUser = (email, password, name) => async (dispatch) => {
  dispatch(showLoader());
  try {
    await axios.post(`${API_URL}/signup`, { email, password, name });
    return { success: true }; // Indicate success
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Signup Failed';
    dispatch(loginFailure(errorMessage)); // Consider using a separate action for signup errors
    return { success: false, message: errorMessage }; // Return failure info
  } finally {
    dispatch(hideLoader());
  }
};
