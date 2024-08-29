import { type Table, PaginationState } from "@tanstack/react-table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "../ui/pagination";
import { cn } from "~/lib/utils";

const availablePages = (
  numberOfPages: number,
  currentSelected: number,
): number[] => {
  console.log(currentSelected, numberOfPages);
  if (currentSelected <= 2) {
    return Array.from(Array(numberOfPages <= 2 ? numberOfPages : 3).keys());
  }

  if (currentSelected >= numberOfPages - 2) {
    console.log("here 1");
    return [numberOfPages - 3, numberOfPages - 2, numberOfPages - 1];
  }
  console.log("here 2");
  return [currentSelected - 2, currentSelected - 1, currentSelected];
};

export type PaginationProps<TData> = React.HTMLAttributes<HTMLDivElement> & {
  table: Table<TData>;
  pagination: PaginationState;
  numberOfPages: number;
};

export const PaginationWrapper = <TData,>(
  paginationProps: PaginationProps<TData>,
) => {
  const { table, pagination, numberOfPages, className, ...props } =
    paginationProps;

  return (
    <Pagination className={cn(className)} {...props}>
      <PaginationContent>
        {pagination.pageIndex != 0 && (
          <PaginationItem>
            <PaginationPrevious
              className="cursor-pointer"
              onClick={() => table.previousPage()}
            />
          </PaginationItem>
        )}
        {availablePages(numberOfPages, pagination.pageIndex).map(
          (pgnumber, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                className="cursor-pointer"
                onClick={() => table.setPageIndex(pgnumber)}
                isActive={pagination.pageIndex == pgnumber ? true : false}
              >
                {pgnumber + 1}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        {pagination.pageIndex < numberOfPages - 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {pagination.pageIndex != numberOfPages - 1 && (
          <PaginationItem>
            <PaginationNext
              className="cursor-pointer"
              onClick={() => table.nextPage()}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};
