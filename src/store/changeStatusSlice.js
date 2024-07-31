import axios from "../axios.js";
import { handleUnauth } from "../components/Utils/handleUnauth.js";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});
let data;
const changeStatusSlice = createSlice({
  name: "changeStatus",
  initialState: {
    data: [],
    status: STATUSES.IDLE,
  },
  reducers: {
    setChangeStatus(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changeStatus.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(changeStatus.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(changeStatus.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setChangeStatus, setStatus } = changeStatusSlice.actions;
export default changeStatusSlice.reducer;

// Thunks
export const changeStatus = createAsyncThunk(
  "changeStatus/verify",
  async (data) => {
    try {
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + data.token,
        },
      };
      const response = await axios.patch("project/status", data.data, config);
      return response.data;
    } catch (err) {
      if (err?.response?.data?.statusCode === 401) {
        handleUnauth();
      }
      console.log(err);
    }
  }
);
