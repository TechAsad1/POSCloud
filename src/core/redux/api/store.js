import { configureStore } from "@reduxjs/toolkit";
import cat from "./category";

export const store = configureStore({
    reducer: {
        app: cat,
    },
});
export default store;