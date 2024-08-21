import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { CartContext } from '../contexts/CartContext'; // Ensure this path is correct
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CartScreen({ navigation }) {
  const [cartSummary, setCartSummary] = useState([]);
  const { setCartCount } = useContext(CartContext);

  useEffect(() => {
    const fetchCartSummary = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await fetch('https://saman-backend.onrender.com/api/v1/users/cart', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Replace with actual token
          },
        });
        const data = await response.json();

        if (data.success) {
          setCartSummary(data.cartSummary);

          // Calculate the total items in the cart
          const totalItems = data.cartSummary.reduce((sum, item) => sum + item.quantity, 0);
          setCartCount(totalItems);
        }
      } catch (error) {
        console.error("Error fetching cart summary:", error);
      }
    };

    fetchCartSummary();
  }, [setCartCount]);

  const handleCheckout = () => {
    navigation.navigate('Checkout');
  };

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Text style={styles.cartItemName}>{item.product.name}</Text>
      <Text style={styles.cartItemQuantity}>Quantity: {item.quantity}</Text>
      <Text style={styles.cartItemPrice}>
        {new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
        }).format(item.totalPrice)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cartSummary}
        keyExtractor={item => item.product._id}
        renderItem={renderItem}
      />
      <Button title="Checkout" onPress={handleCheckout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  cartItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cartItemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  cartItemPrice: {
    fontSize: 16,
    color: '#6200ee',
    fontWeight: 'bold',
  },
});
