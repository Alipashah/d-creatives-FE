import axios from "../axios.js";
import { handleUnauth } from "../components/Utils/handleUnauth.js";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});
let data;
const updatePasswordSlice = createSlice({
  name: "updatePassword",
  initialState: {
    data: [],
    status: STATUSES.IDLE,
  },
  reducers: {
    setUpdatePassword(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updatePassword.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setUpdatePassword, setStatus } = updatePasswordSlice.actions;
export default updatePasswordSlice.reducer;

// Thunks
export const updatePassword = createAsyncThunk(
  "updatePassword/verify",
  async (data) => {
    try {
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + data.token,
        },
      };
      const response = await axios.put(
        "auth/change-password",
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