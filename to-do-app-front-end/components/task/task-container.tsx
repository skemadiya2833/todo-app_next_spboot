import { Input } from "@nextui-org/input";
import {
  Button,
  Checkbox,
  DateRangePicker,
  Pagination,
  Select,
  SelectItem,
  SharedSelection,
  Spinner,
  Tab,
  Tabs,
} from "@nextui-org/react";
import React, { FormEvent } from "react";
import { Key } from "@react-types/shared";

import { DownloadIcon, FilterIcon, SearchIcon } from "../common/icons";
import { CategoryAutoComplete } from "../category/category-autocomplete";

import TaskCard from "./task-card";
import { RenderTable } from "./task-table";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  downloadCSV,
  filterTasks,
} from "@/components/task/redux/slices/tasks-slice";
import { getParams } from "@/utils/common-utils";
import { setDateFilter, setOverduesFilter, setPageFilter, setStringFilter } from "../common/slices/filter-slice";
import { FilterKeys } from "../common/interfaces/filter-keys";

const TaskContainer = () => {
  const dispatch = useAppDispatch();
  const [hideFilters, setHideFilters] = React.useState<boolean>(true);
  const [selected, setSelected] = React.useState<Key>("cards");
  const taskState = useAppSelector((state) => state.tasks);
  const filterState = useAppSelector((state) => state.filters);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setStringFilter({field: e.target.name as FilterKeys, value: e.target.value}));
  };

  const handleOverdueChange = (_e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setOverduesFilter(!filterState.overdues));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = getParams(filterState);
    dispatch(setPageFilter(1));
    dispatch(filterTasks(params));
    return;
  };

  const setPriority = (key: SharedSelection) => {
    dispatch(setStringFilter({field: "priority", value: key.currentKey!}));
  };
  
  const setStatus = (key: SharedSelection) => {
    dispatch(setStringFilter({field: "status", value: key.currentKey!}));
  };

  const setNewPage = (pageNo: number) => {
    const params = getParams(filterState);

    dispatch(setPageFilter(pageNo));
    dispatch(filterTasks(params+"&page="+pageNo));
  };

  const handledownload = () => {
    const params = getParams(filterState)+"&size="+taskState.totalElements;

    dispatch(downloadCSV({ params, pageNo: 1 }));
  };

  const setSorting = (key: SharedSelection) => {
    dispatch(setStringFilter({field: "sort", value: key.currentKey!}));
  };
  
  const setSortingType = (key: SharedSelection) => {
    dispatch(setStringFilter({field: "sortType", value: key.currentKey!}));
  };
  
  const setCategoryId = (value: string) => {
    dispatch(setStringFilter({field: "categoryId", value}));
  };

  const RenderCards = () => {
    return (
      <>
        {taskState.loading ? (
          <div className="flex justify-center mt-[25vh]">
            <Spinner
              color="secondary"
              label="Loading Tasks"
              labelColor="secondary"
            />
          </div>
        ) : taskState.tasks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center">
            {taskState.tasks.map((task, _index) => {
              return <TaskCard key={task.id} task={task} />;
            })}
          </div>
        ) : (
          <div className="w-full flex justify-center mt-[20%]">
            <h2> No Tasks, Start Creating...</h2>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <div className="pl-3 max-w-screen-2xl m-auto">
        <form onSubmit={handleSubmit}>
          <div className="mt-2 mr-2 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div className="flex flex-col min-w-[180px]">
              <p className="font-bold mb-2 pl-2">Search</p>
              <div className="flex gap-2">
                <Input
                  fullWidth
                  aria-label="search"
                  color="secondary"
                  endContent={<SearchIcon />}
                  name="query"
                  placeholder="Search By Title or Description"
                  value={filterState.query}
                  variant="bordered"
                  onChange={handleChange}
                />
                <Button
                  isIconOnly
                  variant="bordered"
                  onClick={() => setHideFilters(!hideFilters)}
                >
                  <FilterIcon />
                </Button>
              </div>
            </div>
            {hideFilters || (
              <>
                <div className="flex flex-col">
                  <p className="font-bold mb-2 pl-2">Search Between Dates</p>
                  <div className="flex">
                    <DateRangePicker
                      hideTimeZone
                      showMonthAndYearPickers
                      aria-label="dateRange"
                      endName="end"
                      startName="start"
                      value={filterState.date}
                      variant="bordered"
                      onChange={(e)=>{
                        dispatch(setDateFilter(e));
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <p className="font-bold mb-2 pl-2">Search By Category</p>
                  <CategoryAutoComplete
                    label=""
                    selected={filterState.categoryId!}
                    setSelected={setCategoryId}
                  />
                </div>
                <div className="flex flex-col">
                  <p className="font-bold mb-2 pl-2">Search By Status</p>
                  <Select
                    aria-label="Status"
                    color="secondary"
                    id="Status"
                    name="status"
                    placeholder="Select a Status"
                    selectionMode="single"
                    variant="bordered"
                    onSelectionChange={setStatus}
                    selectedKeys={[filterState.status!]}
                  >
                    <SelectItem key="TODO">TODO</SelectItem>
                    <SelectItem key="IN_PROGRESS">IN PROGRESS</SelectItem>
                    <SelectItem key="COMPLETED">COMPLETED</SelectItem>
                  </Select>
                </div>
                <div className="flex flex-col">
                  <p className="font-bold mb-2 pl-2">Search By Priority</p>
                  <Select
                    aria-label="priority"
                    color="secondary"
                    id="priority"
                    name="priority"
                    placeholder="Select a Priority"
                    selectionMode="single"
                    variant="bordered"
                    onSelectionChange={setPriority}
                    selectedKeys={[filterState.priority!]}
                  >
                    <SelectItem key="LOW">Low Priority</SelectItem>
                    <SelectItem key="MEDIUM">Medium Priority</SelectItem>
                    <SelectItem key="HIGH">High Priority</SelectItem>
                  </Select>
                </div>
                <div className="flex flex-col">
                  <p className="font-bold mb-2 pl-2">Sort By..</p>
                  <Select
                    aria-label="sort"
                    color="secondary"
                    id="sort"
                    name="sort"
                    placeholder="Select a Sorting field"
                    selectionMode="single"
                    variant="bordered"
                    onSelectionChange={setSorting}
                    selectedKeys={[filterState.sort!]}
                  >
                    <SelectItem key="title">Title</SelectItem>
                    <SelectItem key="status">Status</SelectItem>
                    <SelectItem key="priority">Priority</SelectItem>
                    <SelectItem key="category">Category</SelectItem>
                    <SelectItem key="startDateTime">Start Date</SelectItem>
                    <SelectItem key="reminder">Reminder</SelectItem>
                    <SelectItem key="deadline">Deadline</SelectItem>
                  </Select>
                </div>
                <div className="flex">
                  <div className="flex flex-col min-w-[70%]">
                    <p className="font-bold mb-2 pl-2">Sorting Type</p>
                    <Select
                      aria-label="sortType"
                      color="secondary"
                      defaultSelectedKeys={["ASC"]}
                      id="sortType"
                      name="sortType"
                      placeholder="Select Sorting Type"
                      selectionMode="single"
                      variant="bordered"
                      onSelectionChange={setSortingType}
                    >
                      <SelectItem key="ASC">Ascending</SelectItem>
                      <SelectItem key="DESC">Descending</SelectItem>
                    </Select>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-bold mb-2 pl-2">Overdues</p>
                    <Checkbox
                      defaultSelected={filterState.overdues}
                      className="pl-[50%] pt-[20%]"
                      color="secondary"
                      size="lg"
                      onChange={handleOverdueChange}
                    />
                  </div>
                </div>
              </>
            )}
            <div className="relative flex gap-3 min-h-[50px]">
              <Button
                className="absolute bottom-0 left-0"
                color="secondary"
                type="submit"
                variant="shadow"
              >
                Search
              </Button>
              <Tabs
                aria-label="GridOrTable"
                className="absolute bottom-0 right-0"
                color="secondary"
                radius="full"
                selectedKey={selected}
                onSelectionChange={setSelected}
              >
                <Tab key="cards" title="Cards" />
                <Tab key="table" title="Table" />
              </Tabs>
              <Button
                isIconOnly
                className="absolute bottom-0 left-[100]"
                color="secondary"
                isDisabled={taskState.tasks.length < 1}
                variant="shadow"
                onClick={handledownload}
              >
                <DownloadIcon />
              </Button>
            </div>
          </div>
          <div className="py-2 flex overflow-x-auto gap-3">
            <span className="flex items-center text-sm font-medium dark:text-white">
              <span className="flex w-2.5 h-2.5 bg-green-500 rounded-full me-1.5 flex-shrink-0" />
              Completed
            </span>
            <span className="flex items-center text-sm font-medium dark:text-white">
              <span className="flex w-2.5 h-2.5 bg-yellow-500 rounded-full me-1.5 flex-shrink-0" />
              Todo
            </span>
            <span className="flex items-center text-sm font-medium dark:text-white">
              <span className="flex w-2.5 h-2.5 bg-blue-500 rounded-full me-1.5 flex-shrink-0" />
              In Progress
            </span>
            <span className="flex items-center text-sm font-medium dark:text-white">
              <span className="flex w-2.5 h-2.5 bg-red-500 rounded-full me-1.5 flex-shrink-0" />
              Overdue
            </span>
          </div>
        </form>
      </div>
      <div className="min-h-[65vh]">
        {selected === "cards" ? <RenderCards /> : <RenderTable />}
      </div>
      {taskState.loading ||
        (taskState.totalPages > 1 && (
          <div className="flex justify-center p-5">
            <Pagination
              showShadow
              color="secondary"
              initialPage={taskState.pageNumber + 1}
              size="lg"
              total={taskState.totalPages}
              variant="bordered"
              onChange={setNewPage}
            />
          </div>
        ))}
    </>
  );
};

export default TaskContainer;
