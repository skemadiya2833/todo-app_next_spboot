import { combineReducers } from "@reduxjs/toolkit";

import userReducer from "../components/user/redux/slices/user-slice";
import tasksReducer from "../components/task/redux/slices/tasks-slice";
import reminderReducer from "../components/reminder/redux/slices/reminder-slice";
import categoryReducer from "../components/category/redux/slices/category-slice";
import informationReducer from "../components/common/slices/information-slice";
import filtersReducer from "../components/common/slices/filter-slice";

const rootReducer = combineReducers({
  user: userReducer,
  tasks: tasksReducer,
  reminders: reminderReducer,
  categories: categoryReducer,
  informations: informationReducer,
  filters: filtersReducer,
});

export default rootReducer;
