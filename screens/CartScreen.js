import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../features/loaderSlice'; // Adjust the import path
import Loader from '../components/Loader'; // Adjust the import path
import { Picker } from '@react-native-picker/picker'; // Import Picker from the new package

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [addressAction, setAddressAction] = useState('select'); // 'select' or 'add'
  const dispatch = useDispatch();
  const loading = useSelector(state => state.loader.loading);
  const token = useSelector(state => state.auth.token);
  const user = useSelector(state => state.auth.user);


  useEffect(() => {
    const fetchCartAndAddresses = async () => {
      try {
        dispatch(showLoader());
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
        if (addressData.length > 0) {
          setSelectedAddress(addressData[0]);
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to fetch data.');
      } finally {
        dispatch(hideLoader());
      }
    };

    fetchCartAndAddresses();
  }, [token, dispatch]);

  const handleRemoveItem = async (cartItemId) => {
    try {
      dispatch(showLoader());
      const response = await fetch(`https://saman-backend.onrender.com/api/v1/order/cart/${cartItemId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: 0 }),
      });

      const data = await response.json();
      if (data.success) {
        Alert.alert('Success', 'Item removed from cart.');
        setCartItems(cartItems.filter(item => item._id !== cartItemId)); // Update cart items locally
        const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        setTotalAmount(total);
      } else {
        Alert.alert('Error', 'Failed to remove item.');
      }
    } catch (error) {
      console.error("Error removing item:", error);
      Alert.alert('Error', 'Failed to remove item.');
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleConfirmOrder = () => {
    if (!selectedAddress) {
      Alert.alert('Error', 'Please select a delivery address.');
      return;
    }
    setAddressModalVisible(true);
  };

  const handleAddAddress = async () => {
    if (!newAddress || !contactNumber) {
      Alert.alert('Error', 'Both address and contact number are required.');
      return;
    }

    try {
      dispatch(showLoader());
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
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleConfirmAddress = () => {
    setPaymentModalVisible(true);
    setAddressModalVisible(false);
  };

  const handleConfirmPaymentMethod = async () => {
    try {
      dispatch(showLoader());
      console.log("===============user",cartItems[0]["_id"])
      const response = await fetch('https://saman-backend.onrender.com/api/v1/order/confirm', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user["_id"],
          cart: cartItems,
          deliveryAddress: selectedAddress["address"],
          paymentMethod,
          totalAmount,
        })
      });

      const data = await response.json();
      console.log("=================data",data)
      if (data) {
        Alert.alert('Success', 'Order confirmed successfully.');
        setPaymentModalVisible(false)
        navigation.navigate('AllOrders', { orderId: data._id });
      } else {
        Alert.alert('Error', 'Failed to confirm the order. Please try again.');
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      Alert.alert('Error', 'Failed to confirm the order. Please try again.');
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <View style={styles.container}>
      {loading && <Loader />}
      {cartItems.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
          <TouchableOpacity style={styles.browseButton} onPress={() => navigation.navigate('CategoryList')}>
            <Text style={styles.browseButtonText}>Browse Items</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <Text style={styles.productName}>{item.product.name}</Text>
                <Text style={styles.productDetails}>Quantity: {item.quantity}</Text>
                <Text style={styles.productDetails}>Price: ₹{item.product.price}</Text>
                <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveItem(item._id)}>
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <Text style={styles.totalAmount}>Total: ₹{totalAmount}</Text>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmOrder}>
            <Text style={styles.confirmButtonText}>Confirm Order</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Address Modal */}
      <Modal
        transparent={true}
        visible={addressModalVisible}
        onRequestClose={() => setAddressModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Address</Text>
            {addressAction === 'select' ? (
              <>
                <Picker
                  selectedValue={selectedAddress}
                  onValueChange={(itemValue) => setSelectedAddress(itemValue)}
                  style={styles.picker}
                >
                  {addresses.map(address => (
                    <Picker.Item key={address._id} label={address.address} value={address} />
                  ))}
                </Picker>
                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmAddress}>
                  <Text style={styles.confirmButtonText}>Confirm Address</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.addAddressButton}
                  onPress={() => {
                    setAddressAction('add');
                    setNewAddress('');
                    setContactNumber('');
                  }}
                >
                  <Text style={styles.addAddressButtonText}>Add New Address</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="New Address"
                  value={newAddress}
                  onChangeText={setNewAddress}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Contact Number"
                  value={contactNumber}
                  onChangeText={setContactNumber}
                  keyboardType="phone-pad"
                />
                <TouchableOpacity style={styles.confirmButton} onPress={handleAddAddress}>
                  <Text style={styles.confirmButtonText}>Add Address</Text>
                </TouchableOpacity>
                <Button title="Cancel" onPress={() => setAddressModalVisible(false)} color="red" />
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Payment Modal */}
      <Modal
        transparent={true}
        visible={paymentModalVisible}
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Payment Method</Text>
            <Picker
              selectedValue={paymentMethod}
              onValueChange={(itemValue) => setPaymentMethod(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Cash" value="cash" />
              <Picker.Item label="Credit Card" value="creditCard" />
              <Picker.Item label="Debit Card" value="debitCard" />
              <Picker.Item label="PayPal" value="paypal" />
            </Picker>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPaymentMethod}>
              <Text style={styles.confirmButtonText}>Confirm Order</Text>
            </TouchableOpacity>
            <Button title="Cancel" onPress={() => setPaymentModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  cartItem: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productDetails: {
    fontSize: 14,
    color: '#555',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  removeButton: {
    marginTop: 10,
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFF',
    fontSize: 14,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  browseButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  addressContainer: {
    marginVertical: 20,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addAddressButton: {
    marginTop: 10,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addAddressButtonText: {
    color: '#FFF',
    fontSize: 14,
  },
  paymentContainer: {
    marginVertical: 20,
  },
  paymentLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 5,
    marginVertical: 10,
  },
  confirmButton: {
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default CartScreen;
