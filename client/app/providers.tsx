"use client";
import { UserContext } from "@/contexts/userContext";
import { supabase } from "@/lib/supabase/client";
import { UserProfile } from "@/types/types";
import * as React from "react";
import { useState, useEffect } from "react";
import { useUser } from "./hooks/useUser";
import { useRouter } from "next/navigation";
interface IProivdersProps {
  children: React.ReactNode;
}

const Proivders: React.FunctionComponent<IProivdersProps> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null | 'without username'>(null);
  const [accWithoutUsername, setAccWithoutUsername] = useState(false); 
  const { user, loading} = useUser();
  const router = useRouter();
  const handleGetUserProfile = async () => {
    console.log("user: ", user);
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id)
      .single();
    if (error) {
      console.error("Error fetching user profile:", error);
      if(user?.app_metadata.provider !== 'email'){
        setUserProfile('without username')
        router.push('/get_username')
      }
      return;
    }
    setUserProfile(profile);
  };
  useEffect(() => {
    if (user) {
      handleGetUserProfile();
    }
    console.log("I was here")
  }, [user]);
  if(loading) return null;
  return (
    <UserContext.Provider value={[userProfile, setUserProfile]}>
      {children}
    </UserContext.Provider>
  );
};

export default Proivders;
