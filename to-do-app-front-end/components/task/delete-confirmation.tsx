import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { deleteTask } from "@/components/task/redux/slices/tasks-slice";
import { getParams } from "@/utils/common-utils";

export const DeletConfirmationWindow = ({
  id,
  isOpen,
  onOpenChange,
}: {
  id: number;
  isOpen: boolean;
  onOpenChange: (change: boolean) => void;
}) => {
  const dispatch = useAppDispatch();
  const filterState = useAppSelector((state)=>state.filters);
  const handleDelete = () => {
    onOpenChange(false);
    dispatch(deleteTask({id, params: getParams(filterState)}));
  };

  return (
    <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Alert!</ModalHeader>
            <ModalBody>
              <h3>This Action is irreversible.</h3>
              <p>Are you sure you want to delete this task ?</p>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="danger" onPress={handleDelete}>
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
