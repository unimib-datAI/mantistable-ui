"use client";
import { Badge } from "~/app/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/app/components/ui/card";
import { TrashIcon } from "~/app/components/ui/icons/trash";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export type PluginCardProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  description: string;
  type: string;
};

export const PluginCard = (pluginCardProps: PluginCardProps) => {
  const utils = api.useUtils();
  const deletePlugin = api.plugins.deletePlugins.useMutation({
    onSuccess() {
      utils.plugins.getPlugins.invalidate();
    },
  });
  const { title, description, type, className, ...props } = pluginCardProps;
  return (
    <Card className={cn(className)} {...props}>
      <CardHeader className="flex min-w-[250px] flex-col items-start">
        <CardTitle>{title}</CardTitle>
        <Badge variant={"secondary"} className="bg-mantis-green-300 text-white">
          {type}
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className=" flex items-center space-x-4 rounded-md">
          <p className="text-sm font-medium leading-none">{description}</p>
        </div>
      </CardContent>
      <CardFooter>
        <TrashIcon
          onClick={() => deletePlugin.mutate(title)}
          className="cursor-pointer"
          disabled={false}
        />
      </CardFooter>
    </Card>
  );
};
