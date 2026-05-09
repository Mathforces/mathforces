import axios from "axios";

export const signIn = async (provider: "google" | "x") => {
  try {
    const currentPath = `${window.location.pathname}${window.location.search}`;
    const redirectPath = ["/sign_in", "/sign_up"].includes(
      window.location.pathname,
    )
      ? "/"
      : currentPath;

    const res = await axios.post("/api/auth/signin/oauth", {
      provider,
      redirectPath,
    });
    if (res) {
      window.open(res.data.url)?.focus();
    }
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

const isUsernameUnique = async (value: string): Promise<boolean> => {
  try {
    const res = await axios.post("/api/auth/signup/username_exists", {
      username: value,
    });
    const isUnique = !res.data.exists;
    return isUnique;
  } catch (err: unknown) {
    console.error(
      axios.isAxiosError<{ error?: string }>(err)
        ? err.response?.data?.error
        : err,
    );
    return false;
  }
};

export const debouncedIsUsernameUnique = () => {
  let timeoutId: NodeJS.Timeout;
  let lastPromise: Promise<boolean>;

  return async (value: string): Promise<boolean> => {
    return new Promise((resolve) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        lastPromise = isUsernameUnique(value);
        resolve(await lastPromise);
      }, 500);
    });
  };
};
