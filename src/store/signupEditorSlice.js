import axios from "../axios.js";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});
let data;
const signupEditorSlice = createSlice({
  name: "signupEditor",
  initialState: {
    data: {},
    status: STATUSES.IDLE,
  },
  reducers: {
    setSignupEditor(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupEditor.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(signupEditor.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(signupEditor.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setSignupEditor, setStatus } = signupEditorSlice.actions;
export default signupEditorSlice.reducer;

// Thunks
export const signupEditor = createAsyncThunk(
  "signupEditor/verify",
  async (data) => {
    try {
      const response = await axios.put("user/setPassword", data);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  }
);
