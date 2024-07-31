import axios from "../axios.js";
import { handleUnauth } from "../components/Utils/handleUnauth";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});
let data;
const editProjectSlice = createSlice({
  name: "editProject",
  initialState: {
    data: [],
    status: STATUSES.IDLE,
  },
  reducers: {
    setEditProject(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(editProject.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(editProject.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(editProject.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setEditProject, setStatus } = editProjectSlice.actions;
export default editProjectSlice.reducer;

// Thunks
export const editProject = createAsyncThunk(
  "editProject/verify",
  async (data) => {
    try {
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + data.token,
        },
      };
      const response = await axios.put("project/" + data.id, data.data, config);
      return response.data;
    } catch (err) {
      if (err?.response?.data?.statusCode === 401) {
        handleUnauth();
      }
      console.log(err);
    }
  }
);
