import Right_Side from "@/components/Contest/Right_Side";
import SuggestedContest from "@/components/Contest/suggestedContest";

export default function Page() {
  // if (error) {
  //   return (
  //     <main className="flex flex-col justify-center items-center h-screen gap-4 px-3 text-center">
  //       <AlertCircle className="w-20 h-20 text-destructive" />
  //       <h1 className="text-2xl font-bold">Error Loading Contests</h1>
  //       <p className="text-lg text-muted-foreground max-w-md">{error}</p>
  //       <div className="mt-5 flex justify-center items-center gap-4">
  //         <Button variant="primary" onClick={() => window.location.reload()}>
  //           Retry
  //         </Button>
  //         <Link href={"/contests"}>
  //           <Button variant="outline">Back to Contests</Button>
  //         </Link>
  //       </div>
  //     </main>
  //   );
  // }
  //
  return (
    <main className="flex flex-col md:flex-row items-center lg:justify-evenly gap-5 lg:gap-10 md:items-start overflow-hidden">
      <SuggestedContest />

      <Right_Side />
    </main>
  );
}
