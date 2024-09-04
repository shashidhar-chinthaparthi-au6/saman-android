import React from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LogoutButton = ({ navigation }) => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    Alert.alert('Logged out');
    navigation.navigate('Login');
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={{ marginRight: 20 }}>
      <Text style={{ color: '#fff' }}>Logout</Text>
    </TouchableOpacity>
  );
};

export default LogoutButton;
