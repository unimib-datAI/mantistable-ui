import { flexRender, type Table } from "@tanstack/react-table";
import { TableBody, TableRow, TableCell } from "~/app/components/ui/table";
import { columns } from "./columns";
import { cn } from "~/lib/utils";

export type HomeTableBodyProps<TData> = React.HTMLAttributes<HTMLDivElement> & {
  table: Table<TData>;
};
export const HomeTableBody = <TData,>(
  homeTableHeaderProps: HomeTableBodyProps<TData>,
) => {
  const { table, className, ...props } = homeTableHeaderProps;
  return (
    <TableBody className={cn(className)} {...props}>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow className="bg-white" key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell className="border-none" key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            No Tables to visualize
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};
