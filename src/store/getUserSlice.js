import axios from "../axios.js";
import { handleUnauth } from "../components/Utils/handleUnauth.js";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});
let data;
const getUserSlice = createSlice({
  name: "getUser",
  initialState: {
    data: [],
    status: STATUSES.IDLE,
  },
  reducers: {
    setGetUser(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setGetUser, setStatus } = getUserSlice.actions;
export default getUserSlice.reducer;

// Thunks
export const getUser = createAsyncThunk("getUser/verify", async (data) => {
  try {
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + data.token,
      },
    };
    const response = await axios.get("user/" + data.id, config);
    //console.log(response.data);
    return response.data;
  } catch (err) {
    if (err?.response?.data?.statusCode === 401) {
      handleUnauth();
    }
    console.log(err);
  }
});
