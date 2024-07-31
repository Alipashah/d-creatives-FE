import axios from "../axios.js";
import { handleUnauth } from "../components/Utils/handleUnauth.js";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});
let data;
const NotificationSlice = createSlice({
  name: "Notification",
  initialState: {
    data: {},
    status: STATUSES.IDLE,
  },
  reducers: {
    setNotification(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(Notification.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(Notification.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(Notification.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setNotification, setStatus } = NotificationSlice.actions;
export default NotificationSlice.reducer;

// Thunks
export const Notification = createAsyncThunk(
  "Notification/verify",
  async (data) => {
    try {
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + data.token,
        },
      };
      const response = await axios.post("notifications", data.data, config);
      return response.data;
    } catch (err) {
      if (err?.response?.data?.statusCode === 401) {
        handleUnauth();
      }
      console.log(err);
    }
  }
);
