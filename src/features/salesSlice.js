import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedCustomer: null,
};

const salesSlice = createSlice({
    name: "sales",
    initialState,
    reducers: {
         selectCustomer: (state, action) => {
      state.selectedCustomer = action.payload;
    },
    clearSelectedCustomer: (state) => {
      state.selectedCustomer = null;
    },
    },
})

export const { selectCustomer, clearSelectedCustomer } = salesSlice.actions;
export default salesSlice.reducer;