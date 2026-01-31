"use client";
import { supabase } from "@/lib/supabase/client";
import { UserProfile } from "@/types/types";
import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "./store";
interface IProivdersProps {
  children: React.ReactNode;
}

const Proivders: React.FunctionComponent<IProivdersProps> = ({ children }) => {
  const authInitialize = useProfile((state) => state.initialize);
  useEffect(() => {
    authInitialize();
  }, [authInitialize]);
  return <>{children}</>;
};

export default Proivders;
