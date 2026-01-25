import axios from "axios";
import { toast } from "sonner";

export const signIn = async (provider: "google" | "x") => {
  try {
    const res = await axios.post("/api/auth/signin/oauth", { provider });
    if (res) {
        window.open(res.data.url)?.focus()
    }
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};
