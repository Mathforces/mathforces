import { Button } from "./ui/button";

type Props = {};

function Hero_cto_buttons({}: Props) {
  return (
    <div className="w-80 gap-2  grid grid-cols-12">
      <div className="col-span-8">
        <Button link="/contests" className="w-full">
          Check upcoming contests
        </Button>
      </div>

      <div className="col-span-4">
        <Button link="/sign_up" variant={"outline"} className="w-full">
          Sign Up
        </Button>
      </div>
    </div>
  );
}

export default Hero_cto_buttons;
