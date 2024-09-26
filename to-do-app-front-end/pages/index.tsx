import { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { useDisclosure } from "@nextui-org/react";
import router from "next/router";

import TaskContainer from "@/components/task/task-container";
import HeaderFooterLayout from "@/layouts/mainLayout";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { filterTasks } from "@/components/task/redux/slices/tasks-slice";
import { TaskForm } from "@/components/task/task-form";
import { fetchReminders } from "@/components/reminder/redux/slices/reminder-slice";
import { getParams } from "@/utils/common-utils";

export default function IndexPage() {
  const [isClient, setIsClient] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const userDetails = useAppSelector((state) => state.user.userDetails);
  const filterState = useAppSelector((state) => state.filters);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsClient(true);
    if (!userDetails) {
      router.push("/login");
    }
    dispatch(filterTasks(getParams(filterState)));
    dispatch(fetchReminders());
    setInterval(
      () => {
        dispatch(fetchReminders());
      },
      5 * 60 * 1000,
    );
  }, []);

  return (
    <HeaderFooterLayout>
      {isClient && (
        <>
          <TaskContainer />
          {isOpen && <TaskForm isOpen={isOpen} onOpenChange={onOpenChange} />}
          <div className="fixed bottom-20 w-full lg:w-[90%] xl:w-[80%] z-10">
            <Button
              className="rounded-full m-auto float-right mr-5"
              color="secondary"
              size="lg"
              variant="shadow"
              onPress={onOpen}
            >
              Create New Task
            </Button>
          </div>
        </>
      )}
    </HeaderFooterLayout>
  );
}
