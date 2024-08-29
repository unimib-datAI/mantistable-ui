import React from "react";
import { HiRefresh } from "react-icons/hi";
import { Button } from "~/app/components/ui/button";
import { AnnotateIcon } from "~/app/components/ui/icons/annotate";
import { ExpandIcon } from "~/app/components/ui/icons/expand";
import { Separator } from "~/app/components/ui/separator";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import DownloadAction from "~/app/components/headers/actions/downloadAction";
import PuzzleAction from "~/app/components/headers/actions/puzzleAction";

export type TablePanelProps = React.HTMLAttributes<HTMLDivElement> & {
  tableID: number;
  status: "TODO" | "DONE" | "DOING";
};

type PanelOptionProps = {
  name: string;
  icon: React.ReactNode;
  click: () => void;
  disabled: boolean;
};

export const TablePanel = (headerProps: TablePanelProps) => {
  const utils = api.useUtils();
  const annotateTable = api.tables.annotate.useMutation({
    onSuccess() {
      utils.tables.getTable.invalidate();
    },
  });

  const { tableID, status, className, ...props } = headerProps;

  const panelOptions: PanelOptionProps[] = [
    //{
    //  name: "expand",
    //  icon: <ExpandIcon disabled={status != "DONE"} />,
    //  click: () => console.log("Pressed expand"),
    //  disabled: status != "DONE",
    //},
    {
      name: "annotate",
      icon: <HiRefresh size={24} />,
      click: () => utils.tables.getTable.invalidate(),
      disabled: status == "DONE",
    },
    {
      name: "refresh",
      icon: <AnnotateIcon disabled={status != "TODO"} />,
      click: () => annotateTable.mutate(tableID),
      disabled: status != "TODO",
    },
    {
      name: "download",
      icon: <DownloadAction tableID={tableID} status={status} />,
      click: () => console.log("Pressed download"),
      disabled: status != "DONE",
    },
    {
      name: "puzzle",
      icon: <PuzzleAction tableID={tableID} />,
      click: () => console.log("Pressed puzzle"),
      disabled: false,
    },
  ];

  return (
    <div
      className={cn(
        "flex min-h-[4rem] flex-row items-center justify-start bg-mantis-green-400",
        className,
      )}
      {...props}
    >
      <Separator className="h-3/4 bg-white" orientation="vertical" />
      <div className="flex flex-1 flex-row px-4">
        <div className="ml-auto flex flex-row items-center gap-4">
          {panelOptions.map((buttonOption, index) => {
            return (
              <Button
                key={index}
                disabled={buttonOption.disabled}
                className="bg-transparent p-3 hover:bg-mantis-green-300"
                onClick={buttonOption.click}
              >
                {buttonOption.icon}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
