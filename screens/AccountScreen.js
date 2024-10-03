// src/screens/AccountScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function AccountScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Screen</Text>
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate('ProfileScreen')}
        color="#FFA500" // Example color
      />
      <Button
        title="Go to Contact"
        onPress={() => navigation.navigate('ContactScreen')}
        color="#FFA500" // Example color
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
