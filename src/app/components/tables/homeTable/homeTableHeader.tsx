import { flexRender, type Table } from "@tanstack/react-table";
import { TableHeader, TableRow, TableHead } from "~/app/components/ui/table";
import { cn } from "~/lib/utils";

export type HomeTableHeaderProps<TData> =
  React.HTMLAttributes<HTMLDivElement> & {
    table: Table<TData>;
  };
export const HomeTableHeader = <TData,>(
  homeTableHeaderCellProps: HomeTableHeaderProps<TData>,
) => {
  const { table, className, ...props } = homeTableHeaderCellProps;
  return (
    <TableHeader className={cn("bg-mantis-gray-300", className)} {...props}>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <TableHead key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
};
