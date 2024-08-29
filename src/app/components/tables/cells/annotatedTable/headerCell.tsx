import { Badge } from "~/app/components/ui/badge";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { TransformIcon } from "~/app/components/ui/icons/transform";
import TransformPopover from "~/app/components/plugins/transform/transformPopover";

export type HeaderCellProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  tableID: number;
  tableColumnID: number;
  annotation?: string;
  transform?: string;
  hasTransformed?: boolean;
  columnType?: string;
};

const HeaderCell = (headerCellProps: HeaderCellProps) => {
  const {
    tableID,
    tableColumnID,
    title,
    annotation,
    transform,
    hasTransformed,
    columnType,
    className,
    ...props
  } = headerCellProps;
  const [pSelected, setpSelected] = useState<boolean>(false);
  console.log("TYPE", columnType);
  return (
    <div className={cn("flex flex-col items-center", className)} {...props}>
      <div className="flex flex-row items-center justify-center gap-4">
        <p className="text-base font-bold uppercase text-mantis-green-700">
          {title}
        </p>
        {annotation && (
          <Badge
            className="cursor-pointer"
            onClick={() => setpSelected(!pSelected)}
          >
            T
          </Badge>
        )}
        {!hasTransformed && (
          <TransformPopover
            icon={<TransformIcon disabled={false} />}
            tableID={tableID}
            tableColumnID={tableColumnID}
            columnType={columnType}
          />
        )}
      </div>
      <div>
        {annotation && pSelected && (
          <p className="text-mantis-green-300">
            <a
              target="_blank"
              href={`https://www.wikidata.org/wiki/${annotation}`}
            >
              {annotation}
            </a>
          </p>
        )}
      </div>
      <div>
        {transform && (
          <Badge className="bg-mantis-green-300">{transform}</Badge>
        )}
      </div>
    </div>
  );
};

export default HeaderCell;
