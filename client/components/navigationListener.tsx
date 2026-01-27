"use client";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
interface INavigationListenerProps {}

const NavigationListener: React.FunctionComponent<INavigationListenerProps> = (
  props,
) => {
//   const [userProfile, setUserProfile] = getProfile();
//   const pathname = usePathname();
//   const router = useRouter();
//   useEffect(() => {
//     if (userProfile) {
//       console.log("userprofile: ", userProfile);
//       if (userProfile == "without username") {
//         router.push("/get_username");
//         toast("Almost done, just enter your username")
//       }
//     }
//   }, [userProfile, pathname]);
  return null;
};

export default NavigationListener;
