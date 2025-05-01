import { combineReducers } from "@reduxjs/toolkit";
import financialReducer from "./Slices/financialSlice";

const rootReducer = combineReducers({
  financial: financialReducer,
});

export default rootReducer;
