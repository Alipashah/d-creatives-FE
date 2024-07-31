import axios from "../axios.js";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});
let data;
const signupSlice = createSlice({
  name: "signup",
  initialState: {
    data: {},
    status: STATUSES.IDLE,
  },
  reducers: {
    setSignup(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setSignup, setStatus } = signupSlice.actions;
export default signupSlice.reducer;

// Thunks
export const signup = createAsyncThunk("signup/verify", async (data) => {
  try {
    const response = await axios.post("user", data);
    return response.data;
  } catch (err) {
    console.log(err);
  }
});
