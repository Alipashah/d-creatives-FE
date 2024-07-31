import axios from "../axios.js";
import { handleUnauth } from "../components/Utils/handleUnauth.js";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});
let data;
const addCompanySlice = createSlice({
  name: "addCompany",
  initialState: {
    data: [],
    status: STATUSES.IDLE,
  },
  reducers: {
    setAddCompany(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCompany.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(addCompany.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(addCompany.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setAddCompany, setStatus } = addCompanySlice.actions;
export default addCompanySlice.reducer;

// Thunks
export const addCompany = createAsyncThunk(
  "addCompany/verify",
  async (data) => {
    try {
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + data.token,
        },
      };

      const response = await axios.post("company", data.data, config);
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
