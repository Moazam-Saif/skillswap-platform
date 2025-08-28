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
    iconIndices: [0, 1], // [left, right] current icons
    prevIndices: [0, 1],
    // Store indices before swap for communication
    leftPopInIndex: null,
    rightPopInIndex: null,
  },
  reducers: {
    setIconAnimationActive: (state, action) => {
      state.iconAnimationActive = action.payload;
    },
    setIconIndices: (state, action) => {
      state.iconIndices = action.payload;
    },
    // Store current indices and set what each side should pop-in with
    prepareSwap: (state) => {
      const currentLeft = state.iconIndices[0];
      const currentRight = state.iconIndices[1];
      
      // Left side will pop-in with what right side currently has
      state.leftPopInIndex = currentRight;
      // Right side will pop-in with what left side currently has
      state.rightPopInIndex = currentLeft;
    },
    // Clear the communication variables
    clearSwapCommunication: (state) => {
      state.leftPopInIndex = null;
      state.rightPopInIndex = null;
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
  prepareSwap,
  clearSwapCommunication,
  setNewRandomIcons,
  setPrevIndices 
} = animationSlice.actions;
export default animationSlice.reducer;