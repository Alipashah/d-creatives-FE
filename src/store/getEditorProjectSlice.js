import axios from "../axios.js";
import { handleUnauth } from "../components/Utils/handleUnauth.js";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});
let data;
const getEditorProjectSlice = createSlice({
  name: "getEditorProject",
  initialState: {
    data: [],
    status: STATUSES.IDLE,
  },
  reducers: {
    setgetEditorProject(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEditorProject.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(getEditorProject.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(getEditorProject.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setgetEditorProject, setStatus } = getEditorProjectSlice.actions;
export default getEditorProjectSlice.reducer;

// Thunks
export const getEditorProject = createAsyncThunk(
  "getEditorProject/verify",
  async (data) => {
    try {
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + data.token,
        },
      };
      const response = await axios.get(
        "editor/getEditorProject/" + data.id,
        config
      );
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
