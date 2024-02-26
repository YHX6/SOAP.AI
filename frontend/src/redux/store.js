import { configureStore } from '@reduxjs/toolkit';
import { documentSlice } from './documentSlice';
import { userSlice } from './userSlice';

export const store = configureStore({
  reducer: {
    "document":documentSlice.reducer,
    "user":userSlice.reducer,
  },
});
