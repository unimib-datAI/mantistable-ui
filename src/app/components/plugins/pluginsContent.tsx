import { HiPlus } from "react-icons/hi";
import { PluginGrid } from "~/app/components/plugins/pluginGrid";
import { Button } from "~/app/components/ui/button";
import { DialogHeader, DialogTitle } from "~/app/components/ui/dialog";
import { cn } from "~/lib/utils";
import {
  AlertDialog,
  AlertDialogTrigger,
} from "~/app/components/ui/alert-dialog";
import { PluginAdd } from "~/app/components/plugins/pluginAdd";

export type PluginContentProps = React.HTMLAttributes<HTMLDivElement> & {};

export const PluginContent = (pluginContentProps: PluginContentProps) => {
  const { className, ...props } = pluginContentProps;
  return (
    <div className={cn("p-8")} {...props}>
      <DialogHeader className="flex h-full flex-col items-start gap-4">
        <DialogTitle>Plugins</DialogTitle>
        <AlertDialog>
          <AlertDialogTrigger>
            <Button className="flex flex-row items-center gap-2 bg-mantis-green-300 text-mantis-green-500 hover:bg-mantis-green-400">
              <HiPlus size={18} /> Add Your Plugin
            </Button>
          </AlertDialogTrigger>
          <PluginAdd />
        </AlertDialog>
        <div className="flex-1">
          <PluginGrid className="max-h-96" />
        </div>
      </DialogHeader>
    </div>
  );
};
