import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "~/app/components/ui/dialog";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/app/components/ui/popover";
import { PuzzleIcon } from "~/app/components/ui/icons/puzzle";
import AddonList from "~/app/components/plugins/addons/addonsList";
import { Button } from "~/app/components/ui/button";
import { PluginContent } from "~/app/components/plugins/pluginsContent";

export type PuzzleActionProps = React.HTMLAttributes<HTMLDivElement> & {
  tableID: number;
};

const PuzzleAction = (puzzleActionProps: PuzzleActionProps) => {
  const { tableID, className, ...props } = puzzleActionProps;

  return (
    <Popover>
      <PopoverTrigger>
        <PuzzleIcon disabled={false} />
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex flex-col gap-4">
          <Dialog>
            <DialogTrigger>
              <Button className="w-full bg-mantis-green-300">
                Manage Plugin
              </Button>
            </DialogTrigger>
            <DialogContent className="h-3/4 w-3/4">
              <PluginContent />
            </DialogContent>
          </Dialog>
          <AddonList tableID={tableID} />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PuzzleAction;
