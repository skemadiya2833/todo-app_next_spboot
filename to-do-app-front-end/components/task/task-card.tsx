import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Select,
  SelectItem,
  SharedSelection,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import moment from "moment";
import { useState } from "react";

import {
  CalendarCrossIcon,
  CalendarIcon,
  DeleteIcon,
  EditIcon,
  RemindersIcon,
} from "../common/icons";

import { TaskForm } from "./task-form";
import { DeletConfirmationWindow } from "./delete-confirmation";

import { Task } from "@/components/task/interfaces/task";
import { useAppDispatch } from "@/redux/hooks";
import { editTask } from "@/components/task/redux/slices/tasks-slice";

const TaskCard = ({ task }: { task: Task }) => {
  const { isOpen, onOpenChange } = useDisclosure();
  const [deleteConfimation, setDeletConfirmation] = useState(false);
  const dispatch = useAppDispatch();

  const handleStatusChange = (key: SharedSelection) => {
    setTimeout(() => {
      dispatch(
        editTask({
          id: task.id,
          formData: {
            title: task.title,
            description: task.description,
            categoryId: task.category?.id ?? null,
            priority: task.priority,
            status: key.currentKey!,
            startDateTime: new Date(task.startDateTime!),
            deadline: new Date(task.deadline!),
            thumbnail: task.thumbnail,
            reminder: new Date(task.reminder!),
          },
        }),
      );
    }, 500);
  };

  const bgColor =
    task?.status === "COMPLETED"
      ? "#22c55e"
      : new Date(task?.deadline) < new Date()
        ? "#ef4444"
        : task?.status === "IN_PROGRESS"
          ? "#3b82f6"
          : "#eab308";

  return (
    <Card
      className="w-[95%] h-[95%] max-w-[380px]"
      style={{ border: "2px solid " + bgColor, boxShadow: "1px " + bgColor }}
    >
      <CardHeader className="flex gap-3">
        <Avatar
          showFallback
          alt="nextui logo"
          color="secondary"
          name={task.title.charAt(0).toUpperCase()}
          radius="sm"
          size="lg"
          src={task?.thumbnail ?? ""}
        />
        <div className="flex flex-col">
          <p className="text-md font-medium">{task?.title}</p>
          <div className="sm:flex-col">
            <Chip
              className="mr-3 mb-1 border-black"
              color={
                task?.priority === "LOW"
                  ? "primary"
                  : task?.priority === "HIGH"
                    ? "danger"
                    : "warning"
              }
              variant="dot"
            >
              {task?.priority}
            </Chip>
            {task?.category && (
              <Tooltip
                content={
                  <div className="w-[100px]">{task.category?.description}</div>
                }
              >
                <Chip color="secondary" variant="flat">
                  {task.category?.name}
                </Chip>
              </Tooltip>
            )}
          </div>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="h-[15vh]">
        <p>{task?.description}</p>
      </CardBody>
      <Divider className="my-2" />
      <div className="flex flex-col ml-[5%]" style={{ fontSize: "12px" }}>
        <Tooltip
          color="primary"
          content="Starting Time"
          offset={1}
          placement="bottom-start"
        >
          <div className="flex gap-3">
            <CalendarIcon size={18} />
            <p> {moment(task?.startDateTime).format("lll")} </p>
          </div>
        </Tooltip>
        <Tooltip
          color="danger"
          content="Deadline"
          offset={1}
          placement="bottom-start"
        >
          <div className="flex gap-3">
            <CalendarCrossIcon size={18} />
            <p> {moment(task?.deadline).format("lll")} </p>
          </div>
        </Tooltip>
        {task?.reminder && (
          <Tooltip
            color="foreground"
            content="Reminder"
            offset={1}
            placement="bottom-start"
          >
            <div className="flex gap-3">
              <RemindersIcon size={18} />
              <p> {moment(task?.reminder).format("lll")} </p>
            </div>
          </Tooltip>
        )}
      </div>
      <Divider className="my-2" />
      <CardFooter>
        <div style={{ display: "flex", gap: "20%" }}>
          <Tooltip
            color="primary"
            content="Edit Task"
            offset={1}
            placement="bottom-start"
          >
            <Button isIconOnly color="warning" onPress={onOpenChange}>
              <EditIcon />
            </Button>
          </Tooltip>
          <Tooltip
            color="danger"
            content="Delete Task"
            offset={1}
            placement="bottom-start"
          >
            <Button
              isIconOnly
              color="danger"
              onPress={() => setDeletConfirmation(true)}
            >
              <DeleteIcon />
            </Button>
          </Tooltip>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row-reverse",
            width: "100%",
          }}
        >
          <Select
            aria-label="Status"
            className="w-[60%]"
            color="secondary"
            id="Status"
            label="Status"
            name="status"
            selectedKeys={[task?.status]}
            selectionMode="single"
            size="sm"
            variant="bordered"
            onSelectionChange={handleStatusChange}
          >
            <SelectItem key="TODO">TODO</SelectItem>
            <SelectItem key="IN_PROGRESS">IN PROGRESS</SelectItem>
            <SelectItem key="COMPLETED">COMPLETED</SelectItem>
          </Select>
        </div>
      </CardFooter>
      {isOpen && (
        <TaskForm isOpen={isOpen} task={task} onOpenChange={onOpenChange} />
      )}
      {deleteConfimation && (
        <DeletConfirmationWindow
          id={task?.id}
          isOpen={deleteConfimation}
          onOpenChange={setDeletConfirmation}
        />
      )}
    </Card>
  );
};

export default TaskCard;
