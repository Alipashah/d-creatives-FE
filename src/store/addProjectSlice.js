import axios from "../axios.js";
import { handleUnauth } from "../components/Utils/handleUnauth.js";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});
let data;
const addProjectSlice = createSlice({
  name: "addProject",
  initialState: {
    data: [],
    status: STATUSES.IDLE,
  },
  reducers: {
    setAddProject(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addProject.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(addProject.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setAddProject, setStatus } = addProjectSlice.actions;
export default addProjectSlice.reducer;

// Thunks
export const addProject = createAsyncThunk(
  "addProject/verify",
  async (data) => {
    try {
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + data.token,
        },
      };
      const response = await axios.post("project", data.data, config);
      return response.data;
    } catch (err) {
      if (err?.response?.data?.statusCode === 401) {
        handleUnauth();
      }
      console.log(err);
    }
  }
);
