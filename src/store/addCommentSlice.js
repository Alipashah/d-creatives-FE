import axios from "../axios.js";
import { handleUnauth } from "../components/Utils/handleUnauth.js";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});
let data;
const addCommentSlice = createSlice({
  name: "addComment",
  initialState: {
    data: [],
    status: STATUSES.IDLE,
  },
  reducers: {
    setAddComment(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addComment.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(addComment.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setAddComment, setStatus } = addCommentSlice.actions;
export default addCommentSlice.reducer;

// Thunks
export const addComment = createAsyncThunk(
  "addComment/verify",
  async (data) => {
    try {
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + data.token,
        },
      };
      const response = await axios.post("comment", data.data, config);
      return response.data;
    } catch (err) {
      if (err?.response?.data?.statusCode === 401) {
        handleUnauth();
      }
      console.log(err);
    }
  }
);
