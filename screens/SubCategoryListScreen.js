import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';

const randomImages = [
  'https://picsum.photos/100/100?random=1',
  'https://picsum.photos/100/100?random=2',
  'https://picsum.photos/100/100?random=3',
  'https://picsum.photos/100/100?random=4',
];

export default function SubCategoryListScreen({ route, navigation }) {
  const { list } = route.params; // This is the list of subcategories passed from the previous screen

  return (
    <View style={styles.container}>
      <FlatList
        data={list}
        keyExtractor={item => item._id}
        renderItem={({ item, index }) => (
          <TouchableOpacity 
            style={styles.card} 
            onPress={() => navigation.navigate('ProductList', { subCategoryId: item._id })}>
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: randomImages[index % randomImages.length] }} 
                style={styles.image} 
                resizeMode="cover"
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.cardText}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
        numColumns={2} // Display items in two columns
      />
    </View>
  );
}

const { width } = Dimensions.get('window'); // Get screen width

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    width: (width / 2) - 20, // Adjust width to fit screen with margin
    margin: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Transparent background
    borderRadius: 15, // Rounded corners
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  imageContainer: {
    width: '100%',
    height: (width / 2) - 20, // Set height to match card width
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 15, // Round corners of image container
    overflow: 'hidden', // Clip the image to the container
  },
  image: {
    width: (width / 2) - 20, // Make image circular
    height: (width / 2) - 20, // Make image circular
    borderRadius: (width / 2) - 20 / 2, // Make image round
    borderWidth: 2,
    borderColor: '#ddd', // Optional: Add a border to the image
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15, // Add padding for better text alignment
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Slightly opaque background for text
    borderRadius: 10, // Rounded corners for text background
  },
  cardText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    letterSpacing: 0.5, // Add letter spacing for a more premium look
  },
});
