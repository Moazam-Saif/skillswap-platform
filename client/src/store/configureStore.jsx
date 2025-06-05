import { configureStore } from '@reduxjs/toolkit';
import animationReducer from './animationSlice';

export default configureStore({
  reducer: {
    animation: animationReducer,
  },
});