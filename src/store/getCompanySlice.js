import axios from "../axios.js";
import { handleUnauth } from "../components/Utils/handleUnauth.js";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});
let data;
const getCompanySlice = createSlice({
  name: "getCompany",
  initialState: {
    data: [],
    status: STATUSES.IDLE,
  },
  reducers: {
    setGetCompany(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCompany.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(getCompany.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(getCompany.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setGetCompany, setStatus } = getCompanySlice.actions;
export default getCompanySlice.reducer;

// Thunks
export const getCompany = createAsyncThunk(
  "getCompany/verify",
  async (data) => {
    try {
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + data.token,
        },
      };

      const response = await axios.get("company", config);
      //console.log(response.data);
      return response.data;
    } catch (err) {
      if (err?.response?.data?.statusCode === 401) {
        handleUnauth();
      }
      console.log(err);
    }
  }
);
