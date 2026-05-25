import { configureStore } from "@reduxjs/toolkit";
import moodReducer from "./slices/moodSlice";
import recommendationReducer from "./slices/recommendationSlice";
import journalReducer from "./slices/journalSlice";
import healthReducer from "./slices/healthSlice";
import themeReducer from "./slices/themeSlice";

export const store = configureStore({
  reducer: {
    mood: moodReducer,
    recommendation: recommendationReducer,
    journal: journalReducer,
    health: healthReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
