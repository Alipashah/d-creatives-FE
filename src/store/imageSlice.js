import axios from "../axios.js";
const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const STATUSES = Object.freeze({
  IDLE: "idle",
  ERROR: "error",
  LOADING: "loading",
});
let data;
const ImageSlice = createSlice({
  name: "Image",
  initialState: {
    data: [],
    status: STATUSES.IDLE,
  },
  reducers: {
    setImage(state, action) {
      state.data = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(Image.pending, (state, action) => {
        state.status = STATUSES.LOADING;
      })
      .addCase(Image.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUSES.IDLE;
      })
      .addCase(Image.rejected, (state, action) => {
        state.status = STATUSES.ERROR;
      });
  },
});

export const { setImage, setStatus } = ImageSlice.actions;
export default ImageSlice.reducer;

// Thunks
export const Image = createAsyncThunk("Image/verify", async (data) => {
  try {
    console.log(data);
    const response = await axios.post("upload/image", data);
    return response.data;
  } catch (err) {
    console.log(err);
  }
});
