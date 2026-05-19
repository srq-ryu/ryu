import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MoodType } from "./moodSlice";

export type JournalEntry = {
  id: string;
  date: string;
  mood: MoodType;
  text: string;
  imageUri?: string;
  voiceUri?: string;
};

type JournalState = {
  entries: JournalEntry[];
  selectedDate: string | null;
};

const initialState: JournalState = {
  entries: [],
  selectedDate: null,
};

const journalSlice = createSlice({
  name: "journal",
  initialState,
  reducers: {
    addEntry(state, action: PayloadAction<JournalEntry>) {
      state.entries.unshift(action.payload);
    },
    filterByDate(state, action: PayloadAction<string | null>) {
      state.selectedDate = action.payload;
    },
  },
});

export const { addEntry, filterByDate } = journalSlice.actions;
export default journalSlice.reducer;
