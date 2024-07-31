import axios from "../axios.js";
import { handleUnauth } from "../components/Utils/handleUnauth.js";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});
let data;
const hideProjectSlice = createSlice({
  name: "hideProject",
  initialState: {
    data: [],
    status: STATUSES.IDLE,
  },
  reducers: {
    setHideProject(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hideProject.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(hideProject.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(hideProject.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setHideProject, setStatus } = hideProjectSlice.actions;
export default hideProjectSlice.reducer;

// Thunks
export const hideProject = createAsyncThunk(
  "hideProject/verify",
  async (data) => {
    try {
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + data.token,
        },
      };

      const response = await axios.patch(
        "project/changeStatus",
        data.data,
        config
      );
      return response.data;
    } catch (err) {
      if (err?.response?.data?.statusCode === 401) {
        handleUnauth();
      }
      console.log(err);
    }
  }
);
