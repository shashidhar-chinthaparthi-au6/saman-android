import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Picker, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';

export default function AllOrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [cancelReason, setCancelReason] = useState(''); // Store cancel reason
  const [selectedOrder, setSelectedOrder] = useState(null); // Store selected order for cancellation
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('https://saman-backend.onrender.com/api/v1/order/orders', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("==================orders-=============",data)

        if (data) {
          setOrders(data);
        } else {
          console.error('Failed to fetch orders:', data.message);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`https://saman-backend.onrender.com/api/v1/order/cancel/${orderId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: cancelReason }),
      });

      const data = await response.json();

      if (data) {
        setOrders((prevOrders) => prevOrders.filter(order => order._id !== orderId));
        Alert.alert('Order Cancelled', `Order ID: ${orderId} has been cancelled.`);
      } else {
        Alert.alert('Error', 'Failed to cancel the order. Please try again.');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      Alert.alert('Error', 'Failed to cancel the order. Please try again.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderItemTitle}>Order ID: {item._id}</Text>
      <Text style={styles.orderItemDetails}>Total: {item.totalAmount}</Text>
      <Text style={styles.orderItemDetails}>Date: {new Date(item.createdAt).toLocaleDateString()}</Text>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => {
          setSelectedOrder(item._id);
          Alert.alert(
            'Cancel Order',
            'Select a reason for cancellation:',
            [
              {
                text: 'Reason 1',
                onPress: () => { setCancelReason('Reason 1'); handleCancelOrder(item._id); },
              },
              {
                text: 'Reason 2',
                onPress: () => { setCancelReason('Reason 2'); handleCancelOrder(item._id); },
              },
              {
                text: 'Cancel',
                style: 'cancel',
              },
            ]
          );
        }}
      >
        <Text style={styles.cancelButtonText}>Cancel Order</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  orderItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderItemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderItemDetails: {
    fontSize: 16,
    color: '#666',
    marginVertical: 4,
  },
  cancelButton: {
    marginTop: 12,
    backgroundColor: '#e57373',
    paddingVertical: 8,
    borderRadius: 4,
  },
  cancelButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
