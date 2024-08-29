"use client";

import { Table } from "~/app/components/ui/table";
import { useState } from "react";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  PaginationState,
} from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/app/components/ui/select";
import { Input } from "~/app/components/ui/input";
import { HomeTableHeader } from "./homeTableHeader";
import { HomeTableBody } from "./homeTableBody";
import { PaginationWrapper } from "../pagination";
import { getNumberOfPages } from "../utils";
import { cn } from "~/lib/utils";

export type HomeTableProps<TData> = React.HTMLAttributes<HTMLDivElement> & {
  data: TData[];
  columns: ColumnDef<TData>[];
};

export const HomeTable = <TData,>(tableListProps: HomeTableProps<TData>) => {
  const { data, columns, className, ...props } = tableListProps;
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const table = useReactTable({
    columns,
    data,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });
  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      {/* Filters */}
      <div className="mr-auto flex flex-row gap-2">
        <div className="min-w-[250px]">
          <Input
            placeholder="Filter Tables by Name..."
            value={
              (table.getColumn("tableName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("tableName")?.setFilterValue(event.target.value)
            }
          />
        </div>
        <div>
          <Select
            onValueChange={(value) => {
              if (value == "all") {
                table.getColumn("status")?.setFilterValue("");
              } else {
                table.getColumn("status")?.setFilterValue(value);
              }
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="all">ALL</SelectItem>
                <SelectItem value="todo">TODO</SelectItem>
                <SelectItem value="doing">DOING</SelectItem>
                <SelectItem value="done">DONE</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table>
        <HomeTableHeader table={table} />
        <HomeTableBody table={table} />
      </Table>
      {table.getRowCount() > 5 && (
        <PaginationWrapper
          pagination={pagination}
          numberOfPages={getNumberOfPages(table.getRowCount(), 5)}
          table={table}
        />
      )}
    </div>
  );
};
