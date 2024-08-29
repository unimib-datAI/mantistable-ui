"use client";

import { Table } from "~/app/components/ui/table";
import { useState } from "react";
import * as React from "react";
import { AnnotatedTableBody } from "./annotatedTableBody";
import { AnnotatedTableHeader } from "./annotatedTableHeader";
import { cn } from "~/lib/utils";
import { Navbar } from "~/app/components/navbar/navbar";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  PaginationState,
} from "@tanstack/react-table";
import { AnnotationCPA } from "~/utils/types/tables";

export type TableAnnotatedProps<TData> =
  React.HTMLAttributes<HTMLDivElement> & {
    cpa: AnnotationCPA[];
    data: TData[];
    columns: ColumnDef<TData>[];
    status: "TODO" | "DOING" | "DONE";
    tableName: string;
  };

export const TableAnnotated = <TData,>(
  tableListProps: TableAnnotatedProps<TData>,
) => {
  const { cpa, data, columns, status, tableName, className, ...props } =
    tableListProps;
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    columns,
    data,
    columnResizeMode: "onChange",
    columnResizeDirection: "ltr",
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
    defaultColumn: {
      size: 600,
      minSize: 200,
      maxSize: 1000,
    },
  });
  return (
    <div className={cn("flex h-full flex-col bg-white", className)} {...props}>
      <div className="flex-1 overflow-x-auto">
        <Table
          {...{
            style: {
              width: table.getCenterTotalSize(),
            },
          }}
        >
          <AnnotatedTableHeader columnResizeMode="onChange" table={table} />
          <AnnotatedTableBody table={table} />
        </Table>
      </div>
      <Navbar
        cpa={cpa}
        status={status}
        data={data}
        table={table}
        pagination={pagination}
        tableName={tableName}
      />
    </div>
  );
};
