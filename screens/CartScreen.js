import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CartContext } from '../contexts/CartContext'; // Ensure this path is correct
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CartScreen({ navigation }) {
  const [cartSummary, setCartSummary] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
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

          // Calculate the total amount
          const total = data.cartSummary.reduce((sum, item) => sum + item.totalPrice, 0);
          setTotalAmount(total);
        }
      } catch (error) {
        console.error("Error fetching cart summary:", error);
      }
    };

    fetchCartSummary();
  }, [setCartCount]);

  const handleRemoveItem = async (cartItemId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`https://saman-backend.onrender.com/api/v1/users/cart/${cartItemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        // Update the cart summary after removing the item
        setCartSummary((prevSummary) =>
          prevSummary.filter((item) => item._id !== cartItemId)
        );

        // Update the cart count
        const totalItems = prevSummary.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalItems);

        // Recalculate the total amount
        const total = prevSummary.reduce((sum, item) => sum + item.totalPrice, 0);
        setTotalAmount(total);
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const handleConfirmOrder = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log("======user",token)
      const response = await fetch('https://saman-backend.onrender.com/api/v1/payment/create-order', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: totalAmount }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert(
          'Order Confirmed',
          `Order ID: ${data.order._id}\nAmount: ${new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
          }).format(totalAmount)}`,
          [
            { text: 'OK', onPress: () => navigation.navigate('CategoryList') },
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to confirm the order. Please try again.');
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      Alert.alert('Error', 'Failed to confirm the order. Please try again.');
    }
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
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveItem(item.product._id)}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cartSummary}
        keyExtractor={(item) => item.product._id}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <Text style={styles.emptyCartText}>No items in the cart.</Text>
        )}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>
          Total: {new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
          }).format(totalAmount)}
        </Text>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmOrder}>
          <Text style={styles.confirmButtonText}>Confirm Order</Text>
        </TouchableOpacity>
      </View>
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
  removeButton: {
    marginTop: 10,
    backgroundColor: '#ff6666',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  confirmButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyCartText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});
