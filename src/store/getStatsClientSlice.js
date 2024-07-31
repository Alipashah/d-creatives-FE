import axios from "../axios.js";
import { handleUnauth } from "../components/Utils/handleUnauth.js";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});
let data;
const getStatsClientSlice = createSlice({
  name: "getStatsClient",
  initialState: {
    data: [],
    status: STATUSES.IDLE,
  },
  reducers: {
    setGetStatsClient(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStatsClient.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(getStatsClient.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(getStatsClient.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setGetStatsClient, setStatus } = getStatsClientSlice.actions;
export default getStatsClientSlice.reducer;

// Thunks
export const getStatsClient = createAsyncThunk(
  "getStatsClient/verify",
  async (data) => {
    try {
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + data.token,
        },
      };
      const response = await axios.get("project/status/counts", config);
      //console.log(response.data);
      return response.data;
    } catch (err) {
      if (err?.response?.data?.statusCode === 401) {
        handleUnauth();
      }
      console.log(err);
    }
  }
);
