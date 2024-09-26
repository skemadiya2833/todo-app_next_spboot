import React from "react";
import {
  ModalContent,
  ModalHeader,
  ModalBody,
  Avatar,
  Spinner,
} from "@nextui-org/react";
import moment from "moment";

import { useAppSelector } from "@/redux/hooks";

export default function RemindersModalContent() {
  const remindersState = useAppSelector((state) => state.reminders);

  return (
    <ModalContent>
      <ModalHeader className="flex flex-col">Upcoming Reminders</ModalHeader>
      <ModalBody>
        {remindersState.loading ? (
          <div className="w-[50vh] m-auto">
            <Spinner
              color="secondary"
              label="Loading Reminders"
              labelColor="secondary"
            />
          </div>
        ) : remindersState.reminders.length > 0 ? (
          remindersState.reminders.map((reminderTask, _index) => (
            <div
              key={reminderTask.id}
              className="w-[100%] flex gap-4 mt-1 border-1 h-[100%] pt-1 pl-2"
            >
              <Avatar
                showFallback
                alt="Task Icon"
                color="danger"
                name={reminderTask.title.charAt(0).toUpperCase()}
                radius="md"
                size="lg"
                src={reminderTask.thumbnail ?? ""}
              />
              <div className="flex flex-col">
                <p className="text-bold text-md">{reminderTask.title}</p>
                <p className="text-bold text-sm">
                  Reminder: {moment(reminderTask.reminder!).fromNow()}
                </p>
                <p className="text-bold text-sm">
                  Deadline: {moment(reminderTask.deadline).fromNow()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center mb-2">No Upcoming Reminders</p>
        )}
        <p className="text-center mb-2">
          Reminders are Updated Every 5 Minutes
        </p>
      </ModalBody>
    </ModalContent>
  );
}
