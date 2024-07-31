import axios from "../axios.js";
import { handleUnauth } from "../components/Utils/handleUnauth.js";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});
let data;
const deleteUserSlice = createSlice({
  name: "deleteUser",
  initialState: {
    data: [],
    status: STATUSES.IDLE,
  },
  reducers: {
    setDeleteUser(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteUser.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setDeleteUser, setStatus } = deleteUserSlice.actions;
export default deleteUserSlice.reducer;

// Thunks
export const deleteUser = createAsyncThunk(
  "deleteUser/verify",
  async (data) => {
    try {
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + data.token,
        },
      };

      const response = await axios.delete("user/" + data.id, config);
      return response.data;
    } catch (err) {
      if (err?.response?.data?.statusCode === 401) {
        handleUnauth();
      }
      console.log(err);
    }
  }
);
