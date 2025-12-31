import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface Props {
  title?: string;
  className?: string;
}

const Loading = ({ title, className }: Props) => {
  return (
    <main
      className={cn(
        "w-full h-screen flex flex-col justify-center items-center gap-4",
        className
      )}
    >
      <Loader2 className="w-16 h-16 animate-spin text-primary" />
      <p className="text-lg text-muted-foreground">
        Loading {title && title}...
      </p>
    </main>
  );
};

export default Loading;
