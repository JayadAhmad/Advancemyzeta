import { configureStore } from "@reduxjs/toolkit";
// import  from "../features/authSlice";
import authReducer from "../features/authSlice";
import salesReducer from "../features/salesSlice";


export const store = configureStore({  
    reducer: {
        auth: authReducer,
        sales: salesReducer,
    },
});

