// src/store/store.js
import { configureStore } from '@reduxjs/toolkit'
import placeholderReducer from './placeholderSlice'

const store = configureStore({
  reducer: {
    // now we have at least one valid reducer
    placeholder: placeholderReducer,
  },
})

export default store
