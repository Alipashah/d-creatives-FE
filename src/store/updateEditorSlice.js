import axios from "../axios.js";
import { handleUnauth } from "../components/Utils/handleUnauth.js";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});
let data;
const updateEditorSlice = createSlice({
  name: "updateEditor",
  initialState: {
    data: {},
    status: STATUSES.IDLE,
  },
  reducers: {
    setUpdateEditor(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateEditor.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(updateEditor.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(updateEditor.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setUpdateEditor, setStatus } = updateEditorSlice.actions;
export default updateEditorSlice.reducer;

// Thunks
export const updateEditor = createAsyncThunk(
  "updateEditor/verify",
  async (data) => {
    try {
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + data.token,
        },
      };
      const response = await axios.patch(
        "project/update-editor",
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
