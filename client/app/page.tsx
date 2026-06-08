"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Hero from "@/components/Hero";
import { useProfile } from "@/app/store";

export default function Page() {
  const user = useProfile((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/contests");
    }
  }, [user, router]);

  return (
    <main className="max-w-full! px-2 relative overflow-hidden m-0 p-0">
      <Hero />
    </main>
  );
}
