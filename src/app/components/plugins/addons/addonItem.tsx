import { cn } from "~/lib/utils";

import SheetAddon from "~/app/components/sheets/addons/sheetAddon";
import { Badge } from "~/app/components/ui/badge";
import { Sheet, SheetTrigger } from "~/app/components/ui/sheet";
import { Plugin } from "~/utils/types/export";

export type AddonItemProps = React.HTMLAttributes<HTMLDivElement> & {
  tableID: number;
  addonItem: Plugin;
};

const AddonItem = (addonItemProps: AddonItemProps) => {
  const { tableID, addonItem, className, ...props } = addonItemProps;

  return (
    <div className={cn(className)} {...props}>
      <Sheet>
        <SheetTrigger asChild>
          <Badge className="mr-auto cursor-pointer bg-mantis-green-400 px-4 py-2">
            {addonItem.name}
          </Badge>
        </SheetTrigger>
        <SheetAddon table_id={tableID} addon={addonItem.name} />
      </Sheet>
    </div>
  );
};

export default AddonItem;
