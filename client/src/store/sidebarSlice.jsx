import { createSlice } from '@reduxjs/toolkit';

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState: {
    isMobileOpen: false,
  },
  reducers: {
    openMobileSidebar: (state) => {
      state.isMobileOpen = true;
    },
    closeMobileSidebar: (state) => {
      state.isMobileOpen = false;
    },
    toggleMobileSidebar: (state) => {
      state.isMobileOpen = !state.isMobileOpen;
    },
  },
});

export const { openMobileSidebar, closeMobileSidebar, toggleMobileSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;