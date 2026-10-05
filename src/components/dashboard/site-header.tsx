import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useApp } from "@/context/AppContext";

export function SiteHeader() {
  const { isLoaded, clear } = useApp();

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
        <h1 className="text-base font-medium">Documents</h1>

        {/* ACTIONS */}
        <div className="ml-auto flex items-center gap-2">
          <Button
            nativeButton={false}
            variant="ghost"
            size="sm"
            className="hidden sm:flex"
            render={
              <a
                href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
                rel="noopener noreferrer"
                target="_blank"
                className="dark:text-foreground"
              />
            }
          >
            GitHub
          </Button>
        </div>

        {/* SHOW LOADED STATUS */}
        <p>Loaded Status: {isLoaded ? "Loaded" : "Not Loaded"}</p>

        {/* IF LOADED, RENDER UNLOAD BUTTON */}
        {isLoaded && (
          <Button
            nativeButton={false}
            variant="secondary"
            size="sm"
            className="ml-2"
            onClick={() => {
              clear();
            }}
          >
            Unload
          </Button>
        )}
      </div>
    </header>
  );
}
