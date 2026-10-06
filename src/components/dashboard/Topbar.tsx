import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useApp } from "@/context/AppContext";
import { Button } from "../guiv2/Button";

export function Topbar() {
  const { isLoaded, clear, currTab } = useApp();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        {/* SIDEBAR TRIGGER */}
        <SidebarTrigger className="-ml-1" />

        {/* SEPARATOR */}
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        {/* CURRENT TAB DISPLAY */}
        <div className="flex flex-row gap-1">
          {/* create a border around tabname */}
          <p>Current Tab:</p>
          <span className="border border-gray-300 rounded text-sm p-2">
            {currTab}
          </span>
        </div>

        {/* SEPARATOR */}
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        {/* SHOW LOADED STATUS */}
        <div className="ml-auto flex items-center gap-2">
          <p
            className={`px-3 py-1 ${
              isLoaded ? "text-green-600" : "text-muted-foreground"
            }`}
          >
            Loaded Status: {isLoaded ? "Loaded" : "Not Loaded"}
          </p>
          {/* IF LOADED, RENDER UNLOAD BUTTON */}
          {isLoaded && (
            <Button
              onClick={() => {
                clear();
              }}
            >
              Unload
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
