import axios from "../axios.js";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});
let data;
const confirmPasswordSlice = createSlice({
  name: "confirmPassword",
  initialState: {
    data: [],
    status: STATUSES.IDLE,
  },
  reducers: {
    setConfirmPassword(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(confirmPassword.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(confirmPassword.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(confirmPassword.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setConfirmPassword, setStatus } = confirmPasswordSlice.actions;
export default confirmPasswordSlice.reducer;

// Thunks
export const confirmPassword = createAsyncThunk(
  "confirmPassword/verify",
  async (data) => {
    try {
      const response = await axios.put("auth/set-password", data.data);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  }
);
