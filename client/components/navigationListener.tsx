"use client";
import { useProfile } from "@/app/store";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
interface INavigationListenerProps {}

const NavigationListener: React.FunctionComponent<INavigationListenerProps> = (
  props,
) => {
  const isWithoutUsername = useProfile((state) => state.isWithoutUsername);
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (isWithoutUsername) {
      router.push("/get_username");
      toast("Almost done, just enter your username");
    }
  }, [isWithoutUsername, pathname]);
  return null;
};

export default NavigationListener;
