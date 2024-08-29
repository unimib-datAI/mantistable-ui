import React from "react";
import { SheetContent, SheetTitle } from "~/app/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/app/components/ui/table";
import { cn } from "~/lib/utils";
import { AnnotationCPA } from "~/utils/types/tables";
import SheetWrapper from "~/app/components/sheets/sheetWrapper";

export type SheetCPAProps = React.HTMLAttributes<HTMLDivElement> & {
  cpa: AnnotationCPA[];
};

const SheetCPA = (sheetCPAProps: SheetCPAProps) => {
  const { cpa, className, ...props } = sheetCPAProps;
  return (
    <SheetWrapper>
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-4",
          className,
        )}
      >
        <SheetTitle className="text-mantis-green-300">
          Column Property Annotation
        </SheetTitle>
        {cpa.length == 0 && <span>No CPA Annotations Found</span>}
        {cpa.length > 0 && (
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Subject</TableHead>
                <TableHead className="text-center">Predicate</TableHead>
                <TableHead className="text-center">Object</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cpa.map((cpaItem, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center">
                    {cpaItem.idSourceColumn}
                  </TableCell>
                  <TableCell className="text-center text-mantis-green-400">
                    <a
                      target="_blank"
                      href={`http://www.wikidata.org/wiki/Property:${cpaItem.predicates[0]?.id ?? ""}`}
                    >
                      {cpaItem.predicates[0]?.id ?? "undefined"}
                    </a>
                  </TableCell>
                  <TableCell className="text-center">
                    {cpaItem.idTargetColumn}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </SheetWrapper>
  );
};

export default SheetCPA;
