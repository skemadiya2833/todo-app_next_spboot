import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Category } from "../../interfaces/category";

interface CategoriesState {
  categories: Category[];
}

const initialState: CategoriesState = {
  categories: [],
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    fetchCategories(_state: CategoriesState, _action: PayloadAction<string>) {},
    setCategories(state: CategoriesState, action: PayloadAction<Category[]>) {
      state.categories = action.payload;
    },
  },
});

export const { fetchCategories, setCategories } = categorySlice.actions;
export default categorySlice.reducer;
