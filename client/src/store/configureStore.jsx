import { configureStore } from '@reduxjs/toolkit';
import animationReducer from './animationSlice';
import lockReducer from './lockSlice';
import popupReducer from './popupSlice';
import sidebarReducer from './sidebarSlice';
import circleAnimationReducer from './circleAnimationSlice'; // Add this import

export default configureStore({
  reducer: {
    animation: animationReducer,
    cardAnimation: lockReducer,
    popup: popupReducer,
    sidebar: sidebarReducer,
    circleAnimation: circleAnimationReducer, // Add this line
  },
});