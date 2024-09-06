import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

export default function ProductListScreen({ route, navigation }) {
  const { subCategoryId } = route.params;
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [quantities, setQuantities] = useState({});
  
  const user = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    const fetchProducts = async () => {
      console.log('Fetching products...');
      try {
        const response = await fetch(`https://saman-backend.onrender.com/api/v1/subcategories/${subCategoryId}/products`);
        const data = await response.json();
        if (response.ok) {
          console.log('Products fetched successfully:', data.data);
          setProducts(data.data);
        } else {
          console.error("Error fetching products:", data.message || 'Unknown error');
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [subCategoryId]);

  useFocusEffect(
    useCallback(() => {
      console.log('Screen focused. Fetching cart...');
      fetchCart();
    }, [])
  );

  const fetchCart = async () => {
    console.log('Fetching cart...');
    try {
      const response = await fetch('https://saman-backend.onrender.com/api/v1/order/cart', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log('Cart data:', data);

      if (response.ok) {
        const cartItems = data || [];
        const cartMap = {};
        const quantitiesMap = {};

        cartItems.forEach(item => {
          const productId = item.product._id;
          cartMap[productId] = item;
          quantitiesMap[productId] = item.quantity;
        });

        console.log('Cart items:', cartMap);
        console.log('Quantities:', quantitiesMap);

        setCart(cartMap);
        setQuantities(quantitiesMap);
      } else {
        console.error("Error fetching cart:", data.message || 'Unknown error');
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    const totalItemsInCart = Object.values(quantities).reduce((sum, quantity) => sum + quantity, 0);
    console.log('Total items in cart:', totalItemsInCart);

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('CartScreen')}>
          <Text style={{ marginRight: 10 }}>Cart ({totalItemsInCart})</Text>
        </TouchableOpacity>
      ),
    });
  }, [quantities, navigation]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const handleAddToCart = async (product) => {
    console.log(`Adding product to cart: ${product._id}`);
    try {
      const response = await fetch('https://saman-backend.onrender.com/api/v1/order/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user._id,
          productId: product._id,
          quantity: 1,
        }),
      });
      
      const data = await response.json();
      if (response.ok) {
        console.log('Product added to cart:', data);
        setCart(prevCart => ({
          ...prevCart,
          [product._id]: {
            ...product,
            quantity: 1,
          },
        }));
        setQuantities(prevQuantities => ({
          ...prevQuantities,
          [product._id]: 1,
        }));
      } else {
        console.error("Error adding to cart:", data.message || 'Unknown error');
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleQuantityChange = async (productId, delta) => {
    console.log(`Changing quantity for product ${productId} by ${delta}`);
    const currentQuantity = quantities[productId] || 0;
    const newQuantity = currentQuantity + delta;
    console.log("newQuantity", newQuantity);
    if (newQuantity > 0) {
      setQuantities(prevQuantities => ({
        ...prevQuantities,
        [productId]: newQuantity,
      }));

      try {
        const response = await fetch(`https://saman-backend.onrender.com/api/v1/order/cart/${cart[productId]._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            quantity: newQuantity,
          }),
        });

        const data = await response.json();
        console.log('API response for quantity update:', data);

        if (response.ok) {
          console.log('Cart updated:', data);
          setCart(prevCart => ({
            ...prevCart,
            [productId]: {
              ...prevCart[productId],
              quantity: newQuantity,
            },
          }));
        } else {
          console.error("Error updating cart:", data.message || 'Unknown error');
        }
      } catch (error) {
        console.error("Error updating cart:", error);
      }
    } else {
      // Remove item from cart if quantity is zero
      try {
        const response = await fetch(`https://saman-backend.onrender.com/api/v1/order/cart/${cart[productId]._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            quantity: newQuantity,
          }),
        });

        if (response.ok) {
          console.log('Item removed from cart');
          setCart(prevCart => {
            const updatedCart = { ...prevCart };
            delete updatedCart[productId];
            return updatedCart;
          });
          setQuantities(prevQuantities => {
            const updatedQuantities = { ...prevQuantities };
            delete updatedQuantities[productId];
            return updatedQuantities;
          });
        } else {
          const data = await response.json();
          console.error("Error removing item from cart:", data.message || 'Unknown error');
        }
      } catch (error) {
        console.error("Error removing item from cart:", error);
      }
    }
  };

  const renderItem = ({ item }) => {
    if (!item || !item._id) {
      console.warn('Item is undefined or has no _id:', item);
      return null;
    }

    const quantityInCart = quantities[item._id] || 0;
    console.log(`Rendering item ${item._id} with quantity ${quantityInCart}`);

    return (
      <View style={styles.productCard}>
        <Image source={{ uri: item.images[0] }} style={styles.productImage} />
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
        <Text style={styles.stock}>Stock available: {item.stock}</Text>
        <View style={styles.quantityContainer}>
          {quantityInCart > 0 ? (
            <>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(item._id, -1)}>
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{quantityInCart}</Text>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(item._id, 1)}>
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => handleAddToCart(item)}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

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
  },
  stock: {
    fontSize: 14,
    color: 'grey',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 5,
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 10,
  },
  addButton: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
