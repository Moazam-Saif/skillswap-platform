import { configureStore } from '@reduxjs/toolkit';
import animationReducer from './animationSlice'; // Your existing icon animation
import lockReducer from './lockSlice'; // Card animation lock
import popupReducer from './popupSlice';

export default configureStore({
  reducer: {
    animation: animationReducer,      // For icon animations
    cardAnimation: lockReducer,       // For card animations
    popup: popupReducer,
  },
});