import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Modal, Alert, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [addressPickerValue, setAddressPickerValue] = useState('none');

  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    const fetchCartAndAddresses = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const cartResponse = await fetch('https://saman-backend.onrender.com/api/v1/order/cart', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const cartData = await cartResponse.json();
        setCartItems(cartData);
        const total = cartData.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        setTotalAmount(total);

        // Fetch addresses
        const addressResponse = await fetch('https://saman-backend.onrender.com/api/v1/order/addresses', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const addressData = await addressResponse.json();
        setAddresses(addressData);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchCartAndAddresses();
  }, []);

  const handleConfirmOrder = async () => {
    if (!selectedAddress) {
      Alert.alert('Error', 'Please select or add a delivery address.');
      return;
    }
  
    try {
      const token = await AsyncStorage.getItem('userToken');
      // const userId = await AsyncStorage.getItem('userId'); // Fetch the userId from AsyncStorage
      if (!user._id) {
        Alert.alert('Error', 'User ID not found.');
        return;
      }

      // Format the cart data
      const formattedCart = cartItems.map(item => ({
        _id: item._id,
        product: {
          _id: item.product._id,
          name: item.product.name,
          description: item.product.description,
          price: item.product.price,
          category: item.product.category,
          subcategory: item.product.subcategory,
          images: item.product.images,
        },
        quantity: item.quantity,
        user: item.product.user, // Assuming this is correct; adjust if needed
      }));

      console.log("=================-d",JSON.stringify({
        userId: user._id,
        cart: formattedCart,
        deliveryAddress: selectedAddress.address, // Ensure this matches the API expectation
        paymentMethod,
        totalAmount,
      }))
      const response = await fetch('https://saman-backend.onrender.com/api/v1/order/confirm', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          cart: cartItems,
          deliveryAddress: selectedAddress.address, // Ensure this matches the API expectation
          paymentMethod,
          totalAmount,
        })
      });
  
      const data = await response.json();

      console.log("=============================adasdsadasdsdaassda",data)
      if (data) {
        navigation.navigate('AllOrders', { orderId: data._id });
      } else {
        Alert.alert('Error', 'Failed to confirm the order. Please try again.');
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      Alert.alert('Error', 'Failed to confirm the order. Please try again.');
    }
  };
  

  const handleAddAddress = async () => {
    if (!newAddress || !contactNumber) {
      Alert.alert('Error', 'Both address and contact number are required.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch('https://saman-backend.onrender.com/api/v1/order/addresses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: newAddress, contact: contactNumber }),
      });

      const data = await response.json();
      if (data.success) {
        setAddresses([...addresses, data.address]);
        setSelectedAddress(data.address);
        setAddressModalVisible(false);
        setNewAddress('');
        setContactNumber('');
      } else {
        Alert.alert('Error', 'Failed to add address. Please try again.');
      }
    } catch (error) {
      console.error("Error adding address:", error);
      Alert.alert('Error', 'Failed to add address. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Text style={styles.productName}>{item.product.name}</Text>
                <Text>Quantity: {item.quantity}</Text>
                <Text>Price: {item.product.price}</Text>
              </View>
            )}
          />
          <Text style={styles.totalAmount}>Total Amount: {totalAmount}</Text>
          <Button title="Select Address" onPress={() => setAddressModalVisible(true)} />
          <Text style={styles.selectedAddressText}>Selected Address: {selectedAddress ? selectedAddress.address : 'None'}</Text>
          <Picker
            selectedValue={paymentMethod}
            style={styles.picker}
            onValueChange={(itemValue) => setPaymentMethod(itemValue)}
          >
            <Picker.Item label="Credit Card" value="credit_card" />
            <Picker.Item label="Cash on Delivery" value="cash_on_delivery" />
          </Picker>
          <Button title="Confirm Order" onPress={handleConfirmOrder} />

          {/* Address Modal */}
          <Modal
            visible={addressModalVisible}
            onRequestClose={() => setAddressModalVisible(false)}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Address</Text>
                <Picker
                  selectedValue={addressPickerValue}
                  style={styles.picker}
                  onValueChange={(itemValue) => {
                    setAddressPickerValue(itemValue);
                    if (itemValue === 'add_new') {
                      setSelectedAddress(null);
                    } else {
                      setSelectedAddress(addresses.find(address => address._id === itemValue));
                    }
                  }}
                >
                  {addresses.map((address) => (
                    <Picker.Item key={address._id} label={address.address} value={address._id} />
                  ))}
                  <Picker.Item label="Add New Address" value="add_new" />
                </Picker>
                {addressPickerValue === 'add_new' && (
                  <View style={styles.addressForm}>
                    <Text style={styles.inputLabel}>Address</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter address"
                      value={newAddress}
                      onChangeText={setNewAddress}
                    />
                    <Text style={styles.inputLabel}>Contact Number</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter contact number"
                      value={contactNumber}
                      onChangeText={setContactNumber}
                      keyboardType="phone-pad"
                    />
                    <Button title="Add Address" onPress={handleAddAddress} />
                  </View>
                )}
                <TouchableOpacity style={styles.closeButton} onPress={() => setAddressModalVisible(false)}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  cartItem: {
    marginBottom: 15,
    padding: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  selectedAddressText: {
    fontSize: 16,
    marginVertical: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    margin: 20,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addressForm: {
    marginTop: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '600',
  },
  textInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default CartScreen;
