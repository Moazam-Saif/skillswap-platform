import { createSlice } from '@reduxjs/toolkit';

const lockSlice = createSlice({
  name: 'animation',
  initialState: {
    activeCardId: null,
    requestQueue: []
  },
  reducers: {
    requestAnimation: (state, action) => {
      const { cardId } = action.payload;
      
      // If no card is currently animating, start immediately
      if (!state.activeCardId) {
        state.activeCardId = cardId;
      } else {
        // Add to queue if not already there
        if (!state.requestQueue.includes(cardId)) {
          state.requestQueue.push(cardId);
        }
      }
    },
    
    releaseAnimation: (state, action) => {
      const { cardId } = action.payload;
      
      // Only release if this card is currently active
      if (state.activeCardId === cardId) {
        state.activeCardId = null;
        
        // Assign next card in queue
        if (state.requestQueue.length > 0) {
          state.activeCardId = state.requestQueue.shift();
        }
      } else {
        // Remove from queue if it's there
        state.requestQueue = state.requestQueue.filter(id => id !== cardId);
      }
    },
    
    cancelAnimation: (state, action) => {
      const { cardId } = action.payload;
      
      // Remove from queue
      state.requestQueue = state.requestQueue.filter(id => id !== cardId);
      
      // If this card is currently active, release it
      if (state.activeCardId === cardId) {
        state.activeCardId = null;
        
        // Assign next card in queue
        if (state.requestQueue.length > 0) {
          state.activeCardId = state.requestQueue.shift();
        }
      }
    },
    
    // Safety cleanup action
    clearAnimationQueue: (state) => {
      state.activeCardId = null;
      state.requestQueue = [];
    }
  }
});

export const { 
  requestAnimation, 
  releaseAnimation, 
  cancelAnimation, 
  clearAnimationQueue 
} = lockSlice.actions;

export default lockSlice.reducer;