import React from "react";
import { SheetTitle } from "~/app/components/ui/sheet";
import { cn } from "~/lib/utils";
import SheetWrapper from "~/app/components/sheets/sheetWrapper";
import Addon from "~/app/components/sheets/addons/addon";

export type SheetAddonProps = React.HTMLAttributes<HTMLDivElement> & {
  table_id: number;
  addon: string;
};

const SheetAddon = (sheetAddonProps: SheetAddonProps) => {
  const { table_id, addon, className, ...props } = sheetAddonProps;
  return (
    <SheetWrapper>
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-4",
          className,
        )}
      >
        <SheetTitle className="text-mantis-green-300">{addon}</SheetTitle>
        <div className="w-full">
          <Addon table_id={table_id} addon={addon} />
        </div>
      </div>
    </SheetWrapper>
  );
};

export default SheetAddon;
