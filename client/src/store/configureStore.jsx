import { configureStore } from '@reduxjs/toolkit';
import animationReducer from './animationSlice';
import popupReducer from './popupSlice'; // <-- add this
import lockReducer from './lockSlice';

export default configureStore({
  reducer: {
    animation: animationReducer,
    popup: popupReducer, // <-- add this
    lock:lockReducer
  },
});