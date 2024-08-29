import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/app/components/ui/table";

export type TableComparisonProps = React.HTMLAttributes<HTMLDivElement> & {
  column: string[];
};

const TableComparison = (
  transformerPopoverContentProps: TableComparisonProps,
) => {
  const { column, className, ...props } = transformerPopoverContentProps;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="border-none bg-mantis-gray-300 text-center font-bold text-black">
            Col0
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {column.map((cell, index) => (
          <TableRow key={index}>
            <TableCell className="border-l-0 border-r-0 p-1 text-sm font-medium text-mantis-gray-200">
              {cell}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableComparison;
