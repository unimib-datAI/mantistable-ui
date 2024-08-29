import { Error } from "~/app/components/error/error";
import { PluginCard } from "~/app/components/plugins/pluginCard";
import Loader from "~/app/components/ui/loader";
import { ScrollArea, ScrollBar } from "~/app/components/ui/scroll-area";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export type PluginGridProps = React.HTMLAttributes<HTMLDivElement> & {};

export const PluginGrid = (pluginGridProps: PluginGridProps) => {
  const getExports = api.plugins.getPlugins.useQuery("ALL");
  const { className, ...props } = pluginGridProps;

  if (getExports.isSuccess) {
    return (
      <ScrollArea>
        <div
          className={cn(
            "grid w-full grid-cols-3 gap-4 2xl:grid-cols-5",
            className,
          )}
          {...props}
        >
          {getExports.data.plugins.length == 0 && <p>No plugins available</p>}
          {getExports.data.plugins.map((exportPlugin, index) => {
            return (
              <PluginCard
                key={index}
                title={exportPlugin.configurations.name}
                description={exportPlugin.configurations.description}
                type={exportPlugin.configurations.type}
              />
            );
          })}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    );
  }

  if (getExports.isError) {
    return (
      <div className="flex items-center justify-center">
        <Error
          errorTitle="Plugins Error"
          errorDescription="Error on loading plugins, please check connectivity"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <Loader />
    </div>
  );
};
