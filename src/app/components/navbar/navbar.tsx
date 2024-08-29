import { cn } from "~/lib/utils";
import Statistics from "~/app/components/statistics/statistics";
import { Badge } from "~/app/components/ui/badge";
import { PaginationWrapper } from "~/app/components/tables/pagination";
import { type Table as TSTB, PaginationState } from "@tanstack/react-table";
import { getNumberOfPages } from "~/app/components/tables/utils";
import { Sheet, SheetTrigger } from "~/app/components/ui/sheet";
import { AnnotationCPA } from "~/utils/types/tables";
import SheetCPA from "../sheets/sheetCPA";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/app/components/ui/select";

export type NavbarProps<TData> = React.HTMLAttributes<HTMLDivElement> & {
  cpa: AnnotationCPA[];
  table: TSTB<TData>;
  data: TData[];
  pagination: PaginationState;
  status: "TODO" | "DOING" | "DONE";
  tableName: string;
};
export const Navbar = <TData,>(navbarProps: NavbarProps<TData>) => {
  const {
    cpa,
    table,
    data,
    pagination,
    status,
    tableName,
    className,
    ...props
  } = navbarProps;

  return (
    <div
      className={cn(
        "flex h-14 max-w-full flex-row items-center justify-between bg-mantis-gray-300 p-2",
        className,
      )}
      {...props}
    >
      <div className="flex flex-row items-center gap-4 p-2">
        <h1 className="text-lg font-bold text-mantis-green-500">{tableName}</h1>
        <Statistics
          className="border-none bg-mantis-gray-300"
          stats={[
            { text: "Total Rows", value: data.length },
            { text: "Total Columns", value: Object.keys(data[0] ?? {}).length },
          ]}
        />
        <Badge
          variant={
            status == "TODO" ? "todo" : status == "DOING" ? "doing" : "done"
          }
        >
          {status}
        </Badge>
        {status == "DONE" && (
          <Sheet>
            <SheetTrigger asChild>
              <Badge className="cursor-pointer" variant={"default"}>
                P
              </Badge>
            </SheetTrigger>
            <SheetCPA cpa={cpa} />
          </Sheet>
        )}
      </div>
      <div className="ml-auto">
        <Select
          defaultValue="10"
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className="max-w-[180px] bg-transparent">
            <SelectValue placeholder="Pagination Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Number of Rows</SelectLabel>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="40">40</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div>
        {table.getRowCount() > pagination.pageSize && (
          <PaginationWrapper
            pagination={pagination}
            numberOfPages={getNumberOfPages(
              table.getRowCount(),
              pagination.pageSize,
            )}
            table={table}
          />
        )}
      </div>
    </div>
  );
};
