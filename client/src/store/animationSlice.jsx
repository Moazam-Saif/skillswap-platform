import { createSlice } from '@reduxjs/toolkit';

const animationSlice = createSlice({
  name: 'animation',
  initialState: {
    iconAnimationActive: false,
  },
  reducers: {
    setIconAnimationActive: (state, action) => {
      state.iconAnimationActive = action.payload;
    },
  },
});

export const { setIconAnimationActive } = animationSlice.actions;
export default animationSlice.reducer;