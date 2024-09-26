import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  SharedSelection,
  DatePicker,
  Textarea,
} from "@nextui-org/react";
import {
  getLocalTimeZone,
  now,
  parseZonedDateTime,
  ZonedDateTime,
} from "@internationalized/date";

import { CategoryAutoComplete } from "../category/category-autocomplete";
import { CameraIcon } from "../common/icons";

import { CreateTask } from "@/components/task/interfaces/create-task";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addTask, editTask } from "@/components/task/redux/slices/tasks-slice";
import { Task } from "@/components/task/interfaces/task";
import { validateFormDates } from "@/utils/validation-utils";
import { getParams } from "@/utils/common-utils";

export const TaskForm = ({
  task,
  isOpen,
  onOpenChange,
}: {
  task?: Task;
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const dispatch = useAppDispatch();
  const [deadlineValidationError, setDeadlineValidationError] = useState<string | null>();
  const [reminderValidationError, setReminderValidationError] = useState<string | null>();
  const filterState = useAppSelector((state)=>state.filters);
  const [formData, setFormData] = useState<CreateTask>({
    title: "",
    description: "",
    categoryId: null,
    priority: "LOW",
    status: "TODO",
    startDateTime: now(getLocalTimeZone()).toDate(),
    deadline: now(getLocalTimeZone()).add({ days: 1 }).toDate(),
    reminder: now(getLocalTimeZone()).add({ days: 1 }).subtract({hours: 2}).toDate(),
    thumbnail: null,
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task?.title ?? "",
        description: task?.description ?? "",
        categoryId: task?.category?.id ?? null,
        priority: task?.priority ?? "LOW",
        status: task?.status ?? "TODO",
        startDateTime: task?.startDateTime
          ? new Date(task.startDateTime)
          : now(getLocalTimeZone())?.toDate(),
        deadline: task?.deadline
          ? new Date(task.deadline)
          : now(getLocalTimeZone())?.add({ days: 1 })?.toDate(),
        thumbnail: task?.thumbnail ?? null,
        reminder: task?.reminder
          ? new Date(task.reminder)
          : now(getLocalTimeZone())?.add({ days: 1 })?.subtract({hours: 2})?.toDate(),
      });
    }
  }, [task]);

  const updateBase64 = (file: File) => {
    const reader = new FileReader();

    reader.onload = () => {
      setFormData((prevState) => ({
        ...prevState,
        thumbnail: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      updateBase64(file);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectionChange =
    (name: keyof CreateTask) => (key: SharedSelection) => {
      setFormData((prevState) => ({
        ...prevState,
        [name]: key.currentKey ?? "",
      }));
    };

  const handleDateChange =
    (name: keyof CreateTask) => (dateTime: ZonedDateTime) => {
      setFormData((prevState) => ({
        ...prevState,
        [name]: dateTime?.toDate() ?? null,
      }));
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const {reminderError, deadlineError } = validateFormDates({startDateTime: formData.startDateTime, deadline: formData.deadline, reminder: formData.reminder!});
    if(reminderError === null && deadlineError === null){
      task
        ? dispatch(editTask({ id: task.id, formData }))
        : dispatch(addTask({ createTask: formData, params: getParams(filterState)}));
      onOpenChange();
      return ;
    } 
    setReminderValidationError(reminderError);
    setDeadlineValidationError(deadlineError);
  };

  return (
    <Modal
      className="sm:m-auto"
      isOpen={isOpen}
      placement="center"
      scrollBehavior="outside"
      size="4xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit}>
            <ModalHeader className="flex flex-col gap-1">
              {task ? "Edit Task" : "Create Task"}
            </ModalHeader>
            <ModalBody className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
              <div>
                <Input
                  fullWidth
                  isRequired
                  required
                  color="secondary"
                  label="Title"
                  name="title"
                  placeholder="Enter Title for the task"
                  value={formData.title}
                  variant="bordered"
                  onChange={handleChange}
                />
                <Input
                  accept="image/png, image/jpeg"
                  className="pt-3"
                  color="secondary"
                  endContent={<CameraIcon />}
                  label="Task Thumbnail"
                  name="thumbnail"
                  size="sm"
                  type="file"
                  variant="bordered"
                  onChange={handleFileInputChange}
                />
              </div>
              <Textarea
                color="secondary"
                label="Description"
                minRows={4}
                name="description"
                placeholder="Enter Description for the task"
                value={formData.description}
                variant="bordered"
                onChange={handleChange}
              />
              <CategoryAutoComplete
                label="Select a Category"
                selected={formData.categoryId?.toString() ?? ""}
                setSelected={(key: string) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    categoryId: +key,
                  }))
                }
              />
              <Select
                aria-label="Priority"
                color="secondary"
                label="Select Priority"
                selectedKeys={[formData.priority]}
                selectionMode="single"
                variant="bordered"
                onSelectionChange={handleSelectionChange("priority")}
              >
                <SelectItem key="LOW">Low Priority</SelectItem>
                <SelectItem key="MEDIUM">Medium Priority</SelectItem>
                <SelectItem key="HIGH">High Priority</SelectItem>
              </Select>
              <Select
                aria-label="Status"
                color="secondary"
                label="Select Status"
                selectedKeys={[formData.status]}
                selectionMode="single"
                variant="bordered"
                onSelectionChange={handleSelectionChange("status")}
              >
                <SelectItem key="TODO">TODO</SelectItem>
                <SelectItem key="IN_PROGRESS">IN PROGRESS</SelectItem>
                <SelectItem key="COMPLETED">COMPLETED</SelectItem>
              </Select>
              <DatePicker
                hideTimeZone
                showMonthAndYearPickers
                color="secondary"
                defaultValue={
                  task
                    ? (parseZonedDateTime(
                        task.startDateTime + "[Asia/Kolkata]",
                      ) ?? now(getLocalTimeZone()))
                    : now(getLocalTimeZone())
                }
                label="Start Time for Task"
                name="startDateTime"
                variant="bordered"
                onChange={handleDateChange("startDateTime")}
              />
              <DatePicker
                hideTimeZone
                showMonthAndYearPickers
                color="secondary"
                defaultValue={
                  task ? parseZonedDateTime(task.deadline + "[Asia/Kolkata]") :
                      now(getLocalTimeZone()).add({ days: 1 })
                }
                label="Deadline for Task"
                name="deadline"
                variant="bordered"
                onChange={handleDateChange("deadline")}
                isInvalid={deadlineValidationError != null}
                errorMessage={deadlineValidationError}
              />
              <DatePicker
                hideTimeZone
                showMonthAndYearPickers
                color="secondary"
                defaultValue={
                  task ? parseZonedDateTime(task?.reminder + "[Asia/Kolkata]") :
                      now(getLocalTimeZone()).add({ days: 1 }).subtract({hours: 2})
                }
                label="Reminder"
                name="reminder"
                variant="bordered"
                onChange={handleDateChange("reminder")}
                isInvalid={reminderValidationError != null}
                errorMessage={reminderValidationError}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="secondary" type="submit" variant="ghost">
                {task ? "Update" : "Create"}
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};
