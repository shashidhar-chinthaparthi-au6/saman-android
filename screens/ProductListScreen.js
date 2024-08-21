import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { CartContext } from '../contexts/CartContext'; // Update the path as necessary
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProductListScreen({ route }) {
  const { subCategoryId } = route.params;
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [quantities, setQuantities] = useState({});
  const { cartCount, setCartCount } = useContext(CartContext);
  const navigation = useNavigation();

  useEffect(() => {
    fetch(`https://saman-backend.onrender.com/api/products/subcategory/${subCategoryId}`)
      .then(response => response.json())
      .then(data => setProducts(data.data))
      .catch(error => console.error("Error fetching products:", error));
  }, [subCategoryId]);

  useEffect(() => {
    // Calculate total quantity in cart and update header
    const totalItemsInCart = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(totalItemsInCart);
  }, [cart]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const handleAddToCart = async (product) => {
    const token = await AsyncStorage.getItem('userToken');
    console.log("------tes",{ productId: product._id, quantity: quantities[product._id] || 1 })
    
    fetch('https://saman-backend.onrender.com/api/v1/users/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Replace with actual token
      },
      body: JSON.stringify({ productId: product._id, quantity: quantities[product._id] || 1 }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setCart(prevCart => {
            const newCart = { ...prevCart };
            if (newCart[product._id]) {
              newCart[product._id].quantity += (quantities[product._id] || 1);
            } else {
              newCart[product._id] = { ...product, quantity: quantities[product._id] || 1 };
            }
            return newCart;
          });
        }
      })
      .catch(error => console.error("Error adding to cart:", error));
  };

  const handleRemoveFromCart = (product) => {
    fetch(`https://saman-backend.onrender.com/api/cart/${product._id}`, {
      method: 'DELETE',
    //   headers: {
    //     'Authorization': `Bearer ${YOUR_AUTH_TOKEN}`, // Replace with actual token
    //   },
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setCart(prevCart => {
            const newCart = { ...prevCart };
            if (newCart[product._id]) {
              if (newCart[product._id].quantity > 1) {
                newCart[product._id].quantity -= 1;
              } else {
                delete newCart[product._id];
              }
            }
            return newCart;
          });
        }
      })
      .catch(error => console.error("Error removing from cart:", error));
  };

  const handleQuantityChange = (productId, delta) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: Math.max((prevQuantities[productId] || 0) + delta, 0),
    }));
  };

  const renderItem = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => handleQuantityChange(item._id, -1)}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{quantities[item._id] || 0}</Text>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => handleQuantityChange(item._id, 1)}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => handleAddToCart(item)}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={item => item._id}
        numColumns={2}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  productCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    flex: 1,
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 10,   
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: '#6200ee',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  quantityButton: {
    backgroundColor: '#007BFF',
    borderRadius: 4,
    padding: 8,
    margin: 4,
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  quantity: {
    fontSize: 18,
    marginHorizontal: 16,
  },
  addButton: {
    backgroundColor: '#28a745',
    borderRadius: 4,
    padding: 8,
    margin: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
