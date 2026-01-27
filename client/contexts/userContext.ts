"use client";
import { UserProfile } from "@/types/types";
import { redirect, usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  type Dispatch,
  type SetStateAction,
} from "react";
import { toast } from "sonner";
export type UserProfileState = [
  userProfile: UserProfile | null | "without username",
  setUserProfile: Dispatch<
    SetStateAction<UserProfile | null | "without username">
  >,
];
export const UserContext = createContext<UserProfileState | null>(null);

export const useUserProfile = () => {
  const profile = useContext(UserContext);
  if (!profile) {
    console.log("can't fetch userprofile");
    throw new Error("user Auth was not found");
  }
  const [userprofile] = profile;
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (userprofile == "without username") {
      toast("Almost done, just enter your username");
      router.push("/get_username");
      return;
    }
  }, [userprofile, pathname]);
  return profile;
};
