import { createSlice } from '@reduxjs/toolkit';

const lockSlice = createSlice({
  name: 'cardAnimation',
  initialState: {
    activeCardId: null,
    requestQueue: []
  },
  reducers: {
    requestAnimation: (state, action) => {
      const { cardId } = action.payload;
      console.log('🔐 Animation requested for card:', cardId);
      
      if (!state.activeCardId) {
        state.activeCardId = cardId;
        console.log('✅ Animation granted immediately to:', cardId);
      } else {
        if (!state.requestQueue.includes(cardId)) {
          state.requestQueue.push(cardId);
          console.log('📝 Card added to queue:', cardId, 'Queue length:', state.requestQueue.length);
        }
      }
    },
    
    releaseAnimation: (state, action) => {
      const { cardId } = action.payload;
      console.log('🔄 Animation release requested for card:', cardId);
      
      if (state.activeCardId === cardId) {
        state.activeCardId = null;
        console.log('🛑 Animation released from:', cardId);
        
        if (state.requestQueue.length > 0) {
          state.activeCardId = state.requestQueue.shift();
          console.log('➡️ Next card from queue:', state.activeCardId);
        }
      } else {
        state.requestQueue = state.requestQueue.filter(id => id !== cardId);
        console.log('🗑️ Card removed from queue:', cardId);
      }
    },
    
    cancelAnimation: (state, action) => {
      const { cardId } = action.payload;
      console.log('❌ Animation cancelled for card:', cardId);
      
      state.requestQueue = state.requestQueue.filter(id => id !== cardId);
      
      if (state.activeCardId === cardId) {
        state.activeCardId = null;
        
        if (state.requestQueue.length > 0) {
          state.activeCardId = state.requestQueue.shift();
          console.log('➡️ Next card from queue after cancel:', state.activeCardId);
        }
      }
    }
  }
});

export const { requestAnimation, releaseAnimation, cancelAnimation } = lockSlice.actions;
export default lockSlice.reducer;