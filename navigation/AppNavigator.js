import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import CategoryListScreen from '../screens/CategoryListScreen';
import SubCategoryListScreen from '../screens/SubCategoryListScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import AllOrdersScreen from '../screens/AllOrdersScreen';
import AccountScreen from '../screens/AccountScreen';
import SearchScreen from '../screens/SearchScreen';
import HelpScreen from '../screens/HelpScreen';
import { CartContext } from '../contexts/CartContext';
import { useSelector } from 'react-redux';
import AccountStackNavigator from './AccountStackNavigator';
import CategoryStackNavigator from './CategoryStackNavigator';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function AppStackNavigator() {
  const [cartCount, setCartCount] = useState(0);

  // const renderCartIcon = (navigation) => (
  //   <TouchableOpacity
  //     onPress={() => navigation.navigate('CartScreen')}
  //     style={{
  //       marginRight: 15,
  //       justifyContent: 'center',
  //       alignItems: 'center',
  //       backgroundColor: '#000',
  //       padding: 5,
  //       borderRadius: 5,
  //     }}
  //   >
  //     <MaterialIcons name="shopping-cart" size={24} color="#FFA500" />
  //     {cartCount > 0 && (
  //       <View
  //         style={{
  //           position: 'absolute',
  //           right: -8,
  //           top: -8,
  //           backgroundColor: 'red',
  //           borderRadius: 10,
  //           paddingHorizontal: 6,
  //           paddingVertical: 2,
  //         }}
  //       >
  //         <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>
  //           {cartCount}
  //         </Text>
  //       </View>
  //     )}
  //   </TouchableOpacity>
  // );

  return (
    // <CartContext.Provider value={{ cartCount, setCartCount }}>
      <Stack.Navigator>
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={({ navigation }) => ({
            headerRight: () => renderCartIcon(navigation),
          })}
        />
        
      </Stack.Navigator>
    // </CartContext.Provider>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="CategoryList" component={CategoryStackNavigator} options={{ headerShown: false }}/>
      {/* <Tab.Screen name="Account" component={AccountStackNavigator} /> */}
      <Tab.Screen name="AllOrders" component={AllOrdersScreen} options={{ title: "Orders" }}/>
      <Tab.Screen name="Help" component={HelpScreen} />
    </Tab.Navigator>
  );
}


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [token]);

  return (
    <NavigationContainer>
      {isLoggedIn ? <TabNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
}
