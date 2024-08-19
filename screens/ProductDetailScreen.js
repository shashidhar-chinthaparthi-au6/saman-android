// screens/ProductDetailScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get(`https://saman-backend.onrender.com/api/v1/users/products/${productId}`)
      .then(response => setProduct(response.data.product))
      .catch(error => console.error(error));
  }, [productId]);

  const addToCart = () => {
    axios.post('https://saman-backend.onrender.com/api/v1/users/cart', { productId })
      .then(() => {
        alert('Product added to cart');
      })
      .catch(error => console.error(error));
  };

  if (!product) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>${product.price}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <Button title="Add to Cart" onPress={addToCart} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 20,
    color: '#888',
    marginVertical: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default ProductDetailScreen;
