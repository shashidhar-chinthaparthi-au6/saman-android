import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductListScreen = ({ navigation }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantities, setQuantities] = useState({});
    const [cartQuantity, setCartQuantity] = useState(0); // State to track cart quantity

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const response = await axios.get('https://saman-backend.onrender.com/api/v1/users/products', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setProducts(response.data.products);
            } catch (err) {
                setError('Failed to fetch products. Please try again later.');
                console.error('Fetch Products Error:', err.response ? err.response.data : err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchCartQuantity = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const response = await axios.get('https://saman-backend.onrender.com/api/v1/users/cart', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const totalQuantity = response.data.cart.reduce((acc, item) => acc + item.quantity, 0);
                setCartQuantity(totalQuantity);
            } catch (err) {
                console.error('Fetch Cart Error:', err.response ? err.response.data : err.message);
            }
        };

        fetchCartQuantity();
    }, [quantities]); // Recalculate cart quantity whenever quantities change

    const handleQuantityChange = (productId, value) => {
        setQuantities(prevState => ({
            ...prevState,
            [productId]: value
        }));
    };

    const incrementQuantity = (productId) => {
        setQuantities(prevState => ({
            ...prevState,
            [productId]: (prevState[productId] || 1) + 1
        }));
    };

    const decrementQuantity = (productId) => {
        setQuantities(prevState => {
            const newQuantity = (prevState[productId] || 1) - 1;
            return {
                ...prevState,
                [productId]: Math.max(newQuantity, 1)
            };
        });
    };

    const addToCart = async (productId) => {
        const productQuantity = quantities[productId] || 1;

        try {
            const token = await AsyncStorage.getItem('userToken');
            await axios.post(
                'https://saman-backend.onrender.com/api/v1/users/cart',
                { productId, quantity: productQuantity },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            Alert.alert('Success', 'Product added to cart');
            setQuantities(prevState => ({ ...prevState, [productId]: productQuantity }));

            // Update cart quantity separately
            const fetchCartQuantity = async () => {
                try {
                    const response = await axios.get('https://saman-backend.onrender.com/api/v1/users/cart', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    const totalQuantity = response.data.cartItems.reduce((acc, item) => acc + item.quantity, 0);
                    setCartQuantity(totalQuantity);
                } catch (err) {
                    console.error('Fetch Cart Error:', err.response ? err.response.data : err.message);
                }
            };

            fetchCartQuantity();
        } catch (err) {
            console.error('Add to Cart Error:', err.response ? err.response.data : err.message);
            Alert.alert('Error', 'Failed to add product to cart. Please try again later.');
        }
    };

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => navigation.navigate('Checkout')}
                    style={{ marginRight: 20, flexDirection: 'row', alignItems: 'center' }}
                >
                    <Text style={{ fontSize: 18, color: '#007BFF' }}>Cart ({cartQuantity})</Text>
                </TouchableOpacity>
            ),
        });
    }, [cartQuantity, navigation]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#007BFF" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                    <View style={styles.productContainer}>
                        <Image
                            source={{ uri: item.imageUrl || 'https://picsum.photos/150' }}
                            style={styles.productImage}
                            onError={() => console.log('Error loading image')}
                        />
                        <Text style={styles.productName}>{item.name}</Text>
                        <Text style={styles.productPrice}>${item.price}</Text>
                        <View style={styles.quantityContainer}>
                            <TouchableOpacity onPress={() => decrementQuantity(item._id)} style={styles.quantityButton}>
                                <Text style={styles.quantityButtonText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{quantities[item._id] || 1}</Text>
                            <TouchableOpacity onPress={() => incrementQuantity(item._id)} style={styles.quantityButton}>
                                <Text style={styles.quantityButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => navigation.navigate('ProductDetail', { productId: item._id })}
                            >
                                <Text style={styles.buttonText}>View Details</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => addToCart(item._id)}
                            >
                                <Text style={styles.buttonText}>Add to Cart</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    productContainer: {
        marginBottom: 15,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        alignItems: 'center',
    },
    productImage: {
        width: 150,
        height: 150,
        borderRadius: 5,
        marginBottom: 10,
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    productPrice: {
        fontSize: 16,
        color: '#888',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    quantityButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    quantityButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    quantityText: {
        fontSize: 18,
        marginHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    button: {
        marginHorizontal: 5,
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default ProductListScreen;
