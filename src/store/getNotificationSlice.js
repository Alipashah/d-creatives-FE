import axios from "../axios.js";
import { handleUnauth } from "../components/Utils/handleUnauth.js";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});
let data;
const getNotificationSlice = createSlice({
  name: "getNotification",
  initialState: {
    data: {},
    status: STATUSES.IDLE,
  },
  reducers: {
    setGetNotification(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotification.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(getNotification.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(getNotification.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setGetNotification, setStatus } = getNotificationSlice.actions;
export default getNotificationSlice.reducer;

// Thunks
export const getNotification = createAsyncThunk(
  "getNotification/verify",
  async (data) => {
    try {
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + data.token,
        },
      };
      const response = await axios.get("notifications/" + data.id, config);
      return response.data;
    } catch (err) {
      if (err?.response?.data?.statusCode === 401) {
        handleUnauth();
      }
      console.log(err);
    }
  }
);
