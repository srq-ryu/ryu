import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type MoodType = "happy" | "calm" | "anxious" | "sad" | "tired";

type MoodState = {
  selectedMood: MoodType | null;
  weeklyMoods: MoodType[];
};

const initialState: MoodState = {
  selectedMood: null,
  weeklyMoods: ["calm", "happy", "tired", "anxious", "calm", "happy", "sad"],
};

const moodSlice = createSlice({
  name: "mood",
  initialState,
  reducers: {
    setMood(state, action: PayloadAction<MoodType>) {
      state.selectedMood = action.payload;
    },
    addDailyMood(state, action: PayloadAction<MoodType>) {
      state.weeklyMoods.push(action.payload);
      if (state.weeklyMoods.length > 30) state.weeklyMoods.shift();
    },
  },
});

export const { setMood, addDailyMood } = moodSlice.actions;
export default moodSlice.reducer;
