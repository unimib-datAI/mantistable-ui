import { cn } from "~/lib/utils";

export type TitleProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
};
export const Title = (titleProps: TitleProps) => {
  const { title, className, ...props } = titleProps;
  return (
    <div className={cn("flex self-start", className)} {...props}>
      <h1 className="text-lg font-bold">{title}</h1>
    </div>
  );
};
