import { cn } from "~/lib/utils";
import { CustomIcons } from "./icons";

export const UnavailableIcon = ({
  disabled,
  className,
  ...props
}: CustomIcons) => {
  return (
    <div className={cn("text-mantis-green-600", className)} {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <circle cx="8" cy="8" r="8" fill="#FF5512" />
      </svg>
    </div>
  );
};
