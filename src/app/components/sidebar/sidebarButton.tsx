import * as React from "react";
import Link from "next/link";
import { Separator } from "~/app/components/ui/separator";
import { cn } from "~/lib/utils";

export type SidebarButtonProps = React.HTMLAttributes<HTMLDivElement> & {
  icon: React.ReactNode;
  index: number;
  isButtonSelected: boolean;
  link: string;
  action: React.Dispatch<React.SetStateAction<number>>;
};
export const SidebarButton = (sidebarButtonProps: SidebarButtonProps) => {
  const { index, link, action, isButtonSelected, icon, className, ...props } =
    sidebarButtonProps;
  return (
    <Link href={link}>
      <div
        onClick={() => action(sidebarButtonProps.index)}
        className={cn(
          "flex h-full w-full flex-row",
          isButtonSelected ? "bg-mantis-green-600" : "",
          className,
        )}
        {...props}
      >
        {isButtonSelected && (
          <Separator className="h-full w-1 bg-mantis-green-400" />
        )}
        <div className="flex flex-1 cursor-pointer items-center justify-center p-4">
          {icon}
        </div>
      </div>
    </Link>
  );
};
