import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (formData, { rejectWithValue }) => {
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        joinAsSeller: true
      };

      await axios.post(
        "http://65.0.29.192:5000/api/auth/signup",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      return payload;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Signup failed"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      await axios.post(
        "http://65.0.29.192:5000/api/auth/login",
        credentials,
        { headers: { "Content-Type": "application/json" } }
      );

      return { email: credentials.email };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Invalid credentials"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    success: null
  },

  reducers: {
    logout: state => {
      state.user = null;
      state.error = null;
      state.success = null;
    },

    clearMessages: state => {
      state.error = null;
      state.success = null;
    }
  },

  extraReducers: builder => {
    builder

      // signup
      .addCase(signupUser.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(signupUser.fulfilled, state => {
        state.loading = false;
        state.success = "Signup successful";
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // login
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = "Login successful";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, clearMessages } = authSlice.actions;
export default authSlice.reducer;
