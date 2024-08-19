import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CheckoutScreen = ({ navigation }) => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        // Fetch cart items
        const fetchCart = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const response = await axios.get('https://saman-backend.onrender.com/api/v1/users/cart', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log("Fetched cart items:", response.data);
                const items = response.data.cart;
                setCartItems(items);
                calculateTotal(items);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchCart();
    }, []);

    const calculateTotal = (items) => {
        const totalAmount = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
        setTotal(totalAmount);
    };

    const handleRemoveItem = async (cartId) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            await axios.delete(`https://saman-backend.onrender.com/api/v1/users/cart/${cartId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            // Remove item from state
            const updatedCartItems = cartItems.filter(item => item._id !== cartId);
            setCartItems(updatedCartItems);
            calculateTotal(updatedCartItems);
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    const handleProceedToPayment = () => {
        // Navigate to payment screen or perform payment action
        navigation.navigate('PaymentScreen'); // Update with actual screen name
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.product.name}</Text>
            <Text style={styles.itemText}>Quantity: {item.quantity}</Text>
            <Text style={styles.itemText}>Price: ${item.product.price.toFixed(2)}</Text>
            <TouchableOpacity onPress={() => handleRemoveItem(item._id)}>
                <Text style={styles.removeButton}>Remove</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Checkout</Text>
            <FlatList
                data={cartItems}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
            />
            <View style={styles.totalContainer}>
                <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
                <Button title="Proceed to Payment" onPress={handleProceedToPayment} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    itemContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemText: {
        fontSize: 16,
    },
    removeButton: {
        color: 'red',
        marginTop: 10,
        fontWeight: 'bold',
    },
    totalContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    totalText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default CheckoutScreen;
