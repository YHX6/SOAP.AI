import { createSlice } from '@reduxjs/toolkit';


export const documentSlice = createSlice({
  name: 'document',
  initialState: {
    sessionInfo:{},
    therapist: [],
    members: [],
  },
  reducers: {
    initData: (state, action) => {
      state.sessionInfo.identifier = action.payload.identifier;
      state.sessionInfo.dateOfSession = action.payload.dateOfSession;
      state.sessionInfo.timeOfSession = action.payload.timeOfSession;
      state.sessionInfo.location = action.payload.location;
      state.therapist = action.payload.therapist;
      state.members = action.payload.members;
    },
    setPatientData: (state, action) => {
      let key = action.payload.key;
      let value = action.payload.value;
      state.members.documentData[key] = value;
    }
  },
});

export const documentActions = documentSlice.actions;

export default documentSlice.reducer;
