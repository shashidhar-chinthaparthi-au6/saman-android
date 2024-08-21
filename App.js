import React from 'react';
import { CartProvider } from './screens/CartContext'; // Update with correct path
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <CartProvider>
      <AppNavigator />
    </CartProvider>
  );
}
