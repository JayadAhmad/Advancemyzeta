import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,              // { name, role }
    token: null,
    isAuthenticated: false,
    isAuthInitialized: false,
    loading: false,
    error: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
        console.log("loginSuccess action payload authSlice:", action.payload);
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;

      localStorage.setItem(
        "auth",
        JSON.stringify({ user, token })
      );
    },
    authInitialized: (state) => {
  state.isAuthInitialized = true;
},

    hydrateAuth: (state, action) => {
        console.log("hydrateAuth action payload authSlice:", action.payload);
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
        state.isAuthInitialized = true;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      
      localStorage.removeItem("auth");
    },
  },
});

export const { loginSuccess, logout, hydrateAuth, authInitialized } = authSlice.actions;
export default authSlice.reducer;