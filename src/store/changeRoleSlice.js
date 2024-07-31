import axios from "../axios.js";
import { handleUnauth } from "../components/Utils/handleUnauth.js";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});
let data;
const changeRoleSlice = createSlice({
  name: "changeRole",
  initialState: {
    data: [],
    status: STATUSES.IDLE,
  },
  reducers: {
    setChangeRole(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changeRole.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(changeRole.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(changeRole.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setChangeRole, setStatus } = changeRoleSlice.actions;
export default changeRoleSlice.reducer;

// Thunks
export const changeRole = createAsyncThunk(
  "changeRole/verify",
  async (data) => {
    try {
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + data.token,
        },
      };
      const response = await axios.put(
        "user/role-change/" + data.id,
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
