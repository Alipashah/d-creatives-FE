import axios from "../axios.js";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});
let data;
const getProjectBySearchSlice = createSlice({
  name: "getProjectBySearch",
  initialState: {
    data: [],
    status: STATUSES.IDLE,
  },
  reducers: {
    setGetProjectBySearch(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProjectBySearch.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(getProjectBySearch.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(getProjectBySearch.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setGetProjectBySearch, setStatus } =
  getProjectBySearchSlice.actions;
export default getProjectBySearchSlice.reducer;

// Thunks
export const getProjectBySearch = createAsyncThunk(
  "getProjectBySearch/verify",
  async (data) => {
    try {
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + data.token,
        },
      };
      const response = await axios.get("searchProjectByName", config);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  }
);
