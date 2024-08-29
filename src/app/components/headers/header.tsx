import { Separator } from "~/app/components/ui/separator";
import { cn } from "~/lib/utils";
import { Logo } from "../logo";

export type HeaderProps = React.HTMLAttributes<HTMLDivElement> & {};

export const Header = (headerProps: HeaderProps) => {
  const { className, ...props } = headerProps;
  return (
    <div
      className={cn(
        "flex flex-1 flex-row items-center justify-start",
        className,
      )}
      {...props}
    >
      <Logo />
      <Separator orientation="vertical" className="h-3/4 w-px bg-white" />
    </div>
  );
};
