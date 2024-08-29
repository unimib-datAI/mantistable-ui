import { flexRender, type Table } from "@tanstack/react-table";
import { TableBody, TableRow, TableCell } from "~/app/components/ui/table";
import { cn } from "~/lib/utils";

export type AnnotatedTableBodyProps<TData> =
  React.HTMLAttributes<HTMLDivElement> & {
    table: Table<TData>;
  };
export const AnnotatedTableBody = <TData,>(
  homeTableHeaderProps: AnnotatedTableBodyProps<TData>,
) => {
  const { table, className, ...props } = homeTableHeaderProps;
  return (
    <TableBody className={cn(className)} {...props}>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow className="bg-white" key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell
                {...{
                  key: cell.id,
                  style: {
                    width: cell.column.getSize(),
                  },
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell className="h-24 text-center">No Tables inserted</TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};
