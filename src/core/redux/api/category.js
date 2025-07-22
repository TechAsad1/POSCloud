import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';

// export const getCategory = createAsyncThunk("getCategory", async (rejectWithValue) => {
//     try {
//         const res = await axios.get("https://localhost:7151/api/Category");
//         return res;
//     }
//     catch (error) {
//         return rejectWithValue(error)
//     }
// });
// const category = createSlice({
//     name: "category",
//     initialState: {
//         posts: [],
//         loading: false,
//         error: null,
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(getCategory.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(getCategory.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.posts = action.payload;
//             })
//             .addCase(getCategory.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.error.message;
//             })
//     },
// });
export default category.reducer;