import axios from "../axios.js";
import { handleUnauth } from "../components/Utils/handleUnauth.js";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});
let data;
const getEditorSlice = createSlice({
  name: "getEditor",
  initialState: {
    data: [],
    status: STATUSES.IDLE,
  },
  reducers: {
    setGetEditor(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEditor.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(getEditor.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(getEditor.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setGetEditor, setStatus } = getEditorSlice.actions;
export default getEditorSlice.reducer;

// Thunks
export const getEditor = createAsyncThunk("getEditor/verify", async (data) => {
  try {
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + data.token,
      },
    };
    const response = await axios.get("getAdminEditor", config);
    //console.log(response.data);
    return response.data;
  } catch (err) {
    if (err?.response?.data?.statusCode === 401) {
      handleUnauth();
    }
    console.log(err);
  }
});
