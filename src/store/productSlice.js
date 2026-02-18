import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProducts = createAsyncThunk( 
  "products/fetch",  
  async () => {
    const res = await axios.get(
      "https://dummyjson.com/products"
    );
    return res.data.products;
  }
);

const slice = createSlice({
  name: "products",
  initialState: { items: [] },
  extraReducers: builder => {
    builder.addCase(fetchProducts.fulfilled, (s, a) => {
      s.items = a.payload;
    });
  }
});

export default slice.reducer;
