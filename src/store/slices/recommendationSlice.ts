import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { MoodType } from "./moodSlice";
import { getHealingRecommendations, RecommendationPack } from "../../services/recommendationService";

type RecommendationState = {
  data: RecommendationPack | null;
  status: "idle" | "loading" | "success" | "error";
};

const initialState: RecommendationState = {
  data: null,
  status: "idle",
};

export const fetchRecommendations = createAsyncThunk(
  "recommendation/fetch",
  async (mood: MoodType) => getHealingRecommendations(mood)
);

const recommendationSlice = createSlice({
  name: "recommendation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.status = "success";
        state.data = action.payload;
      })
      .addCase(fetchRecommendations.rejected, (state) => {
        state.status = "error";
      });
  },
});

export default recommendationSlice.reducer;
