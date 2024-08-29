import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/app/components/ui/popover";
import TransformPopoverContent from "./content/transformerPopoverContent";
import { useState } from "react";
import TransformPopoverPreview from "./content/transformPopoverPreview";

export type TransformPopover = React.HTMLAttributes<HTMLDivElement> & {
  icon: React.ReactNode;
  tableID: number;
  tableColumnID: number;
  columnType?: string;
};

const TransformPopover = (puzzleActionProps: TransformPopover) => {
  const { tableID, icon, tableColumnID, columnType, className, ...props } =
    puzzleActionProps;
  const [preview, setPreview] = useState<{
    available: boolean;
    selected: string;
  }>({
    available: false,
    selected: "",
  });
  return (
    <Popover>
      <PopoverTrigger>{icon}</PopoverTrigger>
      <PopoverContent
        onInteractOutside={() =>
          setPreview((prevState) => ({ ...prevState, available: false }))
        }
        className="min-w-[25rem] p-4"
      >
        {preview.available ? (
          <TransformPopoverPreview
            backAction={setPreview}
            tableColumnID={tableColumnID}
            tableID={tableID}
            transform={preview.selected}
          />
        ) : (
          <TransformPopoverContent
            onConfirm={setPreview}
            columnType={columnType}
          />
        )}
      </PopoverContent>
    </Popover>
  );
};

export default TransformPopover;
