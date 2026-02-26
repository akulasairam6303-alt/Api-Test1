import { createSlice } from "@reduxjs/toolkit";

const KEY = "wishlist_items";

const loadWishlist = () => {
  try {
    const data = localStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveWishlist = list => {
  localStorage.setItem(KEY, JSON.stringify(list));
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: loadWishlist()
  },
  reducers: {
    addToWishlist: (state, action) => {
      const exists = state.items.find(
        i => i.id === action.payload.id
      );
      if (!exists) {
        state.items.push(action.payload);
        saveWishlist(state.items);
      }
    },

    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(
        i => i.id !== action.payload
      );
      saveWishlist(state.items);
    },

    clearWishlist: state => {
      state.items = [];
      saveWishlist(state.items);
    }
  }
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist
} = wishlistSlice.actions;

export default wishlistSlice.reducer;