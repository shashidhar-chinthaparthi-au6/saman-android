import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Import the MaterialIcons component
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import CategoryListScreen from '../screens/CategoryListScreen';
import SubCategoryListScreen from '../screens/SubCategoryListScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import { CartContext } from '../contexts/CartContext'; // Ensure this path is correct

const Stack = createStackNavigator();

export default function AppNavigator() {
  const [cartCount, setCartCount] = useState(0); // Default value is 0
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Default to false, update on login/logout

  const handleLogout = () => {
    // Handle your logout logic here (e.g., clear auth tokens, etc.)
    setIsLoggedIn(false); // Set logged-in status to false
  };

  return (
    <CartContext.Provider value={{ cartCount, setCartCount }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={({ navigation }) => ({
              title: 'Home',
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Cart')}
                  style={{ 
                    marginRight: 15, 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    backgroundColor: '#000', // Set background to black
                    padding: 5, // Added padding for better touch area
                    borderRadius: 5, // Optional: Rounded corners for better UI
                  }}
                >
                  <MaterialIcons name="shopping-cart" size={24} color="#FFA500" />
                  {cartCount > 0 && (
                    <View style={{ 
                      position: 'absolute', 
                      right: -8, 
                      top: -8, 
                      backgroundColor: 'red', 
                      borderRadius: 10, 
                      paddingHorizontal: 6, 
                      paddingVertical: 2 
                    }}>
                      <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>
                        {cartCount}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{
              title: 'Login',
              headerRight: () => null, // Remove cart button from Login screen
            }}
          />
          <Stack.Screen 
            name="Signup" 
            component={SignupScreen} 
            options={{
              title: 'Signup',
              headerRight: () => null, // Remove cart button from Signup screen
            }}
          />
          <Stack.Screen 
            name="CategoryList" 
            component={CategoryListScreen} 
            options={({ navigation }) => ({
              title: 'Categories',
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Cart')}
                  style={{ 
                    marginRight: 15, 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    backgroundColor: '#000', // Set background to black
                    padding: 5, // Added padding for better touch area
                    borderRadius: 5, // Optional: Rounded corners for better UI
                  }}
                >
                  <MaterialIcons name="shopping-cart" size={24} color="#FFA500" />
                  {cartCount > 0 && (
                    <View style={{ 
                      position: 'absolute', 
                      right: -8, 
                      top: -8, 
                      backgroundColor: 'red', 
                      borderRadius: 10, 
                      paddingHorizontal: 6, 
                      paddingVertical: 2 
                    }}>
                      <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>
                        {cartCount}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen 
            name="SubCategoryList" 
            component={SubCategoryListScreen} 
            options={({ navigation }) => ({
              title: 'Subcategories',
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Cart')}
                  style={{ 
                    marginRight: 15, 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    backgroundColor: '#000', // Set background to black
                    padding: 5, // Added padding for better touch area
                    borderRadius: 5, // Optional: Rounded corners for better UI
                  }}
                >
                  <MaterialIcons name="shopping-cart" size={24} color="#FFA500" />
                  {cartCount > 0 && (
                    <View style={{ 
                      position: 'absolute', 
                      right: -8, 
                      top: -8, 
                      backgroundColor: 'red', 
                      borderRadius: 10, 
                      paddingHorizontal: 6, 
                      paddingVertical: 2 
                    }}>
                      <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>
                        {cartCount}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen 
            name="ProductList" 
            component={ProductListScreen} 
            options={({ navigation }) => ({
              title: 'Products',
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Cart')}
                  style={{ 
                    marginRight: 15, 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    backgroundColor: '#000', // Set background to black
                    padding: 5, // Added padding for better touch area
                    borderRadius: 5, // Optional: Rounded corners for better UI
                  }}
                >
                  <MaterialIcons name="shopping-cart" size={24} color="#FFA500" />
                  {cartCount > 0 && (
                    <View style={{ 
                      position: 'absolute', 
                      right: -8, 
                      top: -8, 
                      backgroundColor: 'red', 
                      borderRadius: 10, 
                      paddingHorizontal: 6, 
                      paddingVertical: 2 
                    }}>
                      <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>
                        {cartCount}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen 
            name="ProductDetail" 
            component={ProductDetailScreen} 
            options={({ navigation }) => ({
              title: 'Product Details',
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Cart')}
                  style={{ 
                    marginRight: 15, 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    backgroundColor: '#000', // Set background to black
                    padding: 5, // Added padding for better touch area
                    borderRadius: 5, // Optional: Rounded corners for better UI
                  }}
                >
                  <MaterialIcons name="shopping-cart" size={24} color="#FFA500" />
                  {cartCount > 0 && (
                    <View style={{ 
                      position: 'absolute', 
                      right: -8, 
                      top: -8, 
                      backgroundColor: 'red', 
                      borderRadius: 10, 
                      paddingHorizontal: 6, 
                      paddingVertical: 2 
                    }}>
                      <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>
                        {cartCount}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen 
            name="Cart" 
            component={CartScreen} 
            options={({ navigation }) => ({
              title: 'Cart Summary',
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Checkout')}
                  style={{ 
                    marginRight: 15, 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    backgroundColor: '#000', // Set background to black
                    padding: 5, // Added padding for better touch area
                    borderRadius: 5, // Optional: Rounded corners for better UI
                  }}
                >
                  <Text style={{ color: '#FFA500', fontWeight: 'bold' }}>
                    Checkout
                  </Text>
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen 
            name="Checkout" 
            component={CheckoutScreen} 
            options={{
              title: 'Checkout',
              headerRight: () => null, // No additional button on Checkout screen
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CartContext.Provider>
  );
}
