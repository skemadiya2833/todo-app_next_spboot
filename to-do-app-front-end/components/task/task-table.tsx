import {
  Avatar,
  Button,
  Chip,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import moment from "moment";
import React, { useState } from "react";

import { DeleteIcon, EditIcon } from "../common/icons";

import { TaskForm } from "./task-form";
import { DeletConfirmationWindow } from "./delete-confirmation";

import { useAppSelector } from "@/redux/hooks";
import { Task } from "@/components/task/interfaces/task";

const columns = [
  { name: "Task", id: "task" },
  { name: "Priority & Deadline", id: "priority" },
  { name: "Status", id: "status" },
  { name: "Actions", id: "actions" },
];

export const RenderTable = () => {
  const { isOpen, onOpenChange } = useDisclosure();
  const [editingTask, setEditingTask] = useState<undefined | Task>(undefined);
  const [deleteConfimation, setDeletConfirmation] = useState(false);

  const taskState = useAppSelector((state) => state.tasks);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    onOpenChange();
  };

  const handleDelete = (task: Task) => {
    setEditingTask(task);
    setDeletConfirmation(true);
  };

  const renderCell = React.useCallback((task: Task, columnKey: React.Key) => {
    switch (columnKey) {
      case "task":
        return (
          <div className="flex gap-3">
            <Avatar
              showFallback
              alt="Task Icon"
              className="min-w-[55px]"
              color="secondary"
              name={task.title.charAt(0).toUpperCase()}
              radius="sm"
              size="lg"
              src={task.thumbnail ?? ""}
            />
            <div className="flex flex-col justify-center">
              <p className="text-bold text-sm capitalize">{task.title}</p>
              <p className="text-bold text-sm capitalize">
                {task.description.length <= 50
                  ? task.description
                  : task.description.substring(0, 49) + "..."}
              </p>
            </div>
          </div>
        );
      case "priority":
        return (
          <div className="flex flex-col">
            <Chip
              color={
                task.priority === "LOW"
                  ? "primary"
                  : task.priority === "HIGH"
                    ? "danger"
                    : "warning"
              }
              size="sm"
              variant="solid"
            >
              {task.priority}
            </Chip>
            <p className="text-bold text-sm capitalize">
              {moment(task.deadline).format("lll")}
            </p>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize"
            color={
              task.status === "COMPLETED"
                ? "success"
                : new Date(task.deadline) < new Date()
                  ? "danger"
                  : task.status === "IN_PROGRESS"
                    ? "primary"
                    : "warning"
            }
            size="sm"
            variant="flat"
          >
            {task.status.replace("_", " ")}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Edit Task">
              <Button
                isIconOnly
                color="warning"
                onPress={() => handleEdit(task)}
              >
                <EditIcon />
              </Button>
            </Tooltip>
            <Tooltip color="danger" content="Delete Task">
              <Button
                isIconOnly
                color="danger"
                onPress={() => handleDelete(task)}
              >
                <DeleteIcon />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return "";
    }
  }, []);

  return taskState.loading ? (
    <div className="flex justify-center mt-[25vh]">
      <Spinner color="secondary" label="Loading Tasks" labelColor="secondary" />
    </div>
  ) : (
    <>
      <Table aria-label="task-table" className="px-3">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.id}
              align={column.id === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        {
          <TableBody
            emptyContent="No tasks, Start Creating..."
            items={taskState.tasks}
          >
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        }
      </Table>
      {isOpen && (
        <TaskForm
          isOpen={isOpen}
          task={editingTask}
          onOpenChange={onOpenChange}
        />
      )}
      {deleteConfimation && (
        <DeletConfirmationWindow
          id={editingTask!.id}
          isOpen={deleteConfimation}
          onOpenChange={setDeletConfirmation}
        />
      )}
    </>
  );
};
