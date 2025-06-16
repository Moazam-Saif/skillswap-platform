import { configureStore } from '@reduxjs/toolkit';
import animationReducer from './animationSlice';
import popupReducer from './popupSlice'; // <-- add this

export default configureStore({
  reducer: {
    animation: animationReducer,
    popup: popupReducer, // <-- add this
  },
});