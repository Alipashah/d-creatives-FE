import axios from "../axios.js";
import { handleUnauth } from "../components/Utils/handleUnauth.js";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});
let data;
const getAdminEditorSlice = createSlice({
  name: "getAdminEditor",
  initialState: {
    data: [],
    status: STATUSES.IDLE,
  },
  reducers: {
    setGetAdminEditor(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAdminEditor.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(getAdminEditor.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(getAdminEditor.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setGetAdminEditor, setStatus } = getAdminEditorSlice.actions;
export default getAdminEditorSlice.reducer;

// Thunks
export const getAdminEditor = createAsyncThunk(
  "getAdminEditor/verify",
  async (data) => {
    try {
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + data.token,
        },
      };
      const response = await axios.get("getAdminEditors", config);
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
