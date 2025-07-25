import { configureStore } from '@reduxjs/toolkit';
import animationReducer from './animationSlice';
import lockReducer from './lockSlice';
import popupReducer from './popupSlice';
import sidebarReducer from './sidebarSlice'; // Add this import

export default configureStore({
  reducer: {
    animation: animationReducer,
    cardAnimation: lockReducer,
    popup: popupReducer,
    sidebar: sidebarReducer, // Add this line
  },
});