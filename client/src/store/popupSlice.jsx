import { createSlice } from '@reduxjs/toolkit';

const popupSlice = createSlice({
  name: 'popup',
  initialState: {
    isPopupOpen: false,
  },
  reducers: {
    openPopup: (state) => {
      state.isPopupOpen = true;
    },
    closePopup: (state) => {
      state.isPopupOpen = false;
    },
    setPopup: (state, action) => {
      state.isPopupOpen = action.payload;
    }
  },
});

export const { openPopup, closePopup, setPopup } = popupSlice.actions;
export default popupSlice.reducer;