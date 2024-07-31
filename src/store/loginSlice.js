import axios from "../axios.js";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});
let data;
const loginSlice = createSlice({
  name: "login",
  initialState: {
    data: {},
    status: STATUSES.IDLE,
  },
  reducers: {
    setLogin(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setLogin, setStatus } = loginSlice.actions;
export default loginSlice.reducer;

// Thunks
export const login = createAsyncThunk("login/verify", async (data) => {
  try {
    const response = await axios.post("auth/login", data);
    return response.data;
  } catch (err) {
    console.log(err);
  }
});
