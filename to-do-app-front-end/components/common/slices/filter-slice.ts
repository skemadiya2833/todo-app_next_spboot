import { getLocalTimeZone, today } from "@internationalized/date";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FilterState } from "../interfaces/filter-state";

const initialState: FilterState = {
  query: "",
  priority: null,
  sort: null,
  sortType: "ASC",
  categoryId: null,
  status: null,
  overdues: false,
  page: 1,
  date: {
    start: today(getLocalTimeZone()).subtract({weeks: 1}),
    end: today(getLocalTimeZone()).add({ weeks: 2 })
  }
};

const filterSlice = createSlice({
  name: "filterSlice",
  initialState,
  reducers: {
    setDateFilter(state: FilterState, action: PayloadAction<{start: any, end: any}>){
      state.date = action.payload;
    },
    setPageFilter(state: FilterState, action: PayloadAction<number>){
      state.page = action.payload;
    },
    setOverduesFilter(state: FilterState, action: PayloadAction<boolean>){
      state.overdues = action.payload;
    },
    setStringFilter(state: FilterState, action: PayloadAction<{field: "sort" | "sortType" | "status" | "priority" | "categoryId" | "query", value: string}>){
      state[action.payload.field] = action.payload.value ;
    },
    clearFilters(state: FilterState){
      state.query= "";
      state.priority= null;
      state.sort= null;
      state.sortType= "ASC";
      state.categoryId= null;
      state.status= null;
      state.overdues= false;
      state.page= 1;
      state.date= {
        start: today(getLocalTimeZone()).subtract({weeks: 1}),
        end: today(getLocalTimeZone()).add({ weeks: 2 })
      }
    }
  },
});

export const { setStringFilter, setOverduesFilter, setPageFilter, setDateFilter  } =
  filterSlice.actions;
export default filterSlice.reducer;
