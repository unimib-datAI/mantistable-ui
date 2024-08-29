import { cn } from "~/lib/utils";
import { CustomIcons } from "./icons";

export const Reduce = ({ disabled, className, ...props }: CustomIcons) => {
  return (
    <div className={cn("", className)} {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="16"
        viewBox="0 0 20 16"
        fill="none"
      >
        <path
          d="M15.8333 1.99998H4.16667C3.24619 1.99998 2.5 2.59694 2.5 3.33332V12.6667C2.5 13.403 3.24619 14 4.16667 14H15.8333C16.7538 14 17.5 13.403 17.5 12.6667V3.33332C17.5 2.59694 16.7538 1.99998 15.8333 1.99998Z"
          stroke="#2A302C"
          strokeWidth="2"
          strokeLinecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M10.667 4.00001H14.667C15.0352 4.00001 15.3337 4.29848 15.3337 4.66667V11.3333C15.3337 11.7015 15.0352 12 14.667 12H10.667V4.00001Z"
          fill="#2A302C"
        />
      </svg>
    </div>
  );
};
