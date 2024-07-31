import axios from "../axios.js";
import { handleUnauth } from "../components/Utils/handleUnauth.js";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});
let data;
const deleteCompanySlice = createSlice({
  name: "deleteCompany",
  initialState: {
    data: [],
    status: STATUSES.IDLE,
  },
  reducers: {
    setDeleteCompany(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteCompany.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setDeleteCompany, setStatus } = deleteCompanySlice.actions;
export default deleteCompanySlice.reducer;

// Thunks
export const deleteCompany = createAsyncThunk(
  "deleteCompany/verify",
  async (data) => {
    try {
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + data.token,
        },
      };

      const response = await axios.delete("company/" + data.id, config);
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
