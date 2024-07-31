import axios from "../axios.js";
import { handleUnauth } from "../components/Utils/handleUnauth.js";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});
let data;
const deleteProjectSlice = createSlice({
  name: "deleteProject",
  initialState: {
    data: [],
    status: STATUSES.IDLE,
  },
  reducers: {
    setDeleteProject(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteProject.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setDeleteProject, setStatus } = deleteProjectSlice.actions;
export default deleteProjectSlice.reducer;

// Thunks
export const deleteProject = createAsyncThunk(
  "deleteProject/verify",
  async (data) => {
    try {
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + data.token,
        },
      };

      const response = await axios.put("project/delete", data.data, config);
      return response.data;
    } catch (err) {
      if (err?.response?.data?.statusCode === 401) {
        handleUnauth();
      }
      console.log(err);
    }
  }
);
