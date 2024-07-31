import axios from "../axios.js";
import { handleUnauth } from "../components/Utils/handleUnauth.js";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});
let data;
const editUserSlice = createSlice({
  name: "editUser",
  initialState: {
    data: {},
    status: STATUSES.IDLE,
  },
  reducers: {
    setEditUser(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(editUser.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(editUser.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setEditUser, setStatus } = editUserSlice.actions;
export default editUserSlice.reducer;

// Thunks
export const editUser = createAsyncThunk("editUser/verify", async (data) => {
  try {
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + data.token,
      },
    };
    const response = await axios.patch(
      "updateUser/" + data.id,
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
