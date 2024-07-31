import axios from "../axios.js";
import { handleUnauth } from "../components/Utils/handleUnauth.js";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});

const dragDropSlice = createSlice({
  name: "dragDrop",
  initialState: {
    data: [],
    status: STATUSES.IDLE,
  },
  reducers: {
    setDragDrop(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(dragDrop.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(dragDrop.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(dragDrop.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setDragDrop, setStatus } = dragDropSlice.actions;
export default dragDropSlice.reducer;

// Thunks
export const dragDrop = createAsyncThunk("dragDrop/verify", async (data) => {
  try {
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + data.token,
      },
    };
    const response = await axios.patch(
      "project/drag-drop/status",
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
});
