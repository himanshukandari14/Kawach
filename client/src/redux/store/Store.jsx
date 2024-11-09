// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// Remove TypeScript type exports and just export the store
export default store;