// src/screens/LoginScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Ensure you have this import

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Function to check if the backend server is reachable
  const checkServer = async () => {
    try {
      const response = await axios.get('https://saman-backend.onrender.com/api/v1/auth/test');
      console.log('Server Check Response:', response.data);
    } catch (error) {
      console.error('Server Check Error:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://saman-backend.onrender.com/api/v1/auth/login', { email, password });
      const { token } = response.data; // Assume the token is in response.data.token
      await AsyncStorage.setItem('userToken', token); // Save token to AsyncStorage
      Alert.alert('Login Successful');
      navigation.navigate('ProductList');  // Ensure 'ProductList' is a valid route name
    } catch (error) {
      console.log("=========error", error);
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
      Alert.alert('Login Failed', errorMessage);
    }
  };

  // Call checkServer on component mount or where appropriate
  React.useEffect(() => {
    checkServer();  // Check server connectivity when the component mounts
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button
        title="Go to Signup"
        onPress={() => navigation.navigate('Signup')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default LoginScreen;
