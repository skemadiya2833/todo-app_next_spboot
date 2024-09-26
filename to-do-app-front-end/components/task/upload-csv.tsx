import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { ChangeEvent, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { importCSV } from "@/components/task/redux/slices/tasks-slice";
import { getParams } from "@/utils/common-utils";

export const UploadCSVForm = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (change: boolean) => void;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const dispatch = useAppDispatch();
  const filterState = useAppSelector((state)=>state.filters);
  const handleUpload = () => {
    if (file) {
      dispatch(importCSV({file, params: getParams(filterState)}));
    }
    onOpenChange(false);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  return (
    <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Import Tasks
            </ModalHeader>
            <ModalBody>
              <h3>Upload A CSV File with Fields...</h3>
              <p>
                Title*, description*, Status(Todo, In_progress, Completed),
                Priority ( Low, Medium, High), Startdatetime, Deadline, Reminder
              </p>
              <Input
                isRequired
                accept="text/csv"
                type="file"
                onChange={handleFileChange}
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="danger" isDisabled={!file} onPress={handleUpload}>
                Upload
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
