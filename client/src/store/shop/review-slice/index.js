import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productReviews: [],
};

export const addProductReview = createAsyncThunk(
  "/review/addProductReview",
  async (data) => {
    // Make API request
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/shop/review/add`,
      data
    );

    return response.data;
  }
);
export const getProductReviews = createAsyncThunk(
  "/review/getProductReviews",
  async (productId) => {
    // Make API request
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/review/${productId}`
    );

    return response.data;
  }
);

const ProductReviewSlice = createSlice({
  name: "ProductReviewSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProductReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productReviews = action.payload.data;
      })
      .addCase(getProductReviews.rejected, (state) => {
        state.isLoading = false;
        state.productReviews = [];
      });
  },
});

export default ProductReviewSlice.reducer;
