import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  count: 0,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotificationsState: (state, action) => {
      state.count = action.payload;
    },
    resetNotifications: (state) => {
      state.count = initialState.title;
    },
  },
});

export const { resetNotifications, setNotificationsState } = notificationSlice.actions;
export default notificationSlice.reducer;
