import { createSlice } from "@reduxjs/toolkit";

type HealthState = {
  steps: number;
  sleepHours: number;
  heartRate: number;
  source: string[];
};

const initialState: HealthState = {
  steps: 8260,
  sleepHours: 7.1,
  heartRate: 72,
  source: ["Apple Health/Google Fit", "WeChat Sports", "Keep"],
};

const healthSlice = createSlice({
  name: "health",
  initialState,
  reducers: {},
});

export default healthSlice.reducer;
