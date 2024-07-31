import axios from "../axios.js";
import { handleUnauth } from "../components/Utils/handleUnauth.js";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});
let data;
const getStatsEditorSlice = createSlice({
  name: "getStatsEditor",
  initialState: {
    data: [],
    status: STATUSES.IDLE,
  },
  reducers: {
    setGetStatsEditor(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStatsEditor.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(getStatsEditor.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(getStatsEditor.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setGetStatsEditor, setStatus } = getStatsEditorSlice.actions;
export default getStatsEditorSlice.reducer;

// Thunks
export const getStatsEditor = createAsyncThunk(
  "getStatsEditor/verify",
  async (data) => {
    try {
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + data.token,
        },
      };
      const response = await axios.get("project/status/count", config);
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
