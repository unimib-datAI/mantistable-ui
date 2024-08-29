import { cn } from "~/lib/utils";

export type TableCellProps = React.HTMLAttributes<HTMLDivElement> & {
  text: string;
  annotation?: string;
  transform?: string;
};

const CustomTableCell = (tableCellProps: TableCellProps) => {
  const { text, annotation, transform, className, ...props } = tableCellProps;
  return (
    <div className={cn("flex flex-col ", className)} {...props}>
      <p className="text-base font-normal text-mantis-green-700">{text}</p>
      {annotation && (
        <p className="text-mantis-green-400">
          <a
            target="_blank"
            href={`https://www.wikidata.org/wiki/${annotation}`}
          >
            {annotation}
          </a>
        </p>
      )}
    </div>
  );
};

export default CustomTableCell;
