import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  featureImageList: [],
};

export const addFeatureImages = createAsyncThunk(
  "/common/addFeatureImages",
  async (image) => {
    // Make API request
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/common/images/add`,
      {image}
    );

    return response.data;
  }
);
export const getFeatureImages = createAsyncThunk(
  "/common/getFeatureImages",
  async () => {
    // Make API request
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/common/images/get`
    );

    return response.data;
  }
);

const commonFeatureImageSlice = createSlice({
  name: "commonFeatureImageSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImageList = action.payload.data;
      })
      .addCase(getFeatureImages.rejected, (state) => {
        state.isLoading = false;
        state.featureImageList = [];
      });
  },
});

export default commonFeatureImageSlice.reducer;
