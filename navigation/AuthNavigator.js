import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';

const AuthStack = createStackNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator initialRouteName="Home">
      <AuthStack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Home' }}
      />
      <AuthStack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ title: 'Login' }}
      />
      <AuthStack.Screen 
        name="Signup" 
        component={SignupScreen} 
        options={{ title: 'Signup' }}
      />
    </AuthStack.Navigator>
  );
}

export default AuthNavigator;
