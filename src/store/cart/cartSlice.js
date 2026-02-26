import { createSlice } from "@reduxjs/toolkit";

const CART_KEY = "cart_items";

const loadCart = () => {
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const saveCart = cart => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: loadCart()
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;

      if (state.items[item.id]) {
        state.items[item.id].quantity += 1;
      } else {
        state.items[item.id] = {
          ...item,
          quantity: 1
        };
      }

      saveCart(state.items);
    },

    removeFromCart: (state, action) => {
      delete state.items[action.payload];
      saveCart(state.items);
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      if (state.items[id]) {
        state.items[id].quantity = quantity;
      }
      saveCart(state.items);
    },

    clearCart: state => {
      state.items = {};
      saveCart(state.items);
    }
  }
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;