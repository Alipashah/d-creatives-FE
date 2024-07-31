import axios from "../axios.js";
import { handleUnauth } from "../components/Utils/handleUnauth.js";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});
let data;
const addEditorSlice = createSlice({
  name: "addEditor",
  initialState: {
    data: [],
    status: STATUSES.IDLE,
  },
  reducers: {
    setAddEditor(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addEditor.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(addEditor.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(addEditor.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setAddEditor, setStatus } = addEditorSlice.actions;
export default addEditorSlice.reducer;

// Thunks
export const addEditor = createAsyncThunk("addEditor/verify", async (data) => {
  try {
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + data.token,
      },
      params: { isClient: data.client },
    };

    const response = await axios.post("addUser", data.data, config);
    return response.data;
  } catch (err) {
    if (err?.response?.data?.statusCode === 401) {
      handleUnauth();
    }
    console.log(err);
  }
});
