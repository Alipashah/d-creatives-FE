import axios from "../axios.js";
import { handleUnauth } from "../components/Utils/handleUnauth.js";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});
let data;
const changeEditorSlice = createSlice({
  name: "changeEditor",
  initialState: {
    data: [],
    status: STATUSES.IDLE,
  },
  reducers: {
    setChangeEditor(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changeEditor.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(changeEditor.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(changeEditor.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setChangeEditor, setStatus } = changeEditorSlice.actions;
export default changeEditorSlice.reducer;

// Thunks
export const changeEditor = createAsyncThunk(
  "changeEditor/verify",
  async (data) => {
    try {
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + data.token,
        },
      };
      const response = await axios.patch(
        "editor/changeEditor",
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
