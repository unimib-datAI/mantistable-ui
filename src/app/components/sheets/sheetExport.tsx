import React from "react";
import { SheetTitle } from "~/app/components/ui/sheet";
import { cn } from "~/lib/utils";
import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/app/components/ui/select";
import Loader from "~/app/components/ui/loader";
import { Error } from "~/app/components/error/error";
import SheetWrapper from "~/app/components/sheets/sheetWrapper";
import { env } from "~/env";

export type SheetExportProps = React.HTMLAttributes<HTMLDivElement> & {
  tableID: number;
};

const SheetExport = (sheetCPAProps: SheetExportProps) => {
  const { tableID, className, ...props } = sheetCPAProps;
  const getExports = api.plugins.getPlugins.useQuery("EXPORTS");
  const [link, setLink] = useState<string | undefined>(undefined);

  return (
    <SheetWrapper>
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-4",
          className,
        )}
      >
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <SheetTitle className="text-mantis-green-300">
            Export Table
          </SheetTitle>
          {getExports.isLoading && <Loader />}
          {getExports.isError && (
            <Error
              errorTitle="An Error Occurred"
              errorDescription="Please check export module availability"
            />
          )}
          {getExports.isSuccess && (
            <Select
              onValueChange={(value) =>
                setLink(
                  `${env.NEXT_PUBLIC_PLUGINS_HOST}/export/${value}/${tableID}`,
                )
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select export type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Export type</SelectLabel>
                  {getExports.data.plugins.map((exportItem, index) => (
                    <SelectItem key={index} value={exportItem.name}>
                      {exportItem.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="max-w-md">
          {link != undefined && (
            <a className="w-full" href={link} download>
              <Button className="w-full bg-mantis-green-300">Export</Button>
            </a>
          )}
        </div>
      </div>
    </SheetWrapper>
  );
};

export default SheetExport;
