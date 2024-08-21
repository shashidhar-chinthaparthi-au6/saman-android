import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';

const NUM_COLUMNS = 2;  // Define a constant for number of columns

export default function CategoryListScreen({ navigation }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from API
    fetch('https://saman-backend.onrender.com/api/categories')
      .then(response => response.json())  // Parse the JSON from the response
      .then(data => {
        setCategories(data.data);  // Set the categories state
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={item => item._id}  // Ensure key is a string
        numColumns={NUM_COLUMNS}  // Fixed number of columns
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('SubCategoryList', { list:item.subCategories })}>
            <Image source={{ uri: 'https://picsum.photos/200/200?random=' + item._id }} style={styles.cardImage} />
            <Text style={styles.cardText}>{item.name}</Text>
          </TouchableOpacity>
        )}
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
  card: {
    flex: 1,
    margin: 10,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',  // Slightly translucent background
  },
});
