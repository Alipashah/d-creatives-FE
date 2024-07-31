import axios from "../axios.js";
import { handleUnauth } from "../components/Utils/handleUnauth.js";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});
let data;
const blockUserSlice = createSlice({
  name: "blockUser",
  initialState: {
    data: [],
    status: STATUSES.IDLE,
  },
  reducers: {
    setBlockUser(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(blockUser.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(blockUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(blockUser.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setBlockUser, setStatus } = blockUserSlice.actions;
export default blockUserSlice.reducer;

// Thunks
export const blockUser = createAsyncThunk("blockUser/verify", async (data) => {
  try {
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + data.token,
      },
    };

    const response = await axios.post(
      "blockUser/" + data.id,
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
