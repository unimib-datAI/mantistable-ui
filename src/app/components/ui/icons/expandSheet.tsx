import { cn } from "~/lib/utils";
import { CustomIcons } from "./icons";

export const ExpandSheet = ({ disabled, className, ...props }: CustomIcons) => {
  return (
    <div className={cn("", className)} {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M6 4L2 8L6 12"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M2 8H11.3333"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M14 12.6667V3.33334"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  );
};
