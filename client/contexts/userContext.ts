"use client";
import { UserProfile } from "@/types/types";
import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";
export type UserProfileState = [
  userProfile: UserProfile | null,
  setUserProfile: Dispatch<SetStateAction<UserProfile | null>>,
];
export const UserContext = createContext<UserProfileState | null>(null);

export const getProfile = () => {
  const profile = useContext(UserContext);
  if (!profile) {
        console.log("can't fetch userprofile")
    throw new Error("user Auth was not found");
  }
  return profile;
};
