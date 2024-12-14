import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice'; 
import profileSlice from './profileSlice';
import pageTitleReducer from './pageTitleSlice';
import Notifications from './notificationSlice';

export default configureStore({
  reducer: {
    user: userSlice,
    profile: profileSlice,
    pageTitle: pageTitleReducer,
    notifications: Notifications,
  },
});
