import React from "react";
import { cn } from "~/lib/utils";

export type BlockTracerProps = React.HTMLAttributes<HTMLDivElement> & {
  icon: React.ElementType;
  title: string;
  description: string;
  selected: boolean;
};

const BlockTracer = (blockTracerProps: BlockTracerProps) => {
  const { selected, className } = blockTracerProps;
  return (
    <div
      className={cn(
        "bg-table-white flex w-96 flex-row justify-center gap-4 rounded-sm bg-white p-4",
        selected ? "border-2 border-mantis-green-300" : "border-0 opacity-70",
        className,
      )}
    >
      <blockTracerProps.icon
        className={cn(
          "self-center",
          selected ? "text-mantis-green-300" : "text-header-cell-gray",
        )}
        size={40}
      />
      <div className="flex flex-col">
        <span className="text-base font-bold text-mantis-green-600">
          {blockTracerProps.title}
        </span>
        <span className="text-base text-black">
          {blockTracerProps.description}
        </span>
      </div>
    </div>
  );
};

export default BlockTracer;
