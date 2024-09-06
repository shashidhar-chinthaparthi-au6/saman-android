// actions/cartActions.js
export const SET_CART = 'SET_CART';
export const UPDATE_CART_ITEM = 'UPDATE_CART_ITEM';

export const setCart = (cart) => ({
  type: SET_CART,
  payload: cart,
});

export const updateCartItem = (productId, quantity) => ({
  type: UPDATE_CART_ITEM,
  payload: { productId, quantity },
});
