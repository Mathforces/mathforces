import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import z from "zod";
import { schema } from "./page";
import parse from "html-react-parser";
export const signupWithEmailAndPassword = async (
  data: z.infer<typeof schema>,
) => {
  const errorMessage = `<p>
              there seems to have been a problem signing you up in our
              servers{" "}
            </p>`;
  const successMessage = `<p>Check your email to activate your account</p>`;

  const { data: signupRes, error: signupError } = await supabase.auth.signUp({
    options: {
      data: {
        username: data.username,
      },
    },
    email: data.email,
    password: data.password,
  });

  if (signupError) {
    toast.error(
      "Couldn't Signup, check your internet connection or try again later",
      {
        description: parse(errorMessage),
      },
    );
    console.log("error fo2 ya ba4a");
    return null;
  } else if (signupRes.user) {

    const { data: profileRes, error: profileError } = await supabase
      .from("profiles")
      .insert({
        user_id: signupRes.user.id,
        username: data.username,
      });
    if (profileError) {
      toast.error(
        "Couldn't Signup, check your internet connection or try again later",
        {
          description: parse(errorMessage),
        },
      );

    console.log("error t7t ya ba4a");
    return null;
    } else {
      toast.success("You Signed up Successfully", {
        description: parse(successMessage),
      });
      return signupRes.user.id;
    }
  }
};
