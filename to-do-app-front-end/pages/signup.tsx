"use client";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

import SignupForm from "@/components/user/signupform";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearInformations } from "@/components/common/slices/information-slice";

export default function Signup() {
  const infos = useAppSelector((state) => state.informations);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (infos.error) {
      toast.error(infos.error);
    }
    if (infos.success) {
      toast.success(infos.success);
    }
    if (infos.warning) {
      for (const key of Object.keys(infos.warning)) {
        toast.warn(infos.warning[key]);
      }
    }
    dispatch(clearInformations());
  }, [infos]);

  return (
    <div className="flex h-[100vh] border border-gray-200 shadow bg-gray-200 w-[100%]">
      <div className="m-auto w-[100%]">
        <SignupForm />
      </div>
    </div>
  );
}
