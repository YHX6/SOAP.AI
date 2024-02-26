import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user_id: "temp01", // temporaly used, better stored in cookie/localstorage
  },
  reducers: {
    initStoryPlay: (state, action) => {
      state.items.push(action.payload);
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
