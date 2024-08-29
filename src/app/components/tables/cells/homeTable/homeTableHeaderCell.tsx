import { cn } from "~/lib/utils";
export type HomeTableHeaderCellProps = React.HTMLAttributes<HTMLDivElement> & {
  text: string;
};
export const HomeTableHeaderCell = (
  homeTableHeaderCellProps: HomeTableHeaderCellProps,
) => {
  const { text, className, ...props } = homeTableHeaderCellProps;
  return (
    <div className={cn(className)} {...props}>
      {text.toUpperCase()}
    </div>
  );
};
