import { cn } from "~/lib/utils";
import { CustomIcons } from "./icons";

export const ExpandIcon = ({ disabled, className, ...props }: CustomIcons) => {
  return (
    <div className={cn("", className)} {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={disabled ? "#FEFEFE" : "white"}
      >
        <g clip-path="url(#clip0_257_116)">
          <path
            d="M12 22V16"
            stroke="#FEFEFE"
            strokeWidth="3"
            strokeLinecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12 8V2"
            stroke="#FEFEFE"
            strokeWidth="3"
            strokeLinecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M4 12H2"
            stroke="#FEFEFE"
            strokeWidth="3"
            strokeLinecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M10 12H8"
            stroke="#FEFEFE"
            strokeWidth="3"
            strokeLinecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M16 12H14"
            stroke="#FEFEFE"
            strokeWidth="3"
            strokeLinecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M22 12H20"
            stroke="#FEFEFE"
            strokeWidth="3"
            strokeLinecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M15 19L12 22L9 19"
            stroke="#FEFEFE"
            strokeWidth="3"
            strokeLinecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M15 5L12 2L9 5"
            stroke="#FEFEFE"
            strokeWidth="3"
            strokeLinecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_257_116">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};
