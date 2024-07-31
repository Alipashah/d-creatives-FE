import axios from "../axios.js";
import { handleUnauth } from "../components/Utils/handleUnauth.js";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});
let data;
const getClientSlice = createSlice({
  name: "getClient",
  initialState: {
    data: [],
    status: STATUSES.IDLE,
  },
  reducers: {
    setGetClient(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getClient.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(getClient.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(getClient.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setGetClient, setStatus } = getClientSlice.actions;
export default getClientSlice.reducer;

// Thunks
export const getClient = createAsyncThunk("getClient/verify", async (data) => {
  try {
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + data.token,
      },
    };

    const response = await axios.get("client", config);
    //console.log(response.data);
    return response.data;
  } catch (err) {
    if (err?.response?.data?.statusCode === 401) {
      handleUnauth();
    }
    console.log(err);
  }
});
