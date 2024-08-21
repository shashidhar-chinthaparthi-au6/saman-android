import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { View, Text, Button } from 'react-native';

const CheckoutScreen = () => {
  const handleCheckout = async() => {
    const token = await AsyncStorage.getItem('userToken');
   
    fetch('https://saman-backend.onrender.com/api/v1/users/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Replace with actual JWT token
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log('Checkout successful:', data);
        // Navigate to confirmation screen or home
      })
      .catch(error => console.error('Error during checkout:', error));
  };

  return (
    <View>
      <Text>Checkout</Text>
      <Button title="Confirm Purchase" onPress={handleCheckout} />
    </View>
  );
};

export default CheckoutScreen;
