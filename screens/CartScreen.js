// screens/CartScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Fetch cart items from backend
    axios.get('https://saman-backend.onrender.com/api/v1/users/cart')
      .then(response => setCartItems(response.data))
      .catch(error => console.error(error));
  }, []);

  const checkout = () => {
    axios.post('https://saman-backend.onrender.com/api/v1/users/checkout')
      .then(() => {
        alert('Checkout successful');
        // Navigate to order confirmation or home
        navigation.navigate('Home');
      })
      .catch(error => console.error(error));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>${item.price}</Text>
          </View>
        )}
      />
      <Button title="Checkout" onPress={checkout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  itemContainer: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  itemName: {
    fontSize: 18,
  },
  itemPrice: {
    fontSize: 16,
    color: '#888',
  },
});

export default CartScreen;
