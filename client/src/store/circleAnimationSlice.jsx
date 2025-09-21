import { createSlice } from '@reduxjs/toolkit';

const circleAnimationSlice = createSlice({
  name: 'circleAnimation',
  initialState: {
    animationPhase: 'idle', // 'idle' → 'moving' → 'intersected' → 'fading' → 'completed'
    showContent: false,
    circlesVisible: true,
  },
  reducers: {
    startAnimation: (state) => {
      state.animationPhase = 'moving';
      state.showContent = false;
      state.circlesVisible = true;
    },
    setIntersected: (state) => {
      state.animationPhase = 'intersected';
    },
    startFadeOut: (state) => {
      state.animationPhase = 'fading';
    },
    completeAnimation: (state) => {
      state.animationPhase = 'completed';
      state.showContent = true;
      state.circlesVisible = false;
    },
  },
});

export const { startAnimation, setIntersected, startFadeOut, completeAnimation } = circleAnimationSlice.actions;
export default circleAnimationSlice.reducer;