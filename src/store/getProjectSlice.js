import axios from "../axios.js";
import { handleUnauth } from "../components/Utils/handleUnauth.js";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});
let data;
const getProjectSlice = createSlice({
  name: "getProject",
  initialState: {
    data: [],
    status: STATUSES.IDLE,
  },
  reducers: {
    setGetProject(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProject.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(getProject.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(getProject.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setGetProject, setStatus } = getProjectSlice.actions;
export default getProjectSlice.reducer;

// Thunks
export const getProject = createAsyncThunk(
  "getProject/verify",
  async (data) => {
    try {
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + data.token,
        },
        params: { status: data.status, sortBy: data.sortBy, name: data.name },
      };
      const response = await axios.get("project", config);
      return response.data;
    } catch (err) {
      if (err?.response?.data?.statusCode === 401) {
        handleUnauth();
      }
      console.log(err);
    }
  }
);
