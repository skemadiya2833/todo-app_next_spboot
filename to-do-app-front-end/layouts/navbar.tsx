import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
} from "@nextui-org/navbar";
import NextLink from "next/link";
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";

import RemindersModalContent from "../components/reminder/reminders-container";
import { UserUpdateForm } from "../components/user/update-user-form";
import { UserDeleteConfirmationWindow } from "../components/user/user-deletion-form";
import { UploadCSVForm } from "../components/task/upload-csv";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Logo, RemindersIcon, UploadIcon } from "@/components/common/icons";
import { logoutRequest } from "@/components/user/redux/slices/user-slice";
import { ThemeSwitch } from "@/components/common/theme-switch";

export const Navbar = () => {
  const { isOpen, onOpenChange } = useDisclosure();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const [isClient, setIsClient] = useState(false);
  const [isReminderModalOpen, SetReminderModal] = useState(false);
  const [deleteConfimation, setDeletConfirmation] = useState(false);
  const [uploadFormOpen, setUploadFormOpen] = useState(false);
  const reminders = useAppSelector((state) => state.reminders.reminders);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <NextUINavbar isBordered maxWidth="full">
        <NavbarContent as="div" className="w-[50%] lg:ml-[10%]" justify="start">
          <NavbarBrand>
            <NextLink className="flex items-center gap-1" href="/">
              <Logo />
              <p className="font-bold text-inherit">Todo App</p>
            </NextLink>
          </NavbarBrand>
        </NavbarContent>
        {isReminderModalOpen && (
          <div className="flex flex-col gap-2">
            <Modal
              isOpen={isReminderModalOpen}
              placement="center"
              scrollBehavior="inside"
              size="2xl"
              onOpenChange={() => SetReminderModal(false)}
            >
              <RemindersModalContent />
            </Modal>
          </div>
        )}
        <NavbarContent as="div" className="w-[50%] lg:mr-[10%]" justify="end">
          <Button
            isIconOnly
            variant="bordered"
            onClick={() => setUploadFormOpen(true)}
          >
            <UploadIcon />
          </Button>
          <Badge content={reminders.length}>
            <Button
              isIconOnly
              variant="bordered"
              onClick={() => SetReminderModal(true)}
            >
              <RemindersIcon />
            </Button>
          </Badge>
          {isClient && (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="secondary"
                  name={user.userDetails?.firstName
                    ?.charAt(0)
                    .toLocaleUpperCase()}
                  size="sm"
                  src=""
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem
                  key="profile"
                  isReadOnly
                  className="h-14"
                  textValue="TEXT"
                >
                  <div className="flex gap-5">
                    <p className="font-semibold">
                      Hey! {user.userDetails?.firstName}
                    </p>
                    <ThemeSwitch />
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="email"
                  isReadOnly
                  className="h-14 gap-1"
                  textValue="TEXT"
                >
                  <p>You are Signed in as</p>
                  <p className="font-semibold">{user.userDetails?.email}</p>
                </DropdownItem>
                <DropdownItem
                  key="update_profile"
                  textValue="TEXT"
                  onClick={onOpenChange}
                >
                  Update Profile
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  color="danger"
                  textValue="TEXT"
                  onClick={() => setDeletConfirmation(true)}
                >
                  <span>Delete Account</span>
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  textValue="TEXT"
                  onClick={() => dispatch(logoutRequest())}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
          {isOpen && (
            <UserUpdateForm isOpen={isOpen} onOpenChange={onOpenChange} />
          )}
          {uploadFormOpen && (
            <UploadCSVForm
              isOpen={uploadFormOpen}
              onOpenChange={setUploadFormOpen}
            />
          )}
        </NavbarContent>
      </NextUINavbar>
      {deleteConfimation && user.userDetails && (
        <UserDeleteConfirmationWindow
          isOpen={deleteConfimation}
          onOpenChange={setDeletConfirmation}
        />
      )}
    </>
  );
};
