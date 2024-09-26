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

import { EyeFilledIcon, EyeSlashFilledIcon } from "../common/icons";

import { useAppDispatch } from "@/redux/hooks";
import { deleteAccount } from "@/components/user/redux/slices/user-slice";
import { validatePassword } from "@/utils/validation-utils";

export const UserDeleteConfirmationWindow = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (change: boolean) => void;
}) => {
  const dispatch = useAppDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleDelete = () => {
    const passError = validatePassword(password);

    if (passError) {
      setError(passError);

      return;
    }
    dispatch(deleteAccount(password));
    onOpenChange(false);
  };

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  return (
    <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Alert!</ModalHeader>
            <ModalBody>
              <h3>To Continue,</h3>
              <p>Please Enter Your Password:</p>
              <Input
                fullWidth
                color="secondary"
                endContent={
                  <button
                    aria-label="toggle password visibility"
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
                errorMessage={error}
                id="password"
                isInvalid={error.length > 0}
                label="Password"
                name="password"
                placeholder="******"
                type={isVisible ? "text" : "password"}
                value={password}
                variant="bordered"
                onChange={handleChange}
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button color="danger" onPress={handleDelete}>
                Delete Account
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
