import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Props = {};

const SKEW_STYLE = "-skew-x-40 rounded-md";
function RegionalRanking({}: Props) {
  return (
    <div className="px-5">
      <div className="relative">
        <div
          className={`absolute top-0 left-0 ${SKEW_STYLE} w-55 h-full  bg-bg-light `}
        ></div>
        <Tabs className="w-full items-center" defaultValue="global">
          <TabsList className="bg-transparent space-x-3 py-1 px-2">
            <TabsTrigger
              value="global"
              className="px-5 relative bg-transparent data-[state=active]:*:!bg-primary"
            >
              <div
                className={`absolute top-0 left-0 ${SKEW_STYLE} w-full h-full`}
              ></div>

              <span className="z-50">Global</span>
            </TabsTrigger>
            {/* TODO: Apply local user region */}
            <TabsTrigger
              value="my_region"
              className="px-5 relative bg-transparent data-[state=active]:*:!bg-primary"
            >
              <div
                className={`absolute top-0 left-0 ${SKEW_STYLE} w-full h-full`}
              ></div>

              <span className="z-50">Middle East</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}

export default RegionalRanking;
