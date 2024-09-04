import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/authActions';
import Loader from '../components/Loader'; // Make sure this component is implemented correctly

const LoginScreen = ({ route, navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const error = useSelector((state) => state.auth.error);
  const loading = useSelector((state) => state.loader.loading);
  const { signupSuccess } = route.params || {};

  useEffect(() => {
    if (signupSuccess) {
      Alert.alert('Signup Successful', 'You can now log in with your credentials.');
    }
  }, [signupSuccess]);

  useEffect(() => {
    if (token) {
      navigation.navigate('CategoryList');
    }
    if (error) {
      Alert.alert('Login Failed', error);
    }
  }, [token, error, navigation]);

  const handleLogin = async () => {
    await dispatch(loginUser(email, password));
  };

  return (
    <View style={styles.container}>
      {loading && <Loader />}
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
      <Button title="Login" onPress={handleLogin} />
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
