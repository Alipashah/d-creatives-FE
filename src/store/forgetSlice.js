import axios from "../axios.js";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});
let data;
const forgetPasswordSlice = createSlice({
  name: "forgetPassword",
  initialState: {
    data: [],
    status: STATUSES.IDLE,
  },
  reducers: {
    setForgetPassword(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(forgetPassword.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(forgetPassword.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(forgetPassword.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setForgetPassword, setStatus } = forgetPasswordSlice.actions;
export default forgetPasswordSlice.reducer;

// Thunks
export const forgetPassword = createAsyncThunk(
  "forgetPassword/verify",
  async (data) => {
    try {
      const response = await axios.post("auth/send-link", data.data);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  }
);
