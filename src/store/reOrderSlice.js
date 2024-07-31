import axios from "../axios.js";
import { handleUnauth } from "../components/Utils/handleUnauth.js";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});
let data;
const reOrderSlice = createSlice({
  name: "reOrder",
  initialState: {
    data: [],
    status: STATUSES.IDLE,
  },
  reducers: {
    setReOrder(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(reOrder.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(reOrder.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(reOrder.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setReOrder, setStatus } = reOrderSlice.actions;
export default reOrderSlice.reducer;

// Thunks
export const reOrder = createAsyncThunk("reOrder/verify", async (data) => {
  try {
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + data.token,
      },
    };
    const response = await axios.patch(
      "project/change-project-order",
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
