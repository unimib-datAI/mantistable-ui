import { flexRender, type Table } from "@tanstack/react-table";
import { TableHeader, TableRow, TableHead } from "~/app/components/ui/table";
import { ColumnResizeMode } from "@tanstack/react-table";
import { cn } from "~/lib/utils";

export type AnnotatedTableHeaderProps<TData> =
  React.HTMLAttributes<HTMLDivElement> & {
    table: Table<TData>;
    columnResizeMode: ColumnResizeMode;
  };
export const AnnotatedTableHeader = <TData,>(
  homeTableHeaderCellProps: AnnotatedTableHeaderProps<TData>,
) => {
  const { table, columnResizeMode, className, ...props } =
    homeTableHeaderCellProps;
  return (
    <TableHeader className={cn("bg-mantis-gray-300", className)} {...props}>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <TableHead
                className=""
                {...{
                  key: header.id,
                  colSpan: header.colSpan,
                  style: {
                    width: header.getSize(),
                  },
                }}
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
                <div
                  {...{
                    onDoubleClick: () => header.column.resetSize(),
                    onMouseDown: header.getResizeHandler(),
                    onTouchStart: header.getResizeHandler(),
                    className: `resizer ${
                      table.options.columnResizeDirection
                    } ${header.column.getIsResizing() ? "isResizing" : ""}`,
                    style: {
                      transform:
                        columnResizeMode === "onEnd" &&
                        header.column.getIsResizing()
                          ? `translateX(${
                              (table.options.columnResizeDirection === "rtl"
                                ? -1
                                : 1) *
                              (table.getState().columnSizingInfo.deltaOffset ??
                                0)
                            }px)`
                          : "",
                    },
                  }}
                />
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
};
