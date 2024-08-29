import { DownloadIcon } from "~/app/components/ui/icons/download";
import { Sheet, SheetTrigger } from "~/app/components/ui/sheet";
import SheetExport from "~/app/components/sheets/sheetExport";

export type DownloadActionProps = React.HTMLAttributes<HTMLDivElement> & {
  tableID: number;
  status: "TODO" | "DONE" | "DOING";
};

const DownloadAction = (downloadActionProps: DownloadActionProps) => {
  const { tableID, status, className, ...props } = downloadActionProps;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <DownloadIcon disabled={status != "DONE"} />
      </SheetTrigger>
      <SheetExport tableID={tableID} />
    </Sheet>
  );
};

export default DownloadAction;
