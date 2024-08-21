import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
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
      navigation.navigate('CategoryList'); // Navigate to CategoryList on successful login
    } catch (error) {
      console.log("=========error", error);
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
      Alert.alert('Login Failed', errorMessage);
    }
  };

  // Call checkServer on component mount or where appropriate
  useEffect(() => {
    checkServer();  // Check server connectivity when the component mounts
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://example.com/logo.png' }} // Replace with your logo URL
        style={styles.logo}
      />
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate('Signup')}
      >
        <Text style={styles.linkButtonText}>Go to Signup</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  button: {
    backgroundColor: '#6200ee',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#6200ee',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  linkButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  linkButtonText: {
    color: '#6200ee',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LoginScreen;
