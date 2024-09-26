import React, { FormEvent, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Spacer,
} from "@nextui-org/react";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { UserUpdate } from "@/components/user/interfaces/user-update";
import { userUpdate } from "@/components/user/redux/slices/user-slice";
import { validateFirstName, validateLastName } from "@/utils/validation-utils";

export const UserUpdateForm = ({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
}) => {
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user);
  const [userUpdateDTO, setUserUpdateDTO] = useState<UserUpdate>({
    firstName: userState.userDetails?.firstName ?? "",
    lastName: userState.userDetails?.lastName ?? "",
  });
  const [errors, setErrors] = useState<UserUpdate>({
    firstName: "",
    lastName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserUpdateDTO({
      ...userUpdateDTO,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newErrors: UserUpdate = {
      firstName: validateFirstName(userUpdateDTO.firstName) ?? "",
      lastName: validateLastName(userUpdateDTO.lastName) ?? "",
    };

    setErrors(newErrors);
    if (newErrors.firstName.trim() || newErrors.lastName.trim()) {
      return;
    }
    if (userState.userDetails) {
      dispatch(userUpdate(userUpdateDTO));
    }
    onOpenChange();

    return;
  };

  return (
    <>
      <Modal
        disableAnimation
        isOpen={isOpen}
        placement="center"
        size="2xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                Update User Details
              </ModalHeader>
              <ModalBody className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
                <div>
                  <p>Email: </p>
                  <p>{userState.userDetails?.email}</p>
                </div>
                <div>
                  <Input
                    fullWidth
                    isRequired
                    color="secondary"
                    errorMessage={errors.firstName}
                    isInvalid={errors.firstName.length > 0}
                    label="First Name"
                    name="firstName"
                    value={userUpdateDTO.firstName}
                    variant="bordered"
                    onChange={handleChange}
                  />
                  <Spacer y={4} />
                  <Input
                    fullWidth
                    isRequired
                    color="secondary"
                    errorMessage={errors.lastName}
                    isInvalid={errors.lastName.length > 0}
                    label="Last Name"
                    name="lastName"
                    value={userUpdateDTO.lastName}
                    variant="bordered"
                    onChange={handleChange}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="secondary" type="submit" variant="ghost">
                  Update
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
