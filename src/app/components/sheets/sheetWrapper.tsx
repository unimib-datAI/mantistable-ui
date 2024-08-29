import React from "react";
import { SheetContent } from "~/app/components/ui/sheet";
import { cn } from "~/lib/utils";
import { ExpandSheet } from "~/app/components/ui/icons/expandSheet";
import { Reduce } from "~/app/components/ui/icons/reduce";
import { useState } from "react";

export type SheetCPAProps = React.HTMLAttributes<HTMLDivElement> & {};

const SheetWrapper = (sheetCPAProps: SheetCPAProps) => {
  const { className, children, ...props } = sheetCPAProps;
  const [expanded, setExpanded] = useState<boolean>(false);
  return (
    <SheetContent
      className={cn(
        "flex flex-col",
        expanded ? "w-[calc(100%_-_4rem)]" : "max-w-sm",
      )}
      {...props}
    >
      {expanded == false && (
        <ExpandSheet
          onClick={() => setExpanded((prevState) => !prevState)}
          className="cursor-pointer"
          disabled={false}
        />
      )}
      {expanded && (
        <Reduce
          onClick={() => setExpanded((prevState) => !prevState)}
          className="cursor-pointer"
          disabled={false}
        />
      )}
      <div className={cn(className)}>{children}</div>
    </SheetContent>
  );
};

export default SheetWrapper;
