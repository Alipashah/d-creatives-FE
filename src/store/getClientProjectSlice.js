import axios from "../axios.js";
import { handleUnauth } from "../components/Utils/handleUnauth.js";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});
let data;
const getClientProjectSlice = createSlice({
  name: "getClientProject",
  initialState: {
    data: [],
    status: STATUSES.IDLE,
  },
  reducers: {
    setgetClientProject(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getClientProject.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(getClientProject.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(getClientProject.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setgetClientProject, setStatus } = getClientProjectSlice.actions;
export default getClientProjectSlice.reducer;

// Thunks
export const getClientProject = createAsyncThunk(
  "getClientProject/verify",
  async (data) => {
    try {
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + data.token,
        },
      };
      const response = await axios.get("getClientProject/" + data.id, config);
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
