import { createSlice } from '@reduxjs/toolkit';

const circleAnimationSlice = createSlice({
  name: 'circleAnimation',
  initialState: {
    animationPhase: 'idle', // 'idle' → 'moving' → 'intersected' → 'letterAnimation' → 'fading' → 'completed'
    showContent: false,
    lettersVisible: 0, // Number of letters currently visible in SKILLSWAP
  },
  reducers: {
    startAnimation: (state) => {
      state.animationPhase = 'moving';
      state.showContent = false;
      state.lettersVisible = 0;
    },
    setIntersected: (state) => {
      state.animationPhase = 'intersected';
    },
    startLetterAnimation: (state) => {
      state.animationPhase = 'letterAnimation';
    },
    showNextLetter: (state) => {
      if (state.lettersVisible < 9) { // SKILLSWAP has 9 letters
        state.lettersVisible += 1;
      }
    },
    startFadeOut: (state) => {
      state.animationPhase = 'fading';
    },
    completeAnimation: (state) => {
      state.animationPhase = 'completed';
      state.showContent = true;
      state.lettersVisible = 0;
    },
  },
});

export const { 
  startAnimation, 
  setIntersected, 
  startLetterAnimation,
  showNextLetter,
  startFadeOut, 
  completeAnimation 
} = circleAnimationSlice.actions;

export default circleAnimationSlice.reducer;