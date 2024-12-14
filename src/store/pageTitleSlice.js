import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  title: 'Главная',
};

const pageTitleSlice = createSlice({
  name: 'pageTitle',
  initialState,
  reducers: {
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    resetTitle: (state) => {
      state.title = initialState.title;
    },
  },
});

export const { setTitle, resetTitle } = pageTitleSlice.actions;
export default pageTitleSlice.reducer;
