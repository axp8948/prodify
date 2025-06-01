// src/store/placeholderSlice.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isAuthenticated : false,
  userData : null
}

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    authLogin : (state, action) => {
      state.isAuthenticated = true,
      state.userData = action.payload
    }, 

    authLogout: (state) => {
      state.isAuthenticated = false,
      state.userData = null
    }
    
  }
})

export const {authLogin, authLogout} = authSlice.actions;

export default authSlice.reducer;
