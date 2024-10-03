import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CategoryListScreen from '../screens/CategoryListScreen';
import SubCategoryListScreen from '../screens/SubCategoryListScreen';
import ProductListScreen from '../screens/ProductListScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import AllOrdersScreen from '../screens/AllOrdersScreen';
import CartScreen from '../screens/CartScreen';
import { TouchableOpacity } from 'react-native';

const Stack = createStackNavigator();

function CategoryStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CategoryList"
        component={CategoryListScreen}
        options={{ title: 'Categories' }} // Title for this screen
      />
      <Stack.Screen
        name="SubCategoryList"
        component={SubCategoryListScreen}
        options={({ route }) => ({
          title: route.params?.subcategoryName || 'Subcategories', // Title for subcategory list
        })}
      />
      <Stack.Screen
        name="ProductList"
        component={ProductListScreen}
        options={({ route }) => ({
          title: route.params?.categoryName || 'Products', // Title for product list
        })}
      />
      <Stack.Screen
          name="CartScreen"
          component={CartScreen}
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Checkout')}
                style={{
                  marginRight: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#000',
                  padding: 5,
                  borderRadius: 5,
                }}
              >
              </TouchableOpacity>
            ),
          })}
        />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="AllOrders" component={AllOrdersScreen} />
    </Stack.Navigator>
  );
}

export default CategoryStackNavigator;
