import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Fetch product details based on productId
    fetch(`https://saman-backend.onrender.com/api/v1/users/products/${productId}`)
      .then(response => response.json())
      .then(data => setProduct(data))
      .catch(error => console.error('Error fetching product details:', error));
  }, [productId]);

  const handleAddToCart = () => {
    // Add product to cart
    fetch('https://saman-backend.onrender.com/api/v1/users/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer <your_jwt_token>', // Replace with actual JWT token
      },
      body: JSON.stringify({ productId, quantity: 1 }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Added to cart:', data);
        navigation.navigate('Cart');
      })
      .catch(error => console.error('Error adding to cart:', error));
  };

  return (
    <View>
      {product ? (
        <>
          <Text>{product.name}</Text>
          <Text>{product.description}</Text>
          <Text>${product.price}</Text>
          <Button title="Add to Cart" onPress={handleAddToCart} />
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default ProductDetailScreen;
