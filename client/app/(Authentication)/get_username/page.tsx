"use client";
import { Button } from "@/components/ui/button";
import { Google, FaceBook } from "@/components/ui/Custom_Icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MathNoise from "@/components/ui/MathNoise";
import { Separator } from "@/components/ui/separator";
import { Plus, X } from "lucide-react";
import Link from "next/link";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useMemo, useState } from "react";
import { BsExclamationCircle } from "react-icons/bs";
import { TiTick } from "react-icons/ti";
import axios from "axios";
import { debouncedIsUsernameUnique, signIn } from "../utils";
import { FaSquareXTwitter, FaXTwitter } from "react-icons/fa6";
import { useUser } from "@/app/hooks/useUser";
import { useUserProfile } from "@/contexts/userContext";
import { useRouter } from "next/navigation";
interface IPageProps {}

const Page: React.FunctionComponent<IPageProps> = (props) => {
  const schema = z.object({
    username: z
      .string()
      .min(2, "username should be at least 2 characters long")
      .max(100, "username should be at most 100 characters long")
      .refine(async (val) => {
        const res = await isUsernameUnique(val);
        return res;
      }, "Username is already taken"),
  });
  const isUsernameUnique = useMemo(() => debouncedIsUsernameUnique(), []);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const [usernameExists, setUsernameExists] = useState<boolean | null>(null);
  const { user } = useUser();
  const [userprofile, setUserProfile] = useUserProfile();
  const router = useRouter();
  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      const profileData = {
        id: user?.id,
        username: data.username,
        email: user?.email,
      };
      const res = await axios.post(
        "/api/auth/signup/create_profile",
        profileData,
      );
      if (res) {
        setUserProfile(res.data.profileData);
        toast("Successfully Signed in!");
        router.push("/");
      }
    } catch (err: any) {
      if (err.response && err.response.data.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("Sign in failed. Please try again.");
      }
      console.error("Sign in error:", err);
    }
  };

  useEffect(() => {
    if (usernameExists === true) {
      form.setError("username", {
        message: "Username is already taken",
      });
    } else if (usernameExists === false) {
      form.clearErrors("username");
    }
  }, [usernameExists]);

  useEffect(() => {
    if (userprofile !== "without username") {
      router.push("/");
    }
  }, [userprofile]);

  return (
    <main className="h-screen flex justify-center items-center max-w-[1444]! px-0">
      <section className="w-full lg:w-2/4 px-5 md:px-10 max-w-4xl my-auto space-y-6">
        {/* Heading */}
        <div>
          <h3 className="text-text">Almost Done!</h3>
          <p className="text-text-muted">
            Enter your username to complete your sign in process
          </p>
        </div>

        {/* sign Up with Email */}
        <form
          className="max-w-2xl mx-auto flex flex-col gap-5"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <div className="relative w-full">
                  <Input
                    {...field}
                    id="username"
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g. piKiller2000"
                    className={
                      usernameExists === true
                        ? "border-destructive dark:destructive/40"
                        : usernameExists === false
                          ? "border-success dark:ring-success/40"
                          : ""
                    }
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {usernameExists ? (
                      <BsExclamationCircle className="w-5 h-5 text-red-500" />
                    ) : usernameExists === false ? (
                      <TiTick className="w-5 h-5 text-success" />
                    ) : null}
                  </div>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
        <div className="text-center text-xs my-4">
          Don't have an account?{" "}
          <Link href={"/sign_up"} className="Link">
            Sign Up
          </Link>
        </div>
      </section>
      <section className="h-full w-2/4 hidden lg:flex justify-center items-center bg-acc ent relative overflow-hidden select-none">
        {/* Shadow layer */}
        <h1 className="absolute text-[150px] font-bold text-primary opacity-30 blur-3xl scale-110 flex flex-col items-center pointer-events-none ">
          <span>
            <span className="text-[170px]">N</span>UM
          </span>
          <span>ITZ</span>
        </h1>

        {/* Main text */}
        <h1 className="text-[150px] font-bold flex flex-col items-center z-50">
          <div>
            <span className="text-[190px]">N</span>UM
          </div>
          <div className="flex justify-center items-center">
            <div className="flex flex-col justify-center items-center gap-2">
              <Plus strokeWidth={6} size={50} className="text-primary" />
              <div className="w-6 h-20 bg-foreground"></div>
            </div>
            TZ
          </div>
        </h1>

        <MathNoise />
      </section>
    </main>
  );
};

export default Page;
