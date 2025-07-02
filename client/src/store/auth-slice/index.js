import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { auth, googleProvider } from "../../config/db";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  // token: null,
};

export const loginWithGoogle = createAsyncThunk(
  "/auth/google-login",
  async (_, { rejectWithValue }) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log(result);
      const idToken = await result.user.getIdToken(); 
      console.log("token",idToken);// Firebase JWT
      // send to your backend for verification & user creation
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/google-login`,
        { idToken },
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// export const registerUser = createAsyncThunk(
//   "/auth/register",
//   async (formData) => {
//     const response = await axios.post(
//       `${import.meta.env.VITE_API_URL}/api/auth/register`,
//       formData,
//       {
//         withCredentials: true,
//       }
//     );
//     return response.data;
//   }
// );

export const loginUser = createAsyncThunk("/auth/login", async (formData) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/api/auth/login`,
    formData,
    {
      withCredentials: true,
    }
  );
  return response.data;
});

export const checkAuth = createAsyncThunk("/auth/check-auth", async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/auth/check-auth`,
    {
      withCredentials: true,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate,proxy-revalidate",
      },
    }
  );
  return response.data;
});

// export const checkAuth = createAsyncThunk(
//   "/auth/check-auth",

//   async (token) => {
//     const response = await axios.get(
//       `${import.meta.env.VITE_API_URL}/api/auth/check-auth`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Cache-Control":
//             "no-cache, no-store, must-revalidate,proxy-revalidate",
//         },
//       }
//     );
//     return response.data;
//   }
// );

export const logoutUser = createAsyncThunk("/auth/logout", async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/auth/logout`,
    {
      withCredentials: true,
    }
  );
  return response.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // resetTokenAndCredentials: (state) => {
    //   state.isAuthenticated = false;
    //   state.user = null;
    //   state.token = null;
    // },
  },

  extraReducers: (builder) => {
    builder
      // .addCase(registerUser.pending, (state) => {
      //   state.isLoading = true;
      // })
      // .addCase(registerUser.fulfilled, (state) => {
      //   state.isLoading = false;
      //   state.isAuthenticated = false; // Assuming registration does not auto-login
      //   state.user = null;
      // })
      // .addCase(registerUser.rejected, (state) => {
      //   state.isLoading = false;
      //   state.isAuthenticated = false;
      //   state.user = null;
      // })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload.success; // Assuming registration does not auto-login
        state.user = action.payload.success ? action.payload.user : null; // Assuming the payload contains user data
        // state.token = action.payload.token;
        // sessionStorage.setItem("token", JSON.stringify(action.payload.token));
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        // state.token = null;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload.success; // Assuming registration does not auto-login
        state.user = action.payload.success ? action.payload.user : null; // Assuming the payload contains user data
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload.success;
        state.user = action.payload.success ? action.payload.user : null;
      })
      .addCase(loginWithGoogle.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

// export const {resetTokenAndCredentials} = authSlice.actions;
export default authSlice.reducer;
