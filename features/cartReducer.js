// reducers/cartReducer.js
import { SET_CART, UPDATE_CART_ITEM } from './cartActions';

const initialState = {
  cart: {},
};

export default function cartReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CART:
      return { ...state, cart: action.payload };
    case UPDATE_CART_ITEM:
      return {
        ...state,
        cart: {
          ...state.cart,
          [action.payload.productId]: {
            ...state.cart[action.payload.productId],
            quantity: action.payload.quantity,
          },
        },
      };
    default:
      return state;
  }
}
