import { Button } from "@/components/ui/button";
import { Google, FaceBook } from "@/components/ui/Custom_Icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MathNoise from "@/components/ui/MathNoise";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <main className="h-screen flex justify-center items-center max-w-[1444]! px-0">
      <section className="w-full lg:w-2/4 px-5 md:px-10 max-w-4xl my-auto ">
        {/* Heading */}
        <div>
          <h3 className="text-text">Get Started Now</h3>
          <p className="text-text-muted">
            Enter your credentials to create a new account
          </p>
        </div>

        {/* sign Up with Google or FaceBook section */}
        <section className="grid grid-cols-2 gap-6  mt-5 max-w-2xl mx-auto">
          <Button
            variant={"outline"}
            className="flex justify-center items-center gap-3 bg-card"
          >
            <Google className="w-12 h-12" />
            Google
          </Button>
          <Button
            variant={"outline"}
            className="flex justify-center items-center gap-3 bg-card"
          >
            <FaceBook className="w-12 h-12" />
            FaceBook
          </Button>
        </section>

        {/* Or */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <Separator className="bg-border-muted"/>
          </div>
          <div className="relative flex justify-center text-sm uppercase">
            <span className="bg-background px-2 text-text-muted">Or</span>
          </div>
        </div>
        {/* sign Up with Email */}

        <form
          action=""
          className="max-w-2xl mx-auto flex flex-col gap-5  "
        >
          <div className="flex flex-col gap-2">
            <Label>Username or email</Label>
            <Input placeholder="piKiller or pikiller@gmail.com"></Input>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Password</Label>
            <Input placeholder="*********"></Input>
          </div>
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
}
