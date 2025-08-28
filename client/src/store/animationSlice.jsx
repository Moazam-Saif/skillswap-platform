import { createSlice } from '@reduxjs/toolkit';

// Helper to get two new random indices, not equal to each other or the previous two
function getTwoRandomIndices(prevIndices) {
  const iconCount = 16; // Total number of icons
  let available = Array.from({length: iconCount}, (_, i) => i).filter(i => !prevIndices.includes(i));
  let first = available[Math.floor(Math.random() * available.length)];
  let available2 = available.filter(i => i !== first);
  let second = available2[Math.floor(Math.random() * available2.length)];
  return [first, second];
}

const animationSlice = createSlice({
  name: 'animation',
  initialState: {
    iconAnimationActive: false,
    iconIndices: [0, 1], // [left, right] shared state
    prevIndices: [0, 1],
  },
  reducers: {
    setIconAnimationActive: (state, action) => {
      state.iconAnimationActive = action.payload;
    },
    setIconIndices: (state, action) => {
      state.iconIndices = action.payload;
    },
    swapIconIndices: (state) => {
      state.iconIndices = [state.iconIndices[1], state.iconIndices[0]];
    },
    setNewRandomIcons: (state) => {
      const newIndices = getTwoRandomIndices(state.prevIndices);
      state.iconIndices = newIndices;
      state.prevIndices = newIndices;
    },
    setPrevIndices: (state, action) => {
      state.prevIndices = action.payload;
    }
  },
});

export const { 
  setIconAnimationActive, 
  setIconIndices, 
  swapIconIndices, 
  setNewRandomIcons,
  setPrevIndices 
} = animationSlice.actions;
export default animationSlice.reducer;