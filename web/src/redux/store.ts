import { configureStore } from "@reduxjs/toolkit";
import classroomReducer from "@/redux/slices/classroomSlice";

export const store = configureStore({
  reducer: {
    classroom: classroomReducer,
  },
});

// Types (for TypeScript)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
