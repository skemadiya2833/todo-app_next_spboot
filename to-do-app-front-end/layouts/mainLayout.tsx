import { useEffect, useState } from "react";
import Router from "next/router";
import { toast } from "react-toastify";

import { Head } from "./head";

import ToDoAppFooter from "@/layouts/footer";
import { Navbar } from "@/layouts/navbar";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearInformations } from "@/components/common/slices/information-slice";

export default function HeaderFooterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);
  const userDetails = useAppSelector((state) => state.user.userDetails);
  const infos = useAppSelector((state) => state.informations);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsClient(true);
    if (!userDetails) {
      Router.push("/login");
    }
  }, []);

  useEffect(() => {
    if (infos.error) {
      toast.error(infos.error);
    }
    if (infos.success) {
      toast.success(infos.success);
    }
    if (infos.warning) {
      for (const key of Object.keys(infos.warning)) {
        toast.warn(key + ": " + infos.warning[key]);
      }
    }
    dispatch(clearInformations());
  }, [infos]);

  return (
    <>
      <Head />
      {isClient && (
        <>
          <Navbar />
          <div className="relative flex flex-col">
            <main className="container mx-auto max-w-screen-2xl flex-grow">
              {children}
            </main>
            <ToDoAppFooter />
          </div>
        </>
      )}
    </>
  );
}
