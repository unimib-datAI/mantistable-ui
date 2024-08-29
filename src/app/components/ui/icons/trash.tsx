import { cn } from "~/lib/utils";
import { CustomIcons } from "./icons";

export const TrashIcon = ({ disabled, className, ...props }: CustomIcons) => {
  return (
    <div className={cn("text-mantis-green-600", className)} {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
      >
        <path
          d="M2.25 4.5H15.75"
          stroke="#959595"
          strokeWidth="2"
          strokeLinecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M14.25 4.5V15C14.25 15.75 13.5 16.5 12.75 16.5H5.25C4.5 16.5 3.75 15.75 3.75 15V4.5"
          stroke="#959595"
          strokeWidth="2"
          strokeLinecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M6 4.5V3C6 2.25 6.75 1.5 7.5 1.5H10.5C11.25 1.5 12 2.25 12 3V4.5"
          stroke="#959595"
          strokeWidth="2"
          strokeLinecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M7.5 8.25V12.75"
          stroke="#959595"
          strokeWidth="2"
          strokeLinecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M10.5 8.25V12.75"
          stroke="#959595"
          strokeWidth="2"
          strokeLinecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  );
};
