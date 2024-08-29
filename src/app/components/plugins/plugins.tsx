import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "~/app/components/ui/dialog";
import { PuzzleIcon } from "~/app/components/ui/icons/puzzle";
import { PluginContent } from "~/app/components/plugins/pluginsContent";
import { cn } from "~/lib/utils";
export type PluginsProps = React.HTMLAttributes<HTMLDivElement> & {};

export const Plugins = (pluginsProps: PluginsProps) => {
  const { className, ...props } = pluginsProps;
  return (
    <div className={cn(className)} {...props}>
      <Dialog>
        <DialogTrigger>
          <PuzzleIcon disabled={false} />
        </DialogTrigger>
        <DialogContent className="h-3/4 w-3/4">
          <PluginContent />
        </DialogContent>
      </Dialog>
    </div>
  );
};
